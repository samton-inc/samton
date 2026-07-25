// 빌드된 dist/insights/index.html을 템플릿 삼아 게시물마다
// dist/insights/<slug>/index.html을 만들고, 글의 제목·요약·본문 첫 이미지를
// Open Graph 태그와 JSON-LD 구조화 데이터(Article/NewsArticle)로 넣는다.
// 이미지가 없는 글은 공용 /og-image.png로 폴백한다.
// 마지막으로 전체 페이지 목록을 담은 dist/sitemap.xml을 만든다.
// `npm run build`(vite build 다음 단계)에서 실행된다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src", "content", "insights", "posts");
const distDir = path.join(root, "dist");
const distInsightsDir = path.join(distDir, "insights");
const siteOrigin = "https://samton.co.kr";
const organizationId = `${siteOrigin}/#organization`;
const websiteId = `${siteOrigin}/#website`;

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

// index.html, insights/index.html의 같은 @id 노드와 내용을 맞춘다.
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
};
const websiteNode = {
  "@type": "WebSite",
  "@id": websiteId,
  url: `${siteOrigin}/`,
  name: "Samton",
  publisher: { "@id": organizationId },
  inLanguage: "ko",
};

const templatePath = path.join(distInsightsDir, "index.html");
if (!existsSync(templatePath)) {
  console.error("generate-insight-pages: dist/insights/index.html이 없습니다. vite build 후에 실행하세요.");
  process.exit(1);
}
const template = readFileSync(templatePath, "utf8");

const canonicalPattern = /(<link rel="canonical" href=")[^"]*(")/;
const jsonLdPattern = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
for (const [label, pattern] of [
  ["canonical 링크", canonicalPattern],
  ["ld+json 블록", jsonLdPattern],
]) {
  if (!pattern.test(template)) {
    console.error(`generate-insight-pages: insights/index.html에 ${label}이 없습니다. 게시물 페이지를 만들 수 없습니다.`);
    process.exit(1);
  }
}

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

const articles = [];
for (const categoryEntry of readdirSync(postsDir, { withFileTypes: true })) {
  if (!categoryEntry.isDirectory()) continue;
  const categoryDir = path.join(postsDir, categoryEntry.name);
  for (const articleEntry of readdirSync(categoryDir, { withFileTypes: true })) {
    if (!articleEntry.isDirectory()) continue;
    const articleDir = path.join(categoryDir, articleEntry.name);
    const markdownPath = path.join(articleDir, "index.md");
    if (!existsSync(markdownPath)) continue;

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
    if (metadata.published === "false") continue;
    if (!metadata.slug || !metadata.title || !metadata.summary || !metadata.date) {
      throw new Error(`${markdownPath}: slug, title, summary, date 값이 필요합니다.`);
    }

    // registry.ts의 썸네일 규칙과 동일하게 본문 첫 이미지를 대표 이미지로 쓴다.
    const firstImage = match[2].match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1]?.trim().replace(/^\.\//, "");
    const imageCandidates = firstImage
      ? [path.join(articleDir, firstImage), path.join(articleDir, "images", path.basename(firstImage))]
      : [];
    articles.push({
      slug: metadata.slug,
      title: metadata.title,
      summary: metadata.summary,
      type: metadata.type,
      category: categoryEntry.name,
      date: toIsoDate(metadata.date, markdownPath),
      imagePath: imageCandidates.find(existsSync),
    });
  }
}

// 페이지 안에서 Organization·WebSite·WebPage·BreadcrumbList·Article을 한 그래프로 묶어
// @id 참조가 서로 연결되게 한다.
const buildArticleGraph = (article, pageUrl, imageUrl) => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationNode,
    websiteNode,
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: `${article.title} | Samton`,
      description: article.summary,
      isPartOf: { "@id": websiteId },
      primaryImageOfPage: { "@id": `${pageUrl}#primaryimage` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "ko",
    },
    {
      "@type": "ImageObject",
      "@id": `${pageUrl}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Samton", item: `${siteOrigin}/` },
        { "@type": "ListItem", position: 2, name: "소식·인사이트", item: `${siteOrigin}/insights/` },
        { "@type": "ListItem", position: 3, name: article.title },
      ],
    },
    {
      "@type": newsCategories.has(article.category) ? "NewsArticle" : "Article",
      "@id": `${pageUrl}#article`,
      url: pageUrl,
      mainEntityOfPage: { "@id": pageUrl },
      isPartOf: { "@id": pageUrl },
      headline: article.title,
      description: article.summary,
      image: { "@id": `${pageUrl}#primaryimage` },
      datePublished: article.date,
      dateModified: article.date,
      articleSection: categoryLabels[article.category] ?? article.category,
      ...(article.type ? { keywords: article.type } : {}),
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
      inLanguage: "ko",
    },
  ],
});

// JSON 안의 <를 이스케이프해 본문 값이 </script>로 태그를 닫지 못하게 한다.
const renderJsonLd = (graph) =>
  `<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\\u003c")}</script>`;

let withImageCount = 0;
for (const article of articles) {
  const outputDir = path.join(distInsightsDir, article.slug);
  mkdirSync(outputDir, { recursive: true });

  const pageUrl = `${siteOrigin}/insights/${article.slug}/`;
  let imageUrl = `${siteOrigin}/og-image.png`;
  if (article.imagePath) {
    const extension = path.extname(article.imagePath).toLowerCase();
    copyFileSync(article.imagePath, path.join(outputDir, `og${extension}`));
    imageUrl = `${pageUrl}og${extension}`;
    withImageCount += 1;
  }

  const title = escapeAttr(`${article.title} | Samton`);
  const description = escapeAttr(article.summary);
  let page = template.replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`);
  page = fillAttr(page, /(<meta name="description" content=")[^"]*(")/, description);
  page = fillAttr(page, /(<meta property="og:type" content=")[^"]*(")/, "article");
  page = fillAttr(page, /(<meta property="og:title" content=")[^"]*(")/, title);
  page = fillAttr(page, /(<meta property="og:description" content=")[^"]*(")/, description);
  page = fillAttr(page, /(<meta property="og:url" content=")[^"]*(")/, pageUrl);
  page = fillAttr(page, /(<meta property="og:image" content=")[^"]*(")/, imageUrl);
  page = page.replace(/\s*<meta property="og:image:(?:width|height)" content="[^"]*" \/>/g, "");
  page = fillAttr(page, /(<meta name="twitter:title" content=")[^"]*(")/, title);
  page = fillAttr(page, /(<meta name="twitter:description" content=")[^"]*(")/, description);
  page = fillAttr(page, /(<meta name="twitter:image" content=")[^"]*(")/, imageUrl);
  page = fillAttr(page, canonicalPattern, pageUrl);
  page = page.replace(jsonLdPattern, () => renderJsonLd(buildArticleGraph(article, pageUrl, imageUrl)));
  writeFileSync(path.join(outputDir, "index.html"), page);
}

// 사이트맵: 홈, 소식·인사이트 목록, 게시물 상세를 최신 글 순서로 담는다.
const latestDate = articles.reduce((latest, article) => (article.date > latest ? article.date : latest), "");
const sitemapEntries = [
  { loc: `${siteOrigin}/`, priority: "1.0", changefreq: "monthly" },
  { loc: `${siteOrigin}/insights/`, priority: "0.8", changefreq: "weekly", lastmod: latestDate || undefined },
  ...[...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((article) => ({
      loc: `${siteOrigin}/insights/${article.slug}/`,
      priority: "0.6",
      changefreq: "monthly",
      lastmod: article.date,
    })),
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");
writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);

console.log(
  `generate-insight-pages: 게시물 페이지 ${articles.length}개 생성 (대표 이미지 ${withImageCount}개, 공용 카드 폴백 ${articles.length - withImageCount}개), sitemap.xml 주소 ${sitemapEntries.length}개`,
);
