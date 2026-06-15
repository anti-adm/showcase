import fs from "node:fs";
import path from "node:path";

const SOURCE_ROOTS = ["src", "components"];
const SOURCE_FILES = ["next.config.ts", "middleware.ts"];
const ASSET_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg", "glb"];
const ASSET_RE = new RegExp(
  String.raw`["'\`](\/[^"'\`\s)]+\.(${ASSET_EXTENSIONS.join("|")}))`,
  "gi"
);

const files = [];

for (const root of SOURCE_ROOTS) {
  if (fs.existsSync(root)) walk(root);
}

for (const file of SOURCE_FILES) {
  if (fs.existsSync(file)) files.push(file);
}

const refs = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  let match;

  while ((match = ASSET_RE.exec(content))) {
    const ref = match[1].split("?")[0];
    if (ref.includes("${")) continue;
    if (!refs.has(ref)) refs.set(ref, new Set());
    refs.get(ref).add(file);
  }
}

const missing = [];

for (const [ref, sources] of [...refs.entries()].sort()) {
  const assetPath = path.join("public", ref);
  if (!fs.existsSync(assetPath)) {
    missing.push({ref, sources: [...sources]});
  }
}

console.log(`asset refs: ${refs.size}`);
console.log(`missing assets: ${missing.length}`);

for (const item of missing) {
  console.log(`${item.ref} <- ${item.sources.join(", ")}`);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(entry.name)) walk(fullPath);
      continue;
    }

    if (/\.(tsx?|jsx?|css|json|mjs)$/.test(entry.name)) files.push(fullPath);
  }
}
