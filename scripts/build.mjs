// Build melui: bundle CSS @imports into single files and make standalone demo pages.
// Run: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Replace every @import "x.css"; with the contents of x.css (recursively).
function bundle(file) {
  const css = readFileSync(file, "utf8");
  return css.replace(
    /@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g,
    (_, path) => bundle(resolve(dirname(file), path)),
  );
}

mkdirSync(join(root, "dist/docs"), { recursive: true });

const all = bundle(join(root, "src/index.css"));
writeFileSync(join(root, "dist/melui.css"), all);
writeFileSync(
  join(root, "dist/tokens.css"),
  bundle(join(root, "src/tokens/index.css")),
);

// Sample themes: one file each, tokens only.
mkdirSync(join(root, "dist/themes"), { recursive: true });
const themes = readdirSync(join(root, "src/themes")).filter((f) => f.endsWith(".css"));
for (const name of themes)
  writeFileSync(join(root, "dist/themes", name), bundle(join(root, "src/themes", name)));

// Demo pages with every stylesheet from src/ inlined, so each file works on its own.
for (const name of readdirSync(join(root, "docs")).filter((f) =>
  f.endsWith(".html"),
)) {
  const html = readFileSync(join(root, "docs", name), "utf8").replace(
    /<link[^>]+href=["']([^"']*src\/[^"']+\.css)["'][^>]*>/g,
    (_, href) => `<style>\n${bundle(resolve(root, "docs", href))}\n</style>`,
  );
  writeFileSync(join(root, "dist/docs", name), html);
}

console.log(
  `Built dist/melui.css, dist/tokens.css, dist/themes/ (${themes.length}), dist/docs/*.html`,
);

// ---------- Docs site: dist/site, built with Melui, published to GitHub Pages ----------
const site = join(root, "dist/site");
mkdirSync(join(site, "themes"), { recursive: true });
writeFileSync(join(site, "melui.css"), all);
for (const name of themes)
  writeFileSync(join(site, "themes", name), bundle(join(root, "src/themes", name)));
writeFileSync(join(site, "site.css"), readFileSync(join(root, "site/site.css"), "utf8"));

const pages = [
  ["Start", "index.html", "Home"],
  ["Start", "identity.html", "Identity"],
  ["Foundations", "semantics.html", "Tokens"],
  ["Foundations", "palette.html", "Palette"],
  ["Foundations", "materials.html", "Materials"],
  ["Components", "card.html", "Card"],
  ["Components", "forms.html", "Forms"],
  ["Components", "actions.html", "Actions"],
  ["Components", "feedback.html", "Feedback"],
  ["Components", "structure.html", "Structure"],
  ["Themes", "themes.html", "Themes"],
];

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// A small Markdown converter for IDENTITY.md: headings, paragraphs, lists, tables, code.
function markdown(md) {
  const inline = (s) =>
    escape(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const out = [];
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      i++;
      out.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
    } else if (/^#{1,4} /.test(line)) {
      const n = line.match(/^#+/)[0].length;
      out.push(`<h${n}>${inline(line.slice(n + 1))}</h${n}>`);
      i++;
    } else if (line.startsWith("|")) {
      const rows = [];
      for (; i < lines.length && lines[i].startsWith("|"); i++) rows.push(lines[i]);
      const cells = (r) => r.slice(1, -1).split(" | ").map((c) => c.replace(/^\s*\|?\s*|\s*$/g, ""));
      const [head, , ...body] = rows;
      out.push(
        `<div class="site-table"><table><thead><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>` +
          body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
          "</tbody></table></div>",
      );
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [];
      for (; i < lines.length && /^(- |\d+\. )/.test(lines[i]); i++)
        items.push(lines[i].replace(/^(- |\d+\. )/, ""));
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
    } else {
      const para = [];
      for (; i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. |```)/.test(lines[i]); i++) para.push(lines[i]);
      out.push(`<p>${inline(para.join(" "))}</p>`);
    }
  }
  return out.join("\n");
}

const layout = readFileSync(join(root, "site/layout.html"), "utf8");
const nav = (current) => {
  let html = "";
  for (const group of [...new Set(pages.map((p) => p[0]))]) {
    html += `<h2>${group}</h2><ul class="ui-list">`;
    for (const [g, file, title] of pages.filter((p) => p[0] === group))
      html += `<li><a class="ui-list-item" href="${file}"${file === current ? ' aria-current="page"' : ""}><span class="ui-list-title">${title}</span></a></li>`;
    html += "</ul>";
  }
  return html;
};

for (const [, file, title] of pages) {
  let style = "", content;
  if (file === "index.html") content = readFileSync(join(root, "site/index.html"), "utf8");
  else if (file === "identity.html")
    content = `<article class="site-prose">${markdown(readFileSync(join(root, "docs/IDENTITY.md"), "utf8"))}</article>`;
  else {
    // A demo page: keep its own styles (layout of its demos) and its body.
    const html = readFileSync(join(root, "docs", file), "utf8");
    style = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)]
      .map((m) => m[1])
      .join("\n")
      .replace(/(^|\n)(\s*)body \{/g, "$1$2.site-demo-unused {")
      .replace(/body > /g, ".site-main > ")
      .replace(/body:has\(/g, ".site-main:has(");
    style = `<style>${style}</style>`;
    const open = html.match(/<body[^>]*>/);
    content = html.slice(open.index + open[0].length, html.lastIndexOf("</body>"));
  }
  const page = layout
    .replaceAll("{{title}}", title)
    .replace("{{style}}", () => style)
    .replaceAll("{{nav}}", () => nav(file))
    .replace("{{content}}", () => content);
  writeFileSync(join(site, file), page);
}
console.log(`Built dist/site/ (${pages.length} pages)`);
