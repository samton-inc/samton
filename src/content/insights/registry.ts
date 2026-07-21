import type { Locale } from "@/i18n";

export type InsightCategoryId = "dmrv" | "carbon" | "news" | "reports" | "technology";

export type InsightArticle = {
  slug: string;
  category: InsightCategoryId;
  type: string;
  title: string;
  summary: string;
  date: string;
  featured: boolean;
  body: string;
  images: Record<string, string>;
  thumbnail?: string;
  thumbnailAlt?: string;
  sourcePath: string;
  locale: Locale;
};

const markdownFiles = import.meta.glob("./posts/*/*/index*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const imageFiles = import.meta.glob("./posts/*/*/images/*.{png,jpg,jpeg,webp,gif,avif,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const categoryFolders: Record<string, InsightCategoryId> = {
  "DMRV-이해하기": "dmrv",
  "탄소시장-기초": "carbon",
  "샘튼-소식": "news",
  "리포트": "reports",
  "기술-조직-이야기": "technology",
};

const cleanValue = (value: string) => {
  const trimmed = value.trim();
  const quoted = trimmed.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);
  return quoted ? (quoted[1] ?? quoted[2] ?? "") : trimmed;
};

const collectArticleImages = (sourcePath: string) => {
  const articleDirectory = sourcePath.replace(/\/index(?:\.[a-z]{2})?\.md$/, "");
  const imageDirectory = `${articleDirectory}/images/`;

  return Object.fromEntries(
    Object.entries(imageFiles)
      .filter(([imagePath]) => imagePath.startsWith(imageDirectory))
      .map(([imagePath, imageUrl]) => [`images/${imagePath.slice(imageDirectory.length)}`, imageUrl]),
  );
};

const findArticleThumbnail = (body: string, images: Record<string, string>) => {
  const image = body.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (!image) return {};

  const source = image[2].trim().replace(/^\.\//, "");
  const thumbnail = images[source] ?? images[`images/${source.split("/").pop()}`];

  return thumbnail
    ? { thumbnail, thumbnailAlt: image[1].trim() || "콘텐츠 대표 이미지" }
    : {};
};

const resolveCategory = (sourcePath: string) => {
  const categoryFolder = sourcePath.match(/^\.\/posts\/([^/]+)\/[^/]+\/index(?:\.[a-z]{2})?\.md$/)?.[1];
  const category = categoryFolder ? categoryFolders[categoryFolder] : undefined;
  if (!category) throw new Error(`${sourcePath}: 지정된 분류 폴더 안에 글을 넣어 주세요.`);
  return category;
};

const parseMarkdown = (sourcePath: string, source: string): InsightArticle | null => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error(`${sourcePath}: Markdown 상단에 frontmatter가 필요합니다.`);

  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const divider = line.indexOf(":");
        if (divider < 0) throw new Error(`${sourcePath}: frontmatter 형식을 확인해 주세요.`);
        return [line.slice(0, divider).trim(), cleanValue(line.slice(divider + 1))];
      }),
  );

  if (metadata.published === "false") return null;

  const category = resolveCategory(sourcePath);
  const localeMatch = sourcePath.match(/\/index\.([a-z]{2})\.md$/)?.[1];
  const locale = (localeMatch ?? "ko") as Locale;

  const requiredFields = ["slug", "type", "title", "summary", "date"] as const;
  requiredFields.forEach((field) => {
    if (!metadata[field]) throw new Error(`${sourcePath}: ${field} 값이 필요합니다.`);
  });

  const body = match[2].trim();
  const images = collectArticleImages(sourcePath);

  return {
    slug: metadata.slug,
    category,
    type: metadata.type,
    title: metadata.title,
    summary: metadata.summary,
    date: metadata.date,
    featured: metadata.featured === "true",
    body,
    images,
    ...findArticleThumbnail(body, images),
    sourcePath,
    locale,
  };
};

const parsedArticles = Object.entries(markdownFiles)
  .map(([sourcePath, source]) => parseMarkdown(sourcePath, source))
  .filter((article): article is InsightArticle => article !== null)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

export const getInsightArticles = (locale: Locale) => {
  const koreanArticles = parsedArticles.filter((article) => article.locale === "ko");
  const localizedArticles = parsedArticles.filter((article) => article.locale === locale);
  const localizedBySlug = new Map(localizedArticles.map((article) => [article.slug, article]));
  const koreanSlugs = new Set(koreanArticles.map((article) => article.slug));

  return [
    ...koreanArticles.map((article) => localizedBySlug.get(article.slug) ?? article),
    ...localizedArticles.filter((article) => !koreanSlugs.has(article.slug)),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
};

export const getFeaturedInsight = (locale: Locale) => {
  const articles = getInsightArticles(locale);
  return articles.find((article) => article.featured) ?? articles[0];
};
