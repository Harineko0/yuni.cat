import { defineField, defineType } from "sanity";

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "tech", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "repo", type: "url" }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});
