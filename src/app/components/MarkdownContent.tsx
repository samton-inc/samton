import type { ReactNode } from "react";
import { localizedHref, type Locale } from "@/i18n";

const safeHref = (href: string) => {
  if (/^(https?:\/\/|mailto:|\/|#)/.test(href)) return href;
  return "#";
};

const resolveImage = (source: string, images: Record<string, string>) => {
  const normalizedSource = source.replace(/^\.\//, "");
  if (images[normalizedSource]) return images[normalizedSource];
  if (/^(https?:\/\/|\/)/.test(source)) return source;
  return "";
};

const parseBookmark = (block: string) => {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const match = lines[0]?.match(/^::bookmark\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
  const image = lines[2]?.match(/^image:\s*(.+)$/)?.[1]?.trim() ?? "";
  if (!match || lines.length > 3 || (lines.length === 3 && !image)) return null;

  const href = safeHref(match[2]);
  if (!href.startsWith("http")) return null;

  try {
    return {
      title: match[1].trim(),
      href,
      meta: lines[1] ?? "",
      image,
      hostname: new URL(href).hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
};

const renderInline = (text: string, images: Record<string, string>, locale: Locale): ReactNode[] => {
  const tokenPattern = /(\!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

  return text.split(tokenPattern).filter(Boolean).map((token, index) => {
    const image = token.match(/^\!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const source = resolveImage(image[2], images);
      return source ? <img src={source} alt={image[1]} key={`${token}-${index}`} /> : null;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const safeLink = safeHref(link[2]);
      const href = safeLink.startsWith("/") ? localizedHref(safeLink, locale) : safeLink;
      const isExternal = href.startsWith("http");
      return <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} key={`${token}-${index}`}>{link[1]}</a>;
    }

    if (token.startsWith("**") && token.endsWith("**")) return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("*") && token.endsWith("*")) return <em key={`${token}-${index}`}>{renderInline(token.slice(1, -1), images, locale)}</em>;
    if (token.startsWith("`") && token.endsWith("`")) return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
    return token;
  });
};

export default function MarkdownContent({ markdown, title, images, locale }: { markdown: string; title: string; images: Record<string, string>; locale: Locale }) {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (blocks[0] === `# ${title}`) blocks.shift();

  const isImageBlock = (block: string) => /^!\[[^\]]*\]\([^)]+\)$/.test(block);
  const isItalicBlock = (block: string) => /^\*[^*]+\*$/.test(block);
  const splitTableRow = (line: string) => line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const isTableDivider = (line: string) => {
    const cells = splitTableRow(line);
    return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };

  return (
    <div className="markdown-content">
      {blocks.map((block, index) => {
        const bookmark = parseBookmark(block);
        if (bookmark) {
          const bookmarkImage = bookmark.image ? resolveImage(bookmark.image, images) : "";
          return (
            <a className={`markdown-bookmark${bookmarkImage ? " has-thumbnail" : ""}`} href={bookmark.href} target="_blank" rel="noreferrer" key={index}>
              <span className="markdown-bookmark__copy">
                <span className="markdown-bookmark__title">{bookmark.title}</span>
                {bookmark.meta && <span className="markdown-bookmark__meta">{bookmark.meta}</span>}
                <span className="markdown-bookmark__url">{bookmark.hostname}</span>
              </span>
              {bookmarkImage && <span className="markdown-bookmark__visual" aria-hidden="true"><img src={bookmarkImage} alt="" /></span>}
            </a>
          );
        }

        const heading = block.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          const Heading = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
          return <Heading key={index}>{renderInline(heading[2], images, locale)}</Heading>;
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.length >= 2 && lines[0].includes("|") && isTableDivider(lines[1])) {
          const headers = splitTableRow(lines[0]);
          const rows = lines.slice(2).map(splitTableRow);

          return (
            <div className="markdown-table-wrap" key={index}>
              <table>
                <thead>
                  <tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell, images, locale)}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? "", images, locale)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return <ul key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInline(line.replace(/^[-*]\s+/, ""), images, locale)}</li>)}</ul>;
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInline(line.replace(/^\d+\.\s+/, ""), images, locale)}</li>)}</ol>;
        }

        if (lines.every((line) => line.startsWith(">"))) {
          return <blockquote key={index}>{renderInline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), images, locale)}</blockquote>;
        }

        const isImage = isImageBlock(block);
        const isImageCaption = isItalicBlock(block) && index > 0 && isImageBlock(blocks[index - 1]);
        const className = isImage ? "markdown-image-block" : isImageCaption ? "markdown-image-caption" : undefined;

        return <p className={className} key={index}>{renderInline(lines.join(" "), images, locale)}</p>;
      })}
    </div>
  );
}
