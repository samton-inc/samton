// 홈(App.tsx)을 정적 HTML로 미리 그린다.
//
// 게시물은 마크다운이라 renderMarkdown이 직접 HTML을 만들지만, 홈은 React 컴포넌트라
// 같은 방식으로 그릴 수 없다. 그래서 App.tsx를 esbuild로 묶어 renderToStaticMarkup으로
// 실제 React가 그리는 결과를 그대로 받아 온다. 손으로 옮겨 적지 않으므로 화면과
// 프리렌더가 어긋날 일이 없다.
//
// 세 가지를 바꿔 끼운다.
//   - motion/react: 애니메이션 시작 상태(opacity 0 등)가 정적 HTML에 남으면 크롤러에게
//     감춘 내용이 된다. 최종 상태와 같은 맨 요소로 그리도록 대체한다.
//   - CSS: 서버 렌더에는 필요 없으므로 빈 모듈로 대체한다.
//   - 이미지: vite build가 남긴 manifest의 해시 주소를 쓴다. 그래야 브라우저가
//     같은 파일을 두 번 받지 않는다.

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";

import path from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";

const assetExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif", ".csv"]);

// motion/react 대체 모듈. 애니메이션 전용 속성은 DOM 속성으로 새어 나가지 않게 걸러낸다.
const motionStub = `
import { createElement, forwardRef } from "react";

const animationProps = new Set([
  "initial", "animate", "exit", "transition", "variants", "custom", "inherit",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView", "viewport",
  "layout", "layoutId", "layoutDependency", "layoutScroll", "layoutRoot",
  "drag", "dragConstraints", "dragElastic", "dragMomentum", "dragPropagation",
  "dragSnapToOrigin", "dragTransition", "dragListener", "dragDirectionLock",
  "onAnimationStart", "onAnimationComplete", "onUpdate",
  "onHoverStart", "onHoverEnd", "onTap", "onTapStart", "onTapCancel",
  "onDragStart", "onDrag", "onDragEnd", "onDirectionLock", "onDragTransitionEnd",
  "onViewportEnter", "onViewportLeave", "onLayoutAnimationStart", "onLayoutAnimationComplete",
  "onBeforeLayoutMeasure", "onLayoutMeasure",
  "transformTemplate", "transformValues", "style_", "_dragX", "_dragY",
]);

const strip = (props) => {
  const next = {};
  for (const key of Object.keys(props ?? {})) {
    if (animationProps.has(key)) continue;
    next[key] = props[key];
  }
  return next;
};

const cache = new Map();
const componentFor = (tag) => {
  if (!cache.has(tag)) {
    const Component = forwardRef((props, ref) => createElement(tag, { ...strip(props), ref }));
    Component.displayName = "motion." + tag;
    cache.set(tag, Component);
  }
  return cache.get(tag);
};

export const motion = new Proxy(
  (tag) => componentFor(typeof tag === "string" ? tag : "div"),
  {
    get: (_target, tag) => (typeof tag === "string" ? componentFor(tag) : undefined),
  },
);
export const m = motion;

// 애니메이션이 끝난 뒤 화면에 남는 것이 자식 요소이므로 그대로 그린다.
export const AnimatePresence = ({ children }) => children ?? null;
export const LayoutGroup = ({ children }) => children ?? null;
export const MotionConfig = ({ children }) => children ?? null;
export const LazyMotion = ({ children }) => children ?? null;
export const Reorder = { Group: ({ children }) => children ?? null, Item: ({ children }) => children ?? null };
export const domAnimation = {};
export const domMax = {};
export const useReducedMotion = () => true;
export const useInView = () => true;
export const useAnimate = () => [() => {}, () => Promise.resolve()];
export const useAnimation = () => ({ start: () => Promise.resolve(), stop: () => {}, set: () => {} });
export const useAnimationControls = useAnimation;
export const useScroll = () => ({ scrollY: { get: () => 0, on: () => () => {} }, scrollYProgress: { get: () => 0, on: () => () => {} } });
export const useMotionValue = (initial) => ({ get: () => initial, set: () => {}, on: () => () => {} });
export const useTransform = () => ({ get: () => 0, set: () => {}, on: () => () => {} });
export const useSpring = useMotionValue;
export const animate = () => Promise.resolve();
export default { motion, AnimatePresence };
`;

// 홈 컴포넌트를 한 번만 묶어 세 언어가 같은 번들을 쓴다.
const bundleApp = async ({ projectRoot, assetUrlFor }) => {
  const entry = `
    import { createElement } from "react";
    import App from "@/app/App.tsx";
    export const createApp = () => createElement(App);
  `;

  const result = await esbuild.build({
    stdin: { contents: entry, resolveDir: projectRoot, loader: "tsx", sourcefile: "render-home-entry.tsx" },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    target: "node20",
    jsx: "automatic",
    logLevel: "silent",
    // react를 외부로 두고 ESM으로 뽑으므로 의존 패키지도 ESM 진입점을 써야 한다.
    // CJS 빌드가 섞이면 require("react")가 남아 실행 시 터진다(lucide-react).
    mainFields: ["module", "main"],
    conditions: ["import", "module", "default"],
    // react와 react-dom은 이 스크립트가 쓰는 것과 같은 인스턴스여야 훅이 동작한다.
    external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom/client", "react-dom/server"],
    plugins: [
      {
        name: "samton-ssr",
        setup(build) {
          // vite.config.ts의 '@' 별칭과 같게 맞춘다. 확장자와 index 파일 해석은
          // esbuild 리졸버에 넘겨야 '@/i18n' 같은 디렉터리 임포트가 풀린다.
          build.onResolve({ filter: /^@\// }, async (args) => {
            const target = path.join(projectRoot, "src", args.path.slice(2));
            const resolved = await build.resolve(target, {
              kind: args.kind,
              resolveDir: path.dirname(target),
            });
            if (resolved.errors.length > 0) return resolved;
            return { path: resolved.path, namespace: resolved.namespace };
          });
          build.onResolve({ filter: /^motion\/react$|^framer-motion$/ }, () => ({
            path: "samton-motion-stub",
            namespace: "samton-motion",
          }));
          build.onLoad({ filter: /.*/, namespace: "samton-motion" }, () => ({
            contents: motionStub,
            loader: "js",
          }));
          build.onLoad({ filter: /\.css$/ }, () => ({ contents: "", loader: "js" }));
          build.onLoad({ filter: /.*/ }, (args) => {
            const extension = path.extname(args.path).toLowerCase();
            if (!assetExtensions.has(extension)) return null;
            return { contents: `export default ${JSON.stringify(assetUrlFor(args.path))};`, loader: "js" };
          });
        },
      },
    ],
  });

  return result.outputFiles[0].text;
};

// App.tsx는 그리는 도중에 window.location과 localStorage를 읽는다(readLocale, localizedHref).
// useEffect는 renderToStaticMarkup에서 실행되지 않으므로 이 둘만 채우면 된다.
const installBrowserGlobals = (locale, siteOrigin) => {
  const storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  const location = {
    origin: siteOrigin,
    protocol: "https:",
    host: new URL(siteOrigin).host,
    hostname: new URL(siteOrigin).hostname,
    pathname: "/",
    // readLocale이 ?lang= 을 먼저 보므로 이 값으로 언어를 정한다.
    search: `?lang=${locale}`,
    hash: "",
    href: `${siteOrigin}/?lang=${locale}`,
  };
  const element = { lang: "", style: {}, classList: { add() {}, remove() {}, toggle() {} } };
  const documentStub = {
    documentElement: element,
    body: { ...element, style: {} },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => ({ ...element, setAttribute() {}, appendChild() {} }),
  };
  const windowStub = {
    location,
    localStorage: storage,
    sessionStorage: storage,
    document: documentStub,
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    scrollTo: () => {},
    innerWidth: 1280,
    innerHeight: 900,
    history: { pushState: () => {}, replaceState: () => {} },
    navigator: { userAgent: "samton-prerender" },
  };
  const previous = { window: globalThis.window, document: globalThis.document, localStorage: globalThis.localStorage };
  globalThis.window = windowStub;
  globalThis.document = documentStub;
  globalThis.localStorage = storage;
  return () => {
    globalThis.window = previous.window;
    globalThis.document = previous.document;
    globalThis.localStorage = previous.localStorage;
  };
};

// 언어별 홈 본문 HTML을 돌려준다. 실패하면 예외를 던져 빌드를 멈춘다.
export const renderHome = async ({ projectRoot, locales, siteOrigin, assetUrlFor }) => {
  const bundled = await bundleApp({ projectRoot, assetUrlFor });
  // 번들이 react를 외부 모듈로 남겨 두므로 node_modules를 찾을 수 있는 위치에 써야 한다.
  // 시스템 임시 폴더에 두면 Node가 react를 해석하지 못한다.
  const workDir = mkdtempSync(path.join(projectRoot, "node_modules", ".samton-home-"));
  const bundlePath = path.join(workDir, "home.mjs");
  writeFileSync(bundlePath, bundled);

  try {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const html = {};
    for (const locale of locales) {
      const restore = installBrowserGlobals(locale, siteOrigin);
      try {
        // 모듈 최상위에서도 window를 읽을 수 있으므로 언어마다 새로 불러온다.
        const module = await import(`${pathToFileURL(bundlePath).href}?locale=${locale}`);
        html[locale] = renderToStaticMarkup(module.createApp());
      } finally {
        restore();
      }
    }
    return html;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
};
