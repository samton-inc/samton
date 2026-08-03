// 빌드된 dist/index.html과 dist/insights/index.html을 템플릿 삼아
// 언어(ko, en, ja) × 페이지(홈, 소식·인사이트 목록, 게시물)마다 정적 HTML을 만든다.
// 한국어는 접두사 없이 루트를 쓰고, 영어·일본어는 /en, /ja 경로에 같은 구조로 놓는다.
//
// 각 페이지에는 제목·설명·Open Graph 태그와 함께 canonical, hreflang,
// JSON-LD 구조화 데이터(Organization / WebSite / WebPage / BreadcrumbList /
// CollectionPage+ItemList / Article·NewsArticle)를 언어에 맞게 넣는다.
// 마지막으로 언어별 대체 주소를 담은 dist/sitemap.xml을 만든다.
// `npm run build`(vite build 다음 단계)에서 실행된다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src", "content", "insights", "posts");
const distDir = path.join(root, "dist");
const siteOrigin = "https://samton.co.kr";
const organizationId = `${siteOrigin}/#organization`;
const websiteId = `${siteOrigin}/#website`;

// src/i18n/index.tsx의 supportedLocales, localePathPrefix와 같은 규칙을 쓴다.
const locales = ["ko", "en", "ja"];
const localePrefix = (locale) => (locale === "ko" ? "" : `/${locale}`);
const absoluteUrl = (locale, pagePath) => `${siteOrigin}${localePrefix(locale)}${pagePath}`;
const outputPath = (locale, pagePath) =>
  path.join(distDir, localePrefix(locale).slice(1), pagePath.slice(1), "index.html");

const localeMeta = {
  ko: {
    htmlLang: "ko",
    ogLocale: "ko_KR",
    insightsName: "소식·인사이트",
    backToList: "소식·인사이트로 돌아가기",
    home: {
      title: "Samton | 맞춤형 DMRV 데이터 기술기업",
      description: "검증된 데이터 기술로 기업에 맞는 DMRV 시스템을 구축하는 환경·탄소·데이터 기술기업, 주식회사 샘튼.",
    },
    insights: {
      title: "소식·인사이트 | Samton",
      description: "DMRV와 탄소시장 기초, 샘튼 소식, 최신 리포트와 기술·조직 이야기를 전하는 샘튼 소식·인사이트.",
    },
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    insightsName: "News & Insights",
    backToList: "Back to News & Insights",
    home: {
      title: "Samton | Tailored DMRV Data Technology Company",
      description:
        "Samton is an environmental, carbon and data technology company that builds DMRV systems tailored to each business on proven data technology.",
    },
    insights: {
      title: "News & Insights | Samton",
      description:
        "Samton's news and insights on DMRV, carbon market fundamentals, company updates, market reports, and stories about our technology and team.",
    },
  },
  ja: {
    htmlLang: "ja",
    ogLocale: "ja_JP",
    insightsName: "ニュース・インサイト",
    backToList: "ニュース・インサイトに戻る",
    home: {
      title: "Samton | カスタムDMRVデータテクノロジー企業",
      description:
        "検証されたデータ技術で企業に合わせたDMRVシステムを構築する環境・炭素・データテクノロジー企業、株式会社Samton。",
    },
    insights: {
      title: "ニュース・インサイト | Samton",
      description:
        "DMRVと炭素市場の基礎、Samtonのニュース、最新レポート、技術と組織の物語をお届けするニュース・インサイト。",
    },
  },
};

// 분류 폴더명을 구조화 데이터의 articleSection 표기로 바꾼다.
const categoryLabels = {
  "DMRV-이해하기": "DMRV 이해하기",
  "탄소시장-기초": "탄소시장 기초",
  "샘튼-소식": "샘튼 소식",
  "리포트": "리포트",
  "기술-조직-이야기": "기술·조직 이야기",
};
// 회사 활동을 알리는 글은 NewsArticle, 나머지 설명·분석 글은 Article로 표시한다.
const newsCategories = new Set(["샘튼-소식"]);
// 프리렌더 본문에 실제 사진을 넣을 분류. 샘튼-소식 폴더의 사진은 전부 우리가
// 현장에서 직접 찍은 것이라 크롤러가 읽을 값어치가 있다. 나머지 분류의 삽화는
// 사진 대신 같은 크기의 빈 자리(스켈레톤)만 넣어 화면이 밀리지 않게 한다.
const prerenderImageCategories = new Set(["샘튼-소식"]);

// 빌드 결과의 모든 페이지가 이 노드를 쓴다. 소스의 index.html, insights/index.html에도
// 같은 @id로 같은 내용을 적어 두었으니 회사 정보가 바뀌면 세 곳을 함께 고친다.
// 언어가 달라도 같은 회사를 가리키도록 이름과 @id는 모든 페이지에서 동일하게 둔다.
const organizationNode = {
  "@type": "Organization",
  "@id": organizationId,
  name: "주식회사 샘튼",
  alternateName: ["Samton", "샘튼"],
  url: `${siteOrigin}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${siteOrigin}/#logo`,
    url: `${siteOrigin}/favicon.png`,
    width: 621,
    height: 591,
    caption: "Samton",
  },
  image: { "@id": `${siteOrigin}/#logo` },
  description: "검증된 데이터 기술로 기업에 맞는 DMRV 시스템을 구축하는 환경·탄소·데이터 기술기업, 주식회사 샘튼.",
  email: "samton-nature@samton.co.kr",
  telephone: "+82-70-4107-9524",
  faxNumber: "0504-296-9524",
  address: {
    "@type": "PostalAddress",
    streetAddress: "갯벌로 12, 미추홀캠퍼스 별관 A동 401호",
    addressLocality: "연수구",
    addressRegion: "인천광역시",
    addressCountry: "KR",
  },
  knowsAbout: ["DMRV", "디지털 MRV", "탄소 크레딧", "탄소시장", "온실가스 감축", "환경 데이터"],
};
const websiteNode = (locale) => ({
  "@type": "WebSite",
  "@id": websiteId,
  url: `${siteOrigin}/`,
  name: "Samton",
  publisher: { "@id": organizationId },
  inLanguage: localeMeta[locale].htmlLang,
});

const canonicalPattern = /<link rel="canonical"[^>]*>/;
const jsonLdPattern = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

const readTemplate = (relativePath, label) => {
  const templatePath = path.join(distDir, relativePath);
  if (!existsSync(templatePath)) {
    console.error(`generate-static-pages: dist/${relativePath}이 없습니다. vite build 후에 실행하세요.`);
    process.exit(1);
  }
  const template = readFileSync(templatePath, "utf8");
  for (const [name, pattern] of [["canonical 링크", canonicalPattern], ["ld+json 블록", jsonLdPattern]]) {
    if (!pattern.test(template)) {
      console.error(`generate-static-pages: ${label}에 ${name}이 없습니다. 페이지를 만들 수 없습니다.`);
      process.exit(1);
    }
  }
  // 이미 이 스크립트가 본문을 넣어 둔 dist를 다시 템플릿으로 쓰면 결과가 겹친다.
  // vite build를 건너뛰고 두 번 돌린 경우이므로 원인을 그대로 알려주고 멈춘다.
  if (!/<div id="root">\s*<\/div>/.test(template)) {
    console.error(
      `generate-static-pages: dist/${relativePath}의 #root가 비어 있지 않습니다.\n` +
        "  이미 생성이 끝난 dist를 다시 템플릿으로 쓰려 한 것입니다. `npm run build`로 vite build부터 다시 실행하세요.",
    );
    process.exit(1);
  }
  return template;
};

// 두 템플릿 모두 아래에서 한국어 페이지로 다시 쓰므로 미리 읽어 둔다.
const homeTemplate = readTemplate("index.html", "index.html");
const insightsTemplate = readTemplate(path.join("insights", "index.html"), "insights/index.html");

const escapeAttr = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// 치환값에 $&, $1 같은 패턴이 들어가도 그대로 쓰이도록 함수 치환을 쓴다.
const fillAttr = (html, pattern, value) => html.replace(pattern, (_match, prefix, suffix) => `${prefix}${value}${suffix}`);

const cleanValue = (value) => {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);
  return quoted ? (quoted[1] ?? quoted[2] ?? "") : trimmed;
};

// frontmatter의 2026.07.15 표기를 구조화 데이터·사이트맵용 ISO 8601로 바꾼다.
const toIsoDate = (value, source) => {
  const match = value.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (!match) throw new Error(`${source}: date는 2026.07.15 형식이어야 합니다. (현재 값: ${value})`);
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
};

const parseFrontmatter = (markdownPath) => {
  const source = readFileSync(markdownPath, "utf8");
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error(`${markdownPath}: Markdown 상단에 frontmatter가 필요합니다.`);

  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const divider = line.indexOf(":");
        return divider < 0 ? [line, ""] : [line.slice(0, divider).trim(), cleanValue(line.slice(divider + 1))];
      }),
  );
  return { metadata, body: match[2] };
};

const articles = [];
for (const categoryEntry of readdirSync(postsDir, { withFileTypes: true })) {
  if (!categoryEntry.isDirectory()) continue;
  const categoryDir = path.join(postsDir, categoryEntry.name);
  for (const articleEntry of readdirSync(categoryDir, { withFileTypes: true })) {
    if (!articleEntry.isDirectory()) continue;
    const articleDir = path.join(categoryDir, articleEntry.name);
    const markdownPath = path.join(articleDir, "index.md");
    if (!existsSync(markdownPath)) continue;

    const { metadata, body } = parseFrontmatter(markdownPath);
    if (metadata.published === "false") continue;
    if (!metadata.slug || !metadata.title || !metadata.summary || !metadata.date) {
      throw new Error(`${markdownPath}: slug, title, summary, date 값이 필요합니다.`);
    }

    // 번역본이 없는 언어는 한국어 원문을 그대로 쓴다. registry.ts의 폴백 규칙과 같다.
    // displayDate는 화면에 그대로 보이는 frontmatter 표기(2026.07.15)다.
    const byLocale = {
      ko: {
        title: metadata.title,
        summary: metadata.summary,
        type: metadata.type,
        body,
        displayDate: metadata.date,
      },
    };
    for (const locale of locales.filter((item) => item !== "ko")) {
      const translationPath = path.join(articleDir, `index.${locale}.md`);
      const translated = existsSync(translationPath) ? parseFrontmatter(translationPath) : null;
      byLocale[locale] =
        translated?.metadata.title && translated?.metadata.summary
          ? {
              title: translated.metadata.title,
              summary: translated.metadata.summary,
              type: translated.metadata.type ?? metadata.type,
              body: translated.body,
              displayDate: translated.metadata.date ?? metadata.date,
            }
          : byLocale.ko;
    }

    // registry.ts의 썸네일 규칙과 동일하게 본문 첫 이미지를 대표 이미지로 쓴다.
    const firstImage = body.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1]?.trim().replace(/^\.\//, "");
    const imageCandidates = firstImage
      ? [path.join(articleDir, firstImage), path.join(articleDir, "images", path.basename(firstImage))]
      : [];
    articles.push({
      slug: metadata.slug,
      category: categoryEntry.name,
      dir: articleDir,
      date: toIsoDate(metadata.date, markdownPath),
      imagePath: imageCandidates.find(existsSync),
      byLocale,
    });
  }
}
articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

// 대표 이미지는 언어와 무관하게 같으므로 한국어 경로에 한 번만 두고 모든 언어가 그 주소를 참조한다.
let withImageCount = 0;
for (const article of articles) {
  if (!article.imagePath) {
    article.imageUrl = `${siteOrigin}/og-image.png`;
    continue;
  }
  const extension = path.extname(article.imagePath).toLowerCase();
  const imageDir = path.join(distDir, "insights", article.slug);
  mkdirSync(imageDir, { recursive: true });
  copyFileSync(article.imagePath, path.join(imageDir, `og${extension}`));
  article.imageUrl = `${siteOrigin}/insights/${article.slug}/og${extension}`;
  withImageCount += 1;
}

// 같은 글의 언어별 주소를 서로 가리키게 해 검색엔진이 언어판을 짝지을 수 있게 한다.
const alternateLinks = (pagePath) =>
  [
    ...locales.map((locale) => ({ hreflang: localeMeta[locale].htmlLang, href: absoluteUrl(locale, pagePath) })),
    { hreflang: "x-default", href: absoluteUrl("ko", pagePath) },
  ]
    .map(({ hreflang, href }) => `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join("\n    ");

// JSON 안의 <를 이스케이프해 본문 값이 </script>로 태그를 닫지 못하게 한다.
const renderJsonLd = (graph) =>
  `<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\\u003c")}</script>`;

// ── 본문 프리렌더 ─────────────────────────────────────────────────────────
// JS를 실행하지 않는 크롤러(GPTBot·ClaudeBot 같은 AI 봇, 네이버 Yeti, 다음)에게도
// 글 내용을 보여주려고 마크다운을 정적 HTML로 미리 그려 #root 안에 넣는다.
// 앱이 뜨면 insights.tsx가 #root를 비우고 React가 같은 화면을 다시 그린다.
//
// 규칙은 src/app/components/MarkdownContent.tsx와 같게 맞춘다. 그 파일의
// 블록·인라인 처리를 고치면 아래 renderMarkdown도 함께 고쳐야 한다.
// 본문 이미지는 Vite가 /assets/ 해시 경로로 옮기므로 상대경로가 dist에서 깨진다.
// 대표 이미지 신호는 og:image와 ImageObject가 이미 담당하므로 여기서는 글자만 그린다.
// 작은따옴표까지 React의 renderToStaticMarkup과 같은 방식으로 이스케이프한다.
// 출력이 바이트 단위로 같아야 프리렌더와 실제 화면이 어긋났을 때 바로 드러난다.
const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");

const safeHref = (href) => (/^(https?:\/\/|mailto:|\/|#)/.test(href) ? href : "#");

// 이미지 크기를 파일 헤더에서 직접 읽는다. 빌드가 우분투(GitHub Actions)에서도
// 돌아야 하므로 sips 같은 macOS 전용 도구를 쓰지 않는다.
const imageSize = (file) => {
  const b = readFileSync(file);
  if (b.toString("latin1", 1, 4) === "PNG") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i += 1; continue; }
      const marker = b[i + 1];
      // SOF0~SOF15에서 크기를 읽는다. DHT(c4)·JPG(c8)·DAC(cc)는 크기 정보가 아니다.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
};

// vite build가 남긴 manifest에서 원본 경로 -> 해시 경로 대응을 읽는다.
// React가 쓰는 것과 같은 주소를 넣어야 브라우저가 같은 사진을 두 번 받지 않는다.
const manifestPath = path.join(distDir, ".vite", "manifest.json");
const assetManifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

// skeleton이면 사진을 내려받지 않고 같은 크기의 빈 자리만 잡는다.
// 어느 쪽이든 원본 비율을 알아야 React가 그릴 때 화면이 밀리지 않는다.
const articleImages = (articleDir, { skeleton }) => {
  const imagesDir = path.join(articleDir, "images");
  if (!existsSync(imagesDir)) return {};
  const map = {};
  for (const entry of readdirSync(imagesDir, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(entry.name)) continue;
    const size = imageSize(path.join(imagesDir, entry.name));
    if (!size) continue;
    const sourceKey = path.relative(root, path.join(imagesDir, entry.name)).split(path.sep).join("/");
    const built = assetManifest[sourceKey]?.file;
    if (!skeleton && !built) continue;
    map[`images/${entry.name}`] = { url: built ? `/${built}` : "", ...size, skeleton };
  }
  return map;
};

const inlinePattern = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

// 찾는 이미지가 map에 없으면 아무것도 그리지 않는다. MarkdownContent.tsx의 resolveImage와 같은 규칙이다.
// skeleton은 사진 자리만 잡는 빈 상자다. index.css의 .markdown-content img와 같은
// 여백·모서리를 인라인 스타일로 준다(프리렌더 전용이라 CSS 파일을 건드리지 않는다).
const renderImage = (source, alt, images) => {
  const found = images[source.replace(/^\.\//, "")];
  if (!found) return "";
  if (found.skeleton) {
    return (
      '<span aria-hidden="true" style="display:block;width:100%;' +
      `aspect-ratio:${found.width}/${found.height};` +
      'background:#eef1f5;border-radius:var(--radius-md);margin:18px 0"></span>'
    );
  }
  return `<img src="${escapeHtml(found.url)}" alt="${escapeHtml(alt)}" width="${found.width}" height="${found.height}">`;
};

const renderInline = (text, locale, images) =>
  text
    .split(inlinePattern)
    .filter(Boolean)
    .map((token) => {
      const image = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (image) return renderImage(image[2], image[1], images);

      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const safe = safeHref(link[2]);
        // 내부 링크는 localizedHref와 같은 규칙으로 언어 접두사를 붙인다.
        const href = safe.startsWith("/") ? `${localePrefix(locale)}${safe}` : safe;
        const external = href.startsWith("http");
        return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(link[1])}</a>`;
      }
      if (token.startsWith("**") && token.endsWith("**")) return `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
      if (token.startsWith("*") && token.endsWith("*")) return `<em>${renderInline(token.slice(1, -1), locale, images)}</em>`;
      if (token.startsWith("`") && token.endsWith("`")) return `<code>${escapeHtml(token.slice(1, -1))}</code>`;
      return escapeHtml(token);
    })
    .join("");

const renderMarkdown = (markdown, title, locale, images = {}) => {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (blocks[0] === `# ${title}`) blocks.shift();

  const isImageBlock = (block) => /^!\[[^\]]*\]\([^)]+\)$/.test(block);
  const isItalicBlock = (block) => /^\*[^*]+\*$/.test(block);
  const splitTableRow = (line) =>
    line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const isTableDivider = (line) => {
    const cells = splitTableRow(line);
    return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };

  const html = [];
  blocks.forEach((block, index) => {
    const heading = block.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const tag = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
      html.push(`<${tag}>${renderInline(heading[2], locale, images)}</${tag}>`);
      return;
    }

    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;

    if (lines.length >= 2 && lines[0].includes("|") && isTableDivider(lines[1])) {
      const headers = splitTableRow(lines[0]);
      const rows = lines.slice(2).map(splitTableRow);
      html.push(
        '<div class="markdown-table-wrap"><table><thead><tr>' +
          headers.map((cell) => `<th>${renderInline(cell, locale, images)}</th>`).join("") +
          "</tr></thead><tbody>" +
          rows
            .map(
              (row) =>
                "<tr>" + headers.map((_, i) => `<td>${renderInline(row[i] ?? "", locale, images)}</td>`).join("") + "</tr>",
            )
            .join("") +
          "</tbody></table></div>",
      );
      return;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      html.push(
        "<ul>" +
          lines.map((line) => `<li>${renderInline(line.replace(/^[-*]\s+/, ""), locale, images)}</li>`).join("") +
          "</ul>",
      );
      return;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      html.push(
        "<ol>" +
          lines.map((line) => `<li>${renderInline(line.replace(/^\d+\.\s+/, ""), locale, images)}</li>`).join("") +
          "</ol>",
      );
      return;
    }

    if (lines.every((line) => line.startsWith(">"))) {
      html.push(`<blockquote>${renderInline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), locale, images)}</blockquote>`);
      return;
    }

    // 사진을 그릴 수 있으면 MarkdownContent.tsx와 같은 문단으로 감싸고 바로 뒤 캡션도 살린다.
    // 그릴 수 없으면 캡션도 함께 뺀다. 사진 없이 설명만 남으면
    // 글이 정체불명의 사진 설명으로 시작해 크롤러가 읽는 첫 문장이 엉뚱해진다.
    if (isImageBlock(block)) {
      const rendered = renderInline(block, locale, images);
      if (rendered) html.push(`<p class="markdown-image-block">${rendered}</p>`);
      return;
    }
    if (isItalicBlock(block) && index > 0 && isImageBlock(blocks[index - 1])) {
      if (!renderInline(blocks[index - 1], locale, images)) return;
      html.push(`<p class="markdown-image-caption">${renderInline(lines.join(" "), locale, images)}</p>`);
      return;
    }

    const inner = renderInline(lines.join(" "), locale, images);
    if (inner.trim()) html.push(`<p>${inner}</p>`);
  });

  return `<div class="markdown-content">${html.join("")}</div>`;
};

// registry.ts의 categoryFolders와 같은 대응이다. 목록 페이지의 분류 앵커로 쓴다.
const categoryAnchors = {
  "DMRV-이해하기": "dmrv",
  "탄소시장-기초": "carbon",
  "샘튼-소식": "news",
  "리포트": "reports",
  "기술-조직-이야기": "technology",
};

const localPath = (locale, pagePath) => `${localePrefix(locale)}${pagePath}`;

const prerenderArticle = (article, locale) => {
  const localized = article.byLocale[locale];
  const anchor = categoryAnchors[article.category];
  // 목록으로 돌아가는 링크를 넣는다. 이게 없으면 JS를 실행하지 않는 크롤러에게
  // 게시물 페이지가 나가는 길이 없는 막다른 페이지가 된다.
  const back = `<a class="insight-article__back" href="${localPath(locale, "/insights/")}${anchor ? `#${anchor}` : ""}">${escapeHtml(localeMeta[locale].backToList)}</a>`;
  return (
    `<div class="site-shell site-shell--${locale} insights-page"><main class="journal journal--article">` +
    `<article class="insight-article">${back}<header class="insight-article__header">` +
    `<div class="insight-article__meta"><time datetime="${article.date}">${escapeHtml(localized.displayDate)}</time></div>` +
    `<h1>${escapeHtml(localized.title)}</h1><p>${escapeHtml(localized.summary)}</p></header>` +
    renderMarkdown(localized.body, localized.title, locale, article.images) +
    "</article></main></div>"
  );
};

// 목록 페이지에는 글마다 진짜 <a> 링크를 넣는다. 이게 없으면 JS를 실행하지 않는
// 크롤러는 사이트맵 말고는 글을 찾아갈 경로가 없다.
// 클래스는 InsightsPage.tsx의 실제 마크업과 같게 맞춰서, JS가 뜨기 전에도
// 이미 받아 둔 CSS가 그대로 적용되게 한다.
const prerenderList = (locale) =>
  `<div class="site-shell site-shell--${locale} insights-page"><main class="journal">` +
  `<section class="journal-masthead"><div><h1>${escapeHtml(localeMeta[locale].insightsName)}</h1></div></section>` +
  '<div class="journal-body"><section class="journal-archive"><div class="journal-card-grid">' +
  articles
    .map((article) => {
      const localized = article.byLocale[locale];
      return (
        `<a class="journal-card" href="${localPath(locale, `/insights/${article.slug}/`)}">` +
        '<div class="journal-card__copy"><div class="journal-card-meta">' +
        `<time datetime="${article.date}">${escapeHtml(localized.displayDate)}</time></div>` +
        `<h3>${escapeHtml(localized.title)}</h3><p>${escapeHtml(localized.summary)}</p></div></a>`
      );
    })
    .join("") +
  "</div></section></div></main></div>";

const renderPage = ({ template, locale, pagePath, title, description, imageUrl, ogType, graph, keepImageSize, prerender }) => {
  const canonicalUrl = absoluteUrl(locale, pagePath);
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);

  let page = template.replace(/<html lang="[^"]*">/, () => `<html lang="${localeMeta[locale].htmlLang}">`);
  page = page.replace(/<title>[^<]*<\/title>/, () => `<title>${safeTitle}</title>`);
  page = fillAttr(page, /(<meta name="description" content=")[^"]*(")/, safeDescription);
  page = fillAttr(page, /(<meta property="og:type" content=")[^"]*(")/, ogType);
  page = fillAttr(page, /(<meta property="og:title" content=")[^"]*(")/, safeTitle);
  page = fillAttr(page, /(<meta property="og:description" content=")[^"]*(")/, safeDescription);
  page = fillAttr(page, /(<meta property="og:url" content=")[^"]*(")/, canonicalUrl);
  page = fillAttr(page, /(<meta property="og:image" content=")[^"]*(")/, imageUrl);
  page = fillAttr(page, /(<meta property="og:locale" content=")[^"]*(")/, localeMeta[locale].ogLocale);
  if (!keepImageSize) {
    page = page.replace(/\s*<meta property="og:image:(?:width|height)" content="[^"]*" \/>/g, "");
  }
  page = fillAttr(page, /(<meta name="twitter:title" content=")[^"]*(")/, safeTitle);
  page = fillAttr(page, /(<meta name="twitter:description" content=")[^"]*(")/, safeDescription);
  page = fillAttr(page, /(<meta name="twitter:image" content=")[^"]*(")/, imageUrl);
  page = page.replace(
    canonicalPattern,
    () => `<link rel="canonical" href="${canonicalUrl}" />\n    ${alternateLinks(pagePath)}`,
  );
  page = page.replace(jsonLdPattern, () => renderJsonLd(graph));
  if (prerender) {
    const rootPattern = /<div id="root">\s*<\/div>/;
    if (!rootPattern.test(page)) {
      console.error(`generate-static-pages: ${pagePath}에 <div id="root"></div>가 없어 본문을 넣지 못했습니다.`);
      process.exit(1);
    }
    page = page.replace(rootPattern, () => `<div id="root">${prerender}</div>`);
  }

  const target = outputPath(locale, pagePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, page);
};

const breadcrumbNode = (locale, pagePath, trail) => ({
  "@type": "BreadcrumbList",
  "@id": `${absoluteUrl(locale, pagePath)}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Samton", item: absoluteUrl(locale, "/") },
    ...trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: entry.name,
      ...(entry.path ? { item: absoluteUrl(locale, entry.path) } : {}),
    })),
  ],
});

// 렌더 함수가 모두 정의된 뒤에 사진 맵을 채운다.
// 우리가 직접 찍은 사진이 있는 분류만 실제 이미지를 넣고, 나머지는 자리만 잡는다.
for (const article of articles) {
  article.images = articleImages(article.dir, { skeleton: !prerenderImageCategories.has(article.category) });
}

let pageCount = 0;
for (const locale of locales) {
  const meta = localeMeta[locale];

  // 홈
  renderPage({
    template: homeTemplate,
    locale,
    pagePath: "/",
    title: meta.home.title,
    description: meta.home.description,
    imageUrl: `${siteOrigin}/og-image.png`,
    ogType: "website",
    keepImageSize: true,
    graph: {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode,
        websiteNode(locale),
        {
          "@type": "WebPage",
          "@id": absoluteUrl(locale, "/"),
          url: absoluteUrl(locale, "/"),
          name: meta.home.title,
          description: meta.home.description,
          isPartOf: { "@id": websiteId },
          about: { "@id": organizationId },
          primaryImageOfPage: { "@type": "ImageObject", url: `${siteOrigin}/og-image.png` },
          inLanguage: meta.htmlLang,
        },
      ],
    },
  });
  pageCount += 1;

  // 소식·인사이트 목록
  const insightsUrl = absoluteUrl(locale, "/insights/");
  renderPage({
    template: insightsTemplate,
    locale,
    pagePath: "/insights/",
    title: meta.insights.title,
    description: meta.insights.description,
    imageUrl: `${siteOrigin}/og-image.png`,
    ogType: "website",
    keepImageSize: true,
    prerender: prerenderList(locale),
    graph: {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode,
        websiteNode(locale),
        {
          "@type": "CollectionPage",
          "@id": insightsUrl,
          url: insightsUrl,
          name: meta.insights.title,
          description: meta.insights.description,
          isPartOf: { "@id": websiteId },
          about: { "@id": organizationId },
          breadcrumb: { "@id": `${insightsUrl}#breadcrumb` },
          inLanguage: meta.htmlLang,
          mainEntity: {
            "@type": "ItemList",
            "@id": `${insightsUrl}#itemlist`,
            numberOfItems: articles.length,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: articles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.byLocale[locale].title,
              url: absoluteUrl(locale, `/insights/${article.slug}/`),
            })),
          },
        },
        breadcrumbNode(locale, "/insights/", [{ name: meta.insightsName }]),
      ],
    },
  });
  pageCount += 1;

  // 게시물 상세
  for (const article of articles) {
    const pagePath = `/insights/${article.slug}/`;
    const pageUrl = absoluteUrl(locale, pagePath);
    const localized = article.byLocale[locale];
    renderPage({
      template: insightsTemplate,
      locale,
      pagePath,
      title: `${localized.title} | Samton`,
      description: localized.summary,
      imageUrl: article.imageUrl,
      ogType: "article",
      prerender: prerenderArticle(article, locale),
      graph: {
        "@context": "https://schema.org",
        "@graph": [
          organizationNode,
          websiteNode(locale),
          {
            "@type": "WebPage",
            "@id": pageUrl,
            url: pageUrl,
            name: `${localized.title} | Samton`,
            description: localized.summary,
            isPartOf: { "@id": websiteId },
            primaryImageOfPage: { "@id": `${pageUrl}#primaryimage` },
            breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
            inLanguage: meta.htmlLang,
          },
          {
            "@type": "ImageObject",
            "@id": `${pageUrl}#primaryimage`,
            url: article.imageUrl,
            contentUrl: article.imageUrl,
          },
          breadcrumbNode(locale, pagePath, [
            { name: meta.insightsName, path: "/insights/" },
            { name: localized.title },
          ]),
          {
            "@type": newsCategories.has(article.category) ? "NewsArticle" : "Article",
            "@id": `${pageUrl}#article`,
            url: pageUrl,
            mainEntityOfPage: { "@id": pageUrl },
            isPartOf: { "@id": pageUrl },
            headline: localized.title,
            description: localized.summary,
            image: { "@id": `${pageUrl}#primaryimage` },
            datePublished: article.date,
            dateModified: article.date,
            articleSection: categoryLabels[article.category] ?? article.category,
            ...(localized.type ? { keywords: localized.type } : {}),
            author: { "@id": organizationId },
            publisher: { "@id": organizationId },
            inLanguage: meta.htmlLang,
          },
        ],
      },
    });
    pageCount += 1;
  }
}

// 사이트맵: 언어별 주소를 각각 한 줄씩 넣고, 줄마다 나머지 언어판을 대체 주소로 붙인다.
// 게시물 사진이 이미지 검색에 잡히도록 이미지 사이트맵 확장(image:loc)도 붙인다.
// 본문에 실제로 그려지는 사진(해시 경로)을 우선하고, 스켈레톤 분류는 대표 이미지로 대신한다.
const articleImageUrls = (article) => {
  const bodyImages = Object.values(article.images ?? {})
    .filter((image) => image.url)
    .map((image) => `${siteOrigin}${image.url}`);
  if (bodyImages.length > 0) return [...new Set(bodyImages)];
  return article.imagePath ? [article.imageUrl] : [];
};

const latestDate = articles.reduce((latest, article) => (article.date > latest ? article.date : latest), "");
const sitemapPaths = [
  { pagePath: "/", priority: "1.0", changefreq: "monthly" },
  { pagePath: "/insights/", priority: "0.8", changefreq: "weekly", lastmod: latestDate || undefined },
  ...articles.map((article) => ({
    pagePath: `/insights/${article.slug}/`,
    priority: "0.6",
    changefreq: "monthly",
    lastmod: article.date,
    images: articleImageUrls(article),
  })),
];
const sitemapUrls = sitemapPaths.flatMap((entry) =>
  locales.map((locale) =>
    [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl(locale, entry.pagePath))}</loc>`,
      ...locales.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${localeMeta[alternate].htmlLang}" href="${escapeXml(absoluteUrl(alternate, entry.pagePath))}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl("ko", entry.pagePath))}" />`,
      ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      ...(entry.images ?? []).map(
        (imageUrl) => `    <image:image><image:loc>${escapeXml(imageUrl)}</image:loc></image:image>`,
      ),
      "  </url>",
    ].join("\n"),
  ),
);
writeFileSync(
  path.join(distDir, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...sitemapUrls,
    "</urlset>",
    "",
  ].join("\n"),
);

// 빌드 도구 정보이므로 배포본에 남기지 않는다.
if (existsSync(path.join(distDir, ".vite"))) rmSync(path.join(distDir, ".vite"), { recursive: true, force: true });

console.log(
  `generate-static-pages: ${locales.join("/")} ${pageCount}개 페이지 생성 (게시물 ${articles.length}개, 대표 이미지 ${withImageCount}개, 공용 카드 폴백 ${articles.length - withImageCount}개), sitemap.xml 주소 ${sitemapUrls.length}개`,
);
