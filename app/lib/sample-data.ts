import type { BlogPost, Work } from "./sanity";

export const samplePosts: BlogPost[] = [
  {
    _id: "p1",
    title: "On building yuni.cat — soft systems, soft cats",
    slug: "building-yuni-cat",
    excerpt:
      "Notes on shipping a portfolio at the intersection of edge runtimes, declarative content, and a recurring cat motif.",
    publishedAt: "2026-05-12",
    readingTime: 6,
    tags: ["meta", "react-router", "cloudflare"],
  },
  {
    _id: "p2",
    title: "Cloudflare Workers as a personal compute substrate",
    slug: "workers-personal-substrate",
    excerpt:
      "Why I moved every side-project off long-running servers and onto the edge — and what it cost me in habit.",
    publishedAt: "2026-04-03",
    readingTime: 11,
    tags: ["cloudflare", "infra"],
  },
  {
    _id: "p3",
    title: "Reading the Applied Information Technology textbook as a cat",
    slug: "ap-textbook-cat",
    excerpt:
      "A slow, deliberate re-read of the FE/AP syllabus — what holds up, what feels archaic, and what I keep forgetting.",
    publishedAt: "2026-02-20",
    readingTime: 9,
    tags: ["study", "ap"],
  },
  {
    _id: "p4",
    title: "Three years of GDG on Campus Osaka",
    slug: "gdg-osaka-three-years",
    excerpt:
      "A retrospective on what I learned organizing a student developer community — and what I'd do differently.",
    publishedAt: "2025-12-15",
    readingTime: 8,
    tags: ["community", "gdg"],
  },
];

export const sampleWorks: Work[] = [
  {
    _id: "w1",
    title: "yuni.cat",
    slug: "yuni-cat",
    summary:
      "This site. React Router v7 on Cloudflare Workers, Sanity for content, Three.js for the cat.",
    year: 2026,
    role: "Design & engineering",
    tech: ["React Router v7", "Cloudflare Workers", "Sanity", "Three.js"],
    url: "https://yuni.cat",
    repo: "https://github.com/Harineko0",
  },
  {
    _id: "w2",
    title: "GDG on Campus Osaka — site",
    slug: "gdg-osaka-site",
    summary:
      "Information site for a student developer community at The University of Osaka. Multilingual, event-driven.",
    year: 2024,
    role: "Lead engineer",
    tech: ["Next.js", "i18n", "Firebase"],
  },
  {
    _id: "w3",
    title: "Soramame",
    slug: "soramame",
    summary:
      "A study-buddy app for the Applied IT Engineer exam. Spaced repetition, past-question search, dark mode.",
    year: 2024,
    role: "Solo",
    tech: ["TypeScript", "Postgres", "Hono"],
  },
  {
    _id: "w4",
    title: "neko-fs",
    slug: "neko-fs",
    summary:
      "A toy purr-sistent filesystem written in Rust, for understanding inode layouts the hard way.",
    year: 2025,
    role: "Solo",
    tech: ["Rust", "FUSE"],
  },
];
