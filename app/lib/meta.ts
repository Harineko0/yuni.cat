export const SITE_URL = "https://yuni.cat";
export const SITE_NAME = "yuni.cat";
export const DEFAULT_OGP_IMAGE = `${SITE_URL}/ogp.png`;
export const DEFAULT_OGP_IMAGE_WIDTH = 2560;
export const DEFAULT_OGP_IMAGE_HEIGHT = 1360;
export const DEFAULT_OGP_IMAGE_ALT = "yuni.cat — Harineko's portfolio";
export const DYNAMIC_OGP_WIDTH = 1200;
export const DYNAMIC_OGP_HEIGHT = 630;

export function ogImageUrl(kind: "blog" | "works", slug?: string) {
  const path = slug ? `/og/${kind}/${slug}.png` : `/og/${kind}.png`;
  return `${SITE_URL}${path}`;
}

export type BuildMetaInput = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  publishedTime?: string;
  tags?: string[];
};

export function buildMeta(input: BuildMetaInput) {
  const url = `${SITE_URL}${input.path ?? "/"}`;
  const image = input.image ?? DEFAULT_OGP_IMAGE;
  const imageAlt = input.imageAlt ?? DEFAULT_OGP_IMAGE_ALT;
  const isDefaultImage = image === DEFAULT_OGP_IMAGE;
  const isDynamicOg = image.startsWith(`${SITE_URL}/og/`);
  const width =
    input.imageWidth ??
    (isDefaultImage ? DEFAULT_OGP_IMAGE_WIDTH : isDynamicOg ? DYNAMIC_OGP_WIDTH : undefined);
  const height =
    input.imageHeight ??
    (isDefaultImage ? DEFAULT_OGP_IMAGE_HEIGHT : isDynamicOg ? DYNAMIC_OGP_HEIGHT : undefined);
  const imageType = image.endsWith(".png")
    ? "image/png"
    : image.endsWith(".jpg") || image.endsWith(".jpeg")
      ? "image/jpeg"
      : image.endsWith(".webp")
        ? "image/webp"
        : undefined;

  const tags: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:locale", content: "ja_JP" },
    { property: "og:locale:alternate", content: "en_US" },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    ...(imageType ? [{ property: "og:image:type", content: imageType }] : []),
    ...(width ? [{ property: "og:image:width", content: String(width) }] : []),
    ...(height ? [{ property: "og:image:height", content: String(height) }] : []),
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (input.publishedTime) {
    tags.push({ property: "article:published_time", content: input.publishedTime });
  }
  for (const tag of input.tags ?? []) {
    tags.push({ property: "article:tag", content: tag });
  }

  tags.push({ tagName: "link", rel: "canonical", href: url });

  return tags;
}
