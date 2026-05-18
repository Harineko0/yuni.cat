import { Marked, type Tokens } from "marked";
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from "shiki";
import githubDarkDefault from "shiki/themes/github-dark-default.mjs";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import dart from "shiki/langs/dart.mjs";
import diff from "shiki/langs/diff.mjs";
import go from "shiki/langs/go.mjs";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import json5 from "shiki/langs/json5.mjs";
import jsonc from "shiki/langs/jsonc.mjs";
import jsx from "shiki/langs/jsx.mjs";
import markdown from "shiki/langs/markdown.mjs";
import protobuf from "shiki/langs/protobuf.mjs";
import python from "shiki/langs/python.mjs";
import rust from "shiki/langs/rust.mjs";
import sql from "shiki/langs/sql.mjs";
import svelte from "shiki/langs/svelte.mjs";
import toml from "shiki/langs/toml.mjs";
import tsx from "shiki/langs/tsx.mjs";
import typescript from "shiki/langs/typescript.mjs";
import vue from "shiki/langs/vue.mjs";
import yaml from "shiki/langs/yaml.mjs";

const highlighter = createHighlighterCoreSync({
  themes: [githubDarkDefault],
  langs: [
    bash,
    css,
    dart,
    diff,
    go,
    html,
    javascript,
    json,
    json5,
    jsonc,
    jsx,
    markdown,
    protobuf,
    python,
    rust,
    sql,
    svelte,
    toml,
    tsx,
    typescript,
    vue,
    yaml,
  ],
  engine: createJavaScriptRegexEngine(),
});

const SUPPORTED = new Set(highlighter.getLoadedLanguages());

const LANG_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  py: "python",
  rs: "rust",
  md: "markdown",
  yml: "yaml",
  proto: "protobuf",
};

function resolveLang(lang: string): string {
  const normalized = lang.toLowerCase();
  const aliased = LANG_ALIASES[normalized] ?? normalized;
  return SUPPORTED.has(aliased) ? aliased : "text";
}

const marked = new Marked({ gfm: true, breaks: false, async: true });

marked.use({
  async: true,
  walkTokens: (token) => {
    if (token.type !== "code") return;
    const code = token as Tokens.Code;
    const lang = resolveLang((code.lang ?? "").trim());
    try {
      const html = highlighter.codeToHtml(code.text, {
        lang,
        theme: "github-dark-default",
      });
      (token as unknown as Tokens.HTML).type = "html";
      (token as unknown as Tokens.HTML).text = html;
      (token as unknown as Tokens.HTML).block = true;
    } catch {
      // Leave default rendering on failure.
    }
  },
});

export async function renderMarkdown(value: string): Promise<string> {
  return (await marked.parse(value)) as string;
}
