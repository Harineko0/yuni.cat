import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function MarkdownRenderer({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  const html = marked.parse(value, { async: false }) as string;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
