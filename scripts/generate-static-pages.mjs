// 빌드된 dist/index.html과 dist/insights/index.html을 템플릿 삼아
// 언어(ko, en, ja) × 페이지(홈, 소식·인사이트 목록, 게시물)마다 정적 HTML을 만든다.
// 한국어는 접두사 없이 루트를 쓰고, 영어·일본어는 /en, /ja 경로에 같은 구조로 놓는다.
//
// 각 페이지에는 제목·설명·Open Graph 태그와 함께 canonical, hreflang,
// JSON-LD 구조화 데이터(Organization / WebSite / WebPage / BreadcrumbList /
// CollectionPage+ItemList / Article·NewsArticle)를 언어에 맞게 넣는다.
// 마지막으로 언어별 대체 주소를 담은 dist/sitemap.xml을 만든다.
// `npm run build`(vite build 다음 단계)에서 실행된다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
    const byLocale = { ko: { title: metadata.title, summary: metadata.summary, type: metadata.type } };
    for (const locale of locales.filter((item) => item !== "ko")) {
      const translationPath = path.join(articleDir, `index.${locale}.md`);
      const translated = existsSync(translationPath) ? parseFrontmatter(translationPath).metadata : null;
      byLocale[locale] =
        translated?.title && translated?.summary
          ? { title: translated.title, summary: translated.summary, type: translated.type ?? metadata.type }
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

const renderPage = ({ template, locale, pagePath, title, description, imageUrl, ogType, graph, keepImageSize }) => {
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
const latestDate = articles.reduce((latest, article) => (article.date > latest ? article.date : latest), "");
const sitemapPaths = [
  { pagePath: "/", priority: "1.0", changefreq: "monthly" },
  { pagePath: "/insights/", priority: "0.8", changefreq: "weekly", lastmod: latestDate || undefined },
  ...articles.map((article) => ({
    pagePath: `/insights/${article.slug}/`,
    priority: "0.6",
    changefreq: "monthly",
    lastmod: article.date,
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
      "  </url>",
    ].join("\n"),
  ),
);
writeFileSync(
  path.join(distDir, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...sitemapUrls,
    "</urlset>",
    "",
  ].join("\n"),
);

console.log(
  `generate-static-pages: ${locales.join("/")} ${pageCount}개 페이지 생성 (게시물 ${articles.length}개, 대표 이미지 ${withImageCount}개, 공용 카드 폴백 ${articles.length - withImageCount}개), sitemap.xml 주소 ${sitemapUrls.length}개`,
);
