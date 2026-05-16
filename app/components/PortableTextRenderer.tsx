import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { getSanityClient } from "../lib/sanity";

const builder = createImageUrlBuilder(getSanityClient());

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="display text-5xl md:text-6xl mt-16 mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="display text-3xl md:text-4xl mt-14 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="display text-2xl md:text-3xl mt-10 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-ink leading-[1.8] my-5 text-[1.05rem]">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 border-l-4 border-pink italic text-ink-soft">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="link-underline" target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-paper-2 text-[0.9em] font-mono">{children}</code>
    ),
    strong: ({ children }) => <strong className="text-ink font-medium marker-mint">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 space-y-2 list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-6 space-y-2 list-decimal pl-6">{children}</ol>,
  },
  listItem: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  types: {
    image: ({ value }) => {
      try {
        const url = builder.image(value).width(1400).fit("max").url();
        return (
          <figure className="my-10">
            <img src={url} alt={value?.alt ?? ""} className="rounded-2xl w-full" loading="lazy" />
            {value?.alt ? (
              <figcaption className="mono-tag mt-2 text-center">{value.alt}</figcaption>
            ) : null}
          </figure>
        );
      } catch {
        return null;
      }
    },
    code: ({ value }) => (
      <pre className="my-8 p-6 rounded-2xl bg-ink text-paper overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{value?.code}</code>
      </pre>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: unknown }) {
  if (!value) return null;
  return <PortableText value={value as never} components={components} />;
}
