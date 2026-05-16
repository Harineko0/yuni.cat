import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { MotionConfig } from "motion/react";

import type { Route } from "./+types/root";
import { RouteTransition } from "./components/RouteTransition";
import "./app.css";

export const SITE_URL = "https://yuni.cat";
export const OGP_IMAGE = `${SITE_URL}/ogp.png`;
export const OGP_IMAGE_WIDTH = "2560";
export const OGP_IMAGE_HEIGHT = "1360";
const DEFAULT_TITLE = "yuni.cat";
const DEFAULT_DESCRIPTION =
  "Portfolio of Harineko — student at the University of Osaka and software engineer.";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "canonical", href: SITE_URL },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: DEFAULT_TITLE },
  { name: "description", content: DEFAULT_DESCRIPTION },
  { property: "og:site_name", content: "yuni.cat" },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "ja_JP" },
  { property: "og:locale:alternate", content: "en_US" },
  { property: "og:title", content: DEFAULT_TITLE },
  { property: "og:description", content: DEFAULT_DESCRIPTION },
  { property: "og:url", content: SITE_URL },
  { property: "og:image", content: OGP_IMAGE },
  { property: "og:image:secure_url", content: OGP_IMAGE },
  { property: "og:image:type", content: "image/png" },
  { property: "og:image:width", content: OGP_IMAGE_WIDTH },
  { property: "og:image:height", content: OGP_IMAGE_HEIGHT },
  { property: "og:image:alt", content: "yuni.cat — Harineko's portfolio" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: DEFAULT_TITLE },
  { name: "twitter:description", content: DEFAULT_DESCRIPTION },
  { name: "twitter:image", content: OGP_IMAGE },
  { name: "twitter:image:alt", content: "yuni.cat — Harineko's portfolio" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d827c0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <RouteTransition />
    </MotionConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Page not found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="page-shell">
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 className="font-compressed page-title">{message}</h1>
        <p style={{ color: "#ccc" }}>{details}</p>
        {stack && (
          <pre style={{ marginTop: "2rem", padding: "1rem", background: "#111", borderRadius: 6, overflowX: "auto", fontSize: "0.8rem" }}>
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
