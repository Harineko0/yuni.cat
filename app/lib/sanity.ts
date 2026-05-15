import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

type Env = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_TOKEN?: string;
};

const DEFAULT_PROJECT_ID = "yunicat";
const DEFAULT_DATASET = "production";
const DEFAULT_API_VERSION = "2024-10-01";

export function getSanityClient(env?: Env): SanityClient {
  const projectId = env?.SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
  const dataset = env?.SANITY_DATASET ?? DEFAULT_DATASET;
  const apiVersion = env?.SANITY_API_VERSION ?? DEFAULT_API_VERSION;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !env?.SANITY_TOKEN,
    token: env?.SANITY_TOKEN,
    perspective: "published",
  });
}

export function getImageBuilder(env?: Env) {
  return imageUrlBuilder(getSanityClient(env));
}

export type PortableTextBlock = unknown;

export type SanityImage = {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  readingTime?: number;
  tags?: string[];
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
};

export type Work = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  year?: number;
  role?: string;
  tech?: string[];
  url?: string;
  repo?: string;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
};

export const queries = {
  latestPosts: /* groq */ `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, excerpt, publishedAt, readingTime, tags, coverImage
  }`,
  allPosts: /* groq */ `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id, title, "slug": slug.current, excerpt, publishedAt, readingTime, tags, coverImage
  }`,
  postBySlug: /* groq */ `*[_type == "post" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, excerpt, publishedAt, readingTime, tags, coverImage, body
  }`,
  latestWorks: /* groq */ `*[_type == "work"] | order(year desc, _createdAt desc)[0...$limit]{
    _id, title, "slug": slug.current, summary, year, role, tech, url, repo, coverImage
  }`,
  allWorks: /* groq */ `*[_type == "work"] | order(year desc, _createdAt desc){
    _id, title, "slug": slug.current, summary, year, role, tech, url, repo, coverImage
  }`,
  workBySlug: /* groq */ `*[_type == "work" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, summary, year, role, tech, url, repo, coverImage, body
  }`,
};
