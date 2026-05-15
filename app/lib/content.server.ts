import { getSanityClient, queries, type BlogPost, type Work } from "./sanity";
import { samplePosts, sampleWorks } from "./sample-data";

type LoaderEnv = {
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_TOKEN?: string;
};

function hasSanityConfig(env?: LoaderEnv) {
  return Boolean(env?.SANITY_PROJECT_ID && env?.SANITY_DATASET);
}

export async function fetchLatestPosts(env: LoaderEnv | undefined, limit = 4): Promise<BlogPost[]> {
  if (!hasSanityConfig(env)) return samplePosts.slice(0, limit);
  try {
    const client = getSanityClient(env);
    return await client.fetch<BlogPost[]>(queries.latestPosts, { limit });
  } catch (e) {
    return samplePosts.slice(0, limit);
  }
}

export async function fetchAllPosts(env: LoaderEnv | undefined): Promise<BlogPost[]> {
  if (!hasSanityConfig(env)) return samplePosts;
  try {
    const client = getSanityClient(env);
    return await client.fetch<BlogPost[]>(queries.allPosts);
  } catch (e) {
    return samplePosts;
  }
}

export async function fetchPostBySlug(env: LoaderEnv | undefined, slug: string): Promise<BlogPost | null> {
  if (!hasSanityConfig(env)) return samplePosts.find((p) => p.slug === slug) ?? null;
  try {
    const client = getSanityClient(env);
    return await client.fetch<BlogPost | null>(queries.postBySlug, { slug });
  } catch (e) {
    return samplePosts.find((p) => p.slug === slug) ?? null;
  }
}

export async function fetchLatestWorks(env: LoaderEnv | undefined, limit = 4): Promise<Work[]> {
  if (!hasSanityConfig(env)) return sampleWorks.slice(0, limit);
  try {
    const client = getSanityClient(env);
    return await client.fetch<Work[]>(queries.latestWorks, { limit });
  } catch (e) {
    return sampleWorks.slice(0, limit);
  }
}

export async function fetchAllWorks(env: LoaderEnv | undefined): Promise<Work[]> {
  if (!hasSanityConfig(env)) return sampleWorks;
  try {
    const client = getSanityClient(env);
    return await client.fetch<Work[]>(queries.allWorks);
  } catch (e) {
    return sampleWorks;
  }
}

export async function fetchWorkBySlug(env: LoaderEnv | undefined, slug: string): Promise<Work | null> {
  if (!hasSanityConfig(env)) return sampleWorks.find((w) => w.slug === slug) ?? null;
  try {
    const client = getSanityClient(env);
    return await client.fetch<Work | null>(queries.workBySlug, { slug });
  } catch (e) {
    return sampleWorks.find((w) => w.slug === slug) ?? null;
  }
}
