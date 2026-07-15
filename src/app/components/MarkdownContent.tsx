import type { ReactNode } from "react";

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

const renderInline = (text: string, images: Record<string, string>): ReactNode[] => {
  const tokenPattern = /(\!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

  return text.split(tokenPattern).filter(Boolean).map((token, index) => {
    const image = token.match(/^\!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const source = resolveImage(image[2], images);
      return source ? <img src={source} alt={image[1]} key={`${token}-${index}`} /> : null;
    }

    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      const isExternal = href.startsWith("http");
      return <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} key={`${token}-${index}`}>{link[1]}</a>;
    }

    if (token.startsWith("**") && token.endsWith("**")) return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("*") && token.endsWith("*")) return <em key={`${token}-${index}`}>{renderInline(token.slice(1, -1), images)}</em>;
    if (token.startsWith("`") && token.endsWith("`")) return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
    return token;
  });
};

export default function MarkdownContent({ markdown, title, images }: { markdown: string; title: string; images: Record<string, string> }) {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (blocks[0] === `# ${title}`) blocks.shift();

  const isImageBlock = (block: string) => /^!\[[^\]]*\]\([^)]+\)$/.test(block);
  const isItalicBlock = (block: string) => /^\*[^*]+\*$/.test(block);

  return (
    <div className="markdown-content">
      {blocks.map((block, index) => {
        const heading = block.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
          const Heading = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
          return <Heading key={index}>{renderInline(heading[2], images)}</Heading>;
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return <ul key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInline(line.replace(/^[-*]\s+/, ""), images)}</li>)}</ul>;
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInline(line.replace(/^\d+\.\s+/, ""), images)}</li>)}</ol>;
        }

        if (lines.every((line) => line.startsWith(">"))) {
          return <blockquote key={index}>{renderInline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), images)}</blockquote>;
        }

        const isImage = isImageBlock(block);
        const isImageCaption = isItalicBlock(block) && index > 0 && isImageBlock(blocks[index - 1]);
        const className = isImage ? "markdown-image-block" : isImageCaption ? "markdown-image-caption" : undefined;

        return <p className={className} key={index}>{renderInline(lines.join(" "), images)}</p>;
      })}
    </div>
  );
}
