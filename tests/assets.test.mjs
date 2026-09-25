import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const SOURCE_EXTENSIONS = new Set([".css", ".json", ".ts", ".tsx"]);
const PUBLIC_ASSET =
  /["'`](\/(?:Hero-products|backgrounds|backgrounds2|images|logo|media|models|sofin-yogur-pics|textures)\/[^"'`$?]+)["'`]/g;

function collectSourceFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(filePath);
    return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [filePath] : [];
  });
}

test("Every literal public asset referenced by source code exists", () => {
  const missing = [];

  for (const filePath of collectSourceFiles(path.join(process.cwd(), "src"))) {
    const source = fs.readFileSync(filePath, "utf8");

    for (const match of source.matchAll(PUBLIC_ASSET)) {
      const assetPath = path.join(process.cwd(), "public", match[1]);
      if (!fs.existsSync(assetPath)) {
        missing.push(`${path.relative(process.cwd(), filePath)}: ${match[1]}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
