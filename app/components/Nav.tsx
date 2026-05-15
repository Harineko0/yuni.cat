import { personal } from "../lib/personal";

const NAV_LINKS = [
  { label: "ARTICLES", href: "#articles", external: false },
  { label: "GITHUB", id: "github" as const },
  { label: "TWITTER", id: "x" as const },
  { label: "INSTAGRAM", href: "https://instagram.com/", external: true },
  { label: "ZENN", id: "zenn" as const },
  { label: "QIITA", id: "qiita" as const },
];

function resolve(item: typeof NAV_LINKS[number]) {
  if ("id" in item && item.id) {
    const s = personal.socials.find((s) => s.id === item.id);
    return { href: s?.url ?? "#", external: true };
  }
  return { href: (item as { href: string }).href, external: (item as { external?: boolean }).external ?? false };
}

export function Nav() {
  return (
    <nav className="nav-strip font-compressed" aria-label="primary">
      {NAV_LINKS.map((item) => {
        const { href, external } = resolve(item);
        return (
          <a
            key={item.label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
            className="nav-link"
          >
            <span className="nav-link-label">{item.label}</span>
            <span className="nav-link-fill" aria-hidden="true">
              <span className="nav-link-fill-text">{item.label}</span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
