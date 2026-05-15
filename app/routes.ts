import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
  route("works", "routes/works.tsx"),
  route("works/:slug", "routes/works.$slug.tsx"),
] satisfies RouteConfig;
