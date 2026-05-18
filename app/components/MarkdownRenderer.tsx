export function MarkdownRenderer({ html }: { html: string | null | undefined }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
