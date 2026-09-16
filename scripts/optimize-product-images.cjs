/* Preserve source packaging artwork; normalize whitespace and export browser-sized WebP. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const sharp = require(require.resolve('sharp', {paths: [path.dirname(require.resolve('next/package.json'))]}));

const source = fs.readFileSync('src/components/products/products-data.ts', 'utf8')
  .replace('import {assetUrl} from "@/lib/assets";', 'const assetUrl = (src: string) => src;');
const moduleContext = {exports: {}};
vm.runInNewContext(ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText, {exports: moduleContext.exports, require});

async function optimize() {
  const index = {};
  fs.mkdirSync('public/images/optimized/products', {recursive: true});
  for (const product of moduleContext.exports.listedProducts) {
    const input = moduleContext.exports.getProductImage(product);
    const output = `/images/optimized/products/${product.slug}.webp`;
    await sharp(`public${input}`).rotate().flatten({background: '#ffffff'})
      .trim({background: '#ffffff', threshold: 12})
      .resize({width: 720, height: 800, fit: 'contain', background: '#ffffff'})
      .extend({top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff'})
      .webp({quality: 85}).toFile(`public${output}`);
    index[product.slug] = output;
  }
  fs.writeFileSync('src/data/product-images.json', `${JSON.stringify(index, null, 2)}\n`);
  const backgrounds = [
    ['images/main-hero-4k.png', 'home-desktop', 1920],
    ['images/home/mobile-hero-products.png', 'home-mobile', 900],
    ['images/yogurts/sofin-yogurt-cups-hero-4k.png', 'cups-desktop', 1600],
    ['images/yogurts/sofin-yogurt-cups-hero-mobile.webp', 'cups-mobile', 800],
    ['sofin-yogur-pics/background-bottles.png', 'bottles-desktop', 1600],
    ['sofin-yogur-pics/background-bottles-m.png', 'bottles-mobile', 800]
  ];
  for (const [input, name, width] of backgrounds) {
    await sharp(`public/${input}`).resize({width, withoutEnlargement: true})
      .webp({quality: 82}).toFile(`public/images/optimized/${name}.webp`);
  }
  console.log(`Optimized ${Object.keys(index).length} product images and ${backgrounds.length} backgrounds.`);
}
optimize().catch(error => {console.error(error); process.exitCode = 1;});
