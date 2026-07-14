export type InsightCategoryId = "basics" | "news" | "reports" | "technology";

export type InsightArticle = {
  slug: string;
  category: InsightCategoryId;
  type: string;
  title: string;
  summary: string;
  number: string;
  date: string;
  featured: boolean;
  body: string;
  images: Record<string, string>;
  sourcePath: string;
};

const markdownFiles = import.meta.glob("./posts/*/*/index.md", {
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
  "DMRV-탄소시장-기초": "basics",
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
  const articleDirectory = sourcePath.replace(/\/index\.md$/, "");
  const imageDirectory = `${articleDirectory}/images/`;

  return Object.fromEntries(
    Object.entries(imageFiles)
      .filter(([imagePath]) => imagePath.startsWith(imageDirectory))
      .map(([imagePath, imageUrl]) => [`images/${imagePath.slice(imageDirectory.length)}`, imageUrl]),
  );
};

const resolveCategory = (sourcePath: string) => {
  const categoryFolder = sourcePath.match(/^\.\/posts\/([^/]+)\/[^/]+\/index\.md$/)?.[1];
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

  const requiredFields = ["slug", "type", "title", "summary", "date"] as const;
  requiredFields.forEach((field) => {
    if (!metadata[field]) throw new Error(`${sourcePath}: ${field} 값이 필요합니다.`);
  });

  return {
    slug: metadata.slug,
    category,
    type: metadata.type,
    title: metadata.title,
    summary: metadata.summary,
    number: "",
    date: metadata.date,
    featured: metadata.featured === "true",
    body: match[2].trim(),
    images: collectArticleImages(sourcePath),
    sourcePath,
  };
};

export const insightArticles = Object.entries(markdownFiles)
  .map(([sourcePath, source]) => parseMarkdown(sourcePath, source))
  .filter((article): article is InsightArticle => article !== null)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
  .map((article, index) => ({ ...article, number: String(index + 1).padStart(2, "0") }));

export const featuredInsight = insightArticles.find((article) => article.featured) ?? insightArticles[0];
