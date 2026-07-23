// 빌드된 dist/insights/index.html을 템플릿 삼아 게시물마다
// dist/insights/<slug>/index.html을 만들고, 글의 제목·요약·본문 첫 이미지를
// Open Graph 태그로 넣는다. 이미지가 없는 글은 공용 /og-image.png로 폴백한다.
// `npm run build`(vite build 다음 단계)에서 실행된다.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src", "content", "insights", "posts");
const distInsightsDir = path.join(root, "dist", "insights");
const siteOrigin = "https://samton.co.kr";

const templatePath = path.join(distInsightsDir, "index.html");
if (!existsSync(templatePath)) {
  console.error("generate-insight-pages: dist/insights/index.html이 없습니다. vite build 후에 실행하세요.");
  process.exit(1);
}
const template = readFileSync(templatePath, "utf8");

const escapeAttr = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const cleanValue = (value) => {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);
  return quoted ? (quoted[1] ?? quoted[2] ?? "") : trimmed;
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
    if (!metadata.slug || !metadata.title || !metadata.summary) {
      throw new Error(`${markdownPath}: slug, title, summary 값이 필요합니다.`);
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
      imagePath: imageCandidates.find(existsSync),
    });
  }
}

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
  const page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, "$1article$2")
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${imageUrl}$2`)
    .replace(/\s*<meta property="og:image:(?:width|height)" content="[^"]*" \/>/g, "")
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${imageUrl}$2`);
  writeFileSync(path.join(outputDir, "index.html"), page);
}

console.log(
  `generate-insight-pages: 게시물 페이지 ${articles.length}개 생성 (대표 이미지 ${withImageCount}개, 공용 카드 폴백 ${articles.length - withImageCount}개)`,
);
