export const personal = {
  name: "Yunineko",
  handle: "yuni.cat",
  tagline: "Undergraduate · web & systems engineer · sometimes a cat",
  affiliation: {
    school: "The University of Osaka",
    faculty: "School of Engineering Science",
    department: "Information and Computer Sciences",
    status: "undergraduate",
  },
  certifications: ["Applied Information Technology Engineer Examination"],
  roles: [
    {
      title: "Ex-Organizer",
      org: "GDG on Campus Osaka",
      period: "2024–2025",
    },
  ],
  email: "info@yuni.cat",
  socials: [
    { id: "github", label: "GitHub", handle: "Harineko0", url: "https://github.com/Harineko0" },
    { id: "x", label: "X / Twitter", handle: "@harineko_univ", url: "https://twitter.com/harineko_univ" },
    { id: "qiita", label: "Qiita", handle: "harineko0", url: "https://qiita.com/harineko0" },
    { id: "zenn", label: "Zenn", handle: "harineko", url: "https://zenn.dev/harineko" },
    { id: "sizu", label: "sizu.me", handle: "harineko", url: "https://sizu.me/harineko" },
    { id: "email", label: "Email", handle: "info@yuni.cat", url: "mailto:info@yuni.cat" },
  ] as const,
};

export type SocialId = (typeof personal.socials)[number]["id"];
