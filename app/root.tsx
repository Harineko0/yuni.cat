import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="yuni.cat — portfolio." />
        <meta property="og:title" content="yuni.cat" />
        <meta property="og:description" content="Personal portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yuni.cat" />
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
  return <Outlet />;
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
