import { ImageResponse, loadGoogleFont } from "workers-og";

export type OgKind = "blog" | "works";

export type OgInput = {
  kind: OgKind;
  title: string;
  subtitle?: string;
  meta?: string;
};

const WIDTH = 1200;
const HEIGHT = 630;

const PALETTE: Record<OgKind, { bg: string; accent: string; chip: string; chipText: string }> = {
  blog: { bg: "#F300F3", accent: "#f5c01a", chip: "#000000", chipText: "#b6ff3a" },
  works: { bg: "#000000", accent: "#b6ff3a", chip: "#F300F3", chipText: "#000000" },
};

const LABEL: Record<OgKind, string> = {
  blog: "ARTICLE",
  works: "WORK",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pickTitleSize(title: string) {
  const n = title.length;
  if (n <= 18) return 116;
  if (n <= 28) return 96;
  if (n <= 44) return 80;
  if (n <= 64) return 64;
  return 52;
}

function fontCharset(...parts: Array<string | undefined>) {
  const joined = parts.filter(Boolean).join(" ");
  const uniq = Array.from(new Set(joined.split("")));
  return uniq.join("");
}

export async function renderOgImage(input: OgInput): Promise<Response> {
  const { kind, title, subtitle, meta } = input;
  const p = PALETTE[kind];
  const label = LABEL[kind];

  const titleSize = pickTitleSize(title);
  const safeTitle = escapeHtml(title);
  const safeSubtitle = subtitle ? escapeHtml(subtitle) : null;
  const safeMeta = meta ? escapeHtml(meta) : null;

  const latinText = `${label} yuni.cat / by Harineko 0123456789-:/·`;
  const jpText = fontCharset(title, subtitle, meta);

  const [antonFont, jpRegular, jpBold] = await Promise.all([
    loadGoogleFont({ family: "Anton", weight: 400, text: `${latinText}${title}` }),
    loadGoogleFont({ family: "Noto Sans JP", weight: 500, text: jpText || " " }),
    loadGoogleFont({ family: "Noto Sans JP", weight: 700, text: jpText || " " }),
  ]);

  const html = `
    <div style="display:flex;flex-direction:column;width:${WIDTH}px;height:${HEIGHT}px;background:${p.bg};font-family:'Noto Sans JP';position:relative;">
      <div style="display:flex;position:absolute;top:0;left:0;right:0;height:14px;background:${p.accent};"></div>
      <div style="display:flex;position:absolute;bottom:0;left:0;right:0;height:14px;background:${p.accent};"></div>

      <div style="display:flex;flex-direction:column;padding:72px 80px 64px 80px;flex:1;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:18px;">
          <div style="display:flex;background:${p.chip};color:${p.chipText};font-family:'Anton';font-size:34px;letter-spacing:0.16em;padding:10px 22px 8px;line-height:1;">${label}</div>
          ${safeMeta ? `<div style="display:flex;color:${p.accent};font-size:28px;font-weight:700;letter-spacing:0.04em;">${safeMeta}</div>` : ""}
        </div>

        <div style="display:flex;flex-direction:column;gap:24px;">
          <div style="display:flex;color:#ffffff;font-size:${titleSize}px;font-weight:700;line-height:1.15;letter-spacing:-0.01em;max-width:1040px;">${safeTitle}</div>
          ${safeSubtitle ? `<div style="display:flex;color:#ffffff;opacity:0.85;font-size:30px;line-height:1.45;max-width:1000px;">${safeSubtitle}</div>` : ""}
        </div>

        <div style="display:flex;align-items:flex-end;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;">
            <div style="display:flex;color:${p.accent};font-family:'Anton';font-size:64px;letter-spacing:0.02em;line-height:1;">yuni.cat</div>
            <div style="display:flex;color:#ffffff;opacity:0.75;font-size:24px;margin-top:8px;">by Harineko</div>
          </div>
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="display:flex;width:18px;height:18px;background:${p.accent};border-radius:9999px;"></div>
            <div style="display:flex;width:18px;height:18px;background:#ffffff;border-radius:9999px;"></div>
            <div style="display:flex;width:18px;height:18px;background:${p.chip};border-radius:9999px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  return new ImageResponse(html, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Anton", data: antonFont, weight: 400, style: "normal" },
      { name: "Noto Sans JP", data: jpRegular, weight: 500, style: "normal" },
      { name: "Noto Sans JP", data: jpBold, weight: 700, style: "normal" },
    ],
  });
}

export const OG_WIDTH = WIDTH;
export const OG_HEIGHT = HEIGHT;
