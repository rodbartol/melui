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
writeFileSync(join(root, "dist/mel.ui.css"), all);
writeFileSync(
  join(root, "dist/tokens.css"),
  bundle(join(root, "src/tokens/index.css")),
);

// Demo pages with the CSS inlined, so each file works on its own.
for (const name of readdirSync(join(root, "docs")).filter((f) =>
  f.endsWith(".html"),
)) {
  const html = readFileSync(join(root, "docs", name), "utf8").replace(
    /<link[^>]+href=["'][^"']*src\/index\.css["'][^>]*>/,
    () => `<style>\n${all}\n</style>`,
  );
  writeFileSync(join(root, "dist/docs", name), html);
}

console.log("Built dist/melui.css, dist/tokens.css, dist/docs/*.html");
