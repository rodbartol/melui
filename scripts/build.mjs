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

// Each page has a symbol (filled, 24px grid), shown in the nav and on the home cards.
const icons = {
  "index.html": "M12 3 2 12h3v9h5v-6h4v6h5v-9h3z",
  "identity.html": "M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z",
  "semantics.html": "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z",
  "palette.html": "M12 2C8 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-3-7-7-12Z",
  "materials.html": "M12 2 1 8l11 6 11-6zm-8.6 9.3L1 12.6l11 6 11-6-2.4-1.3L12 16z",
  "card.html": "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  "forms.html": "M3 17.3V21h3.7L17.8 9.9l-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z",
  "actions.html": "M5 11h10.2l-4.6-4.6L12 5l7 7-7 7-1.4-1.4 4.6-4.6H5z",
  "feedback.html": "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1 8v8h2v-8zm0-4v2h2V6z",
  "structure.html": "M4 5h3v3H4zm5 0h11v3H9zM4 10.5h3v3H4zm5 0h11v3H9zM4 16h3v3H4zm5 0h11v3H9z",
  "themes.html": "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2v16a8 8 0 0 0 0-16Z",
};
const symbol = (file, cls) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[file]}" /></svg>`;

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
      html += `<li><a class="ui-list-item" href="${file}"${file === current ? ' aria-current="page"' : ""}>${symbol(file, "ui-list-symbol")}<span class="ui-list-title">${title}</span></a></li>`;
    html += "</ul>";
  }
  return html;
};

for (const [, file, title] of pages) {
  let style = "", content;
  if (file === "index.html")
    content = readFileSync(join(root, "site/index.html"), "utf8").replace(
      /\{\{symbol:([\w.]+)\}\}/g,
      (_, f) => symbol(f, "ui-card-symbol"),
    );
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
