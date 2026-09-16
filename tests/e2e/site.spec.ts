import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {listedProducts} from '../../src/components/products/products-data';
import {recipes} from '../../src/components/recipes/recipes-data';

const locales = ['uz', 'ru', 'en'] as const;
const routes = ['', '/products', '/yogurts', '/yogurts?showcase=bottles', '/company', '/recipes', '/contacts', `/products/${listedProducts[0].slug}`, `/recipes/${recipes[0].slug}`];
for (const locale of locales) for (const route of routes) {
  test(`${locale}${route || '/'}: renders, fits and passes accessibility checks`, async ({page}) => {
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(`/${locale}${route}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1:visible').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('main h1:visible').first()).toHaveCSS('opacity', '1');
    const axe = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations.map(v => ({id:v.id, nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
    expect(errors).toEqual([]);
    expect(await page.title()).not.toBe('SOFIN');
  });
}

test('Catalog filters, search, reset and language preserve URL state', async ({page}, info) => {
  await page.goto('/ru/products');
  await expect(page.locator('.catalog-card')).toHaveCount(30);
  if (info.project.name === 'mobile') await page.getByRole('button', {name: 'Фильтры'}).click();
  await page.locator('.filter-chip').filter({hasText: /^Кефир$/}).click();
  await expect(page.locator('.catalog-card')).toHaveCount(4);
  await expect(page).toHaveURL(/category=kefir/);
  await page.getByRole('searchbox').fill('zzzz-no-product');
  await expect(page.locator('.catalog-card')).toHaveCount(0);
  await page.locator('.catalog-results-line button').click();
  await expect(page.locator('.catalog-card')).toHaveCount(30);
  await page.goto('/ru/yogurts?showcase=bottles');
  if (info.project.name === 'mobile') await page.locator('header button[aria-controls="mobile-navigation"]').click();
  await page.locator('header').getByRole('link', {name: 'EN', exact:true}).filter({visible:true}).click();
  await expect(page).toHaveURL(/\/en\/yogurts\?showcase=bottles/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('Product gallery traps focus, closes with Escape and returns focus', async ({page}) => {
  await page.goto(`/ru/products/${listedProducts[0].slug}`);
  const trigger = page.locator('.product-gallery-main'); await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('Mobile menu closes with Escape, releases scroll and restores focus', async ({page}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/ru');
  const trigger = page.locator('header button[aria-controls="mobile-navigation"]');
  await trigger.click(); await expect(trigger).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#main-content')).toHaveAttribute('inert','');
  await page.keyboard.press('Escape'); await expect(trigger).toHaveAttribute('aria-expanded','false');
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('Form shows localized server and network errors without losing text', async ({page}) => {
  await page.goto('/ru/contacts');
  await page.locator('input[name="name"]').fill('Анна');
  await page.locator('input[name="email"]').fill('anna@example.org');
  await page.locator('textarea[name="message"]').fill('Тест интерфейса без отправки письма.');
  await page.route('**/api/contact', route => route.fulfill({status:429, contentType:'application/json', body:JSON.stringify({ok:false,code:'rate_limited'})}));
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator('form').getByRole('alert')).toContainText(/попыток|позже/);
  await expect(page.locator('textarea[name="message"]')).toHaveValue('Тест интерфейса без отправки письма.');
  await page.unroute('**/api/contact'); await page.route('**/api/contact', route => route.abort());
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator('form').getByRole('alert')).not.toContainText(/Failed to fetch|NetworkError/);
});

test('Small screens and tablets have no text overflow', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const width of [320, 768, 1024, 1920]) for (const route of ['/company', '/contacts', '/recipes', '/yogurts?showcase=bottles', `/recipes/${recipes[0].slug}`]) {
    await page.setViewportSize({width,height:900}); await page.goto(`/ru${route}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} ${route}`).toBe(true);
    const overflow = await page.locator('main h1, main h2, main h3, main p, main dt, main dd').evaluateAll(elements => elements.filter(e=>e.clientWidth>0 && e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));
    expect(overflow, `${width} ${route}`).toEqual([]);
  }
});

test('Reduced-motion pages do not load remote R2 assets or 3D models', async ({page}) => {
  const bad: string[] = []; page.on('request', req => {if (/\.r2\.dev|\.glb(?:\?|$)/.test(req.url())) bad.push(req.url());});
  for (const route of ['/ru', '/ru/yogurts', '/ru/yogurts?showcase=bottles']) {await page.goto(route); await page.locator('main h1:visible').first().waitFor();}
  expect(bad).toEqual([]);
});

test('All product and recipe routes resolve; invalid slugs are 404', async ({request}, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const locale of locales) for (const [kind, entries] of [['products',listedProducts], ['recipes', recipes]] as const) {
    for (const item of entries) {const response=await request.get(`/${locale}/${kind}/${item.slug}`); expect(response.status(), item.slug).toBe(200);}
    const response=await request.get(`/${locale}/${kind}/does-not-exist`); expect(response.status()).toBe(404);
  }
});

test('Contact API rejects malformed and oversized requests; honeypot skips delivery', async ({request}, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const data of ['null', '{', JSON.stringify({name:7,email:[],message:{}})]) {const response=await request.post('/api/contact',{data,headers:{'Content-Type':'application/json'}});expect(response.status()).toBe(400);}
  const large=await request.post('/api/contact',{data:'x'.repeat(25000),headers:{'Content-Type':'application/json'}}); expect(large.status()).toBe(413);
  const bot=await request.post('/api/contact',{data:{name:'Test',email:'test@example.org',message:'Honeypot test',website:'bot'}});expect(bot.status()).toBe(200);
});

for (const mode of ['cups', 'bottles']) test(`3D ${mode} is the default experience and its controls work`, async ({page}, info) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const errors: string[] = []; const failures: string[] = [];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('response', response=>{if (response.status()>=400) failures.push(response.url());});
  await page.goto(`/ru/yogurts${mode==='bottles'?'?showcase=bottles':''}`);
  if (mode === 'cups' && info.project.name === 'mobile') await page.getByRole('button', {name: 'Открыть йогурты'}).click();
  await expect(page.locator('.immersive-hub canvas').first()).toBeVisible({timeout:30000});
  await expect(page.locator('.immersive-mode-bar')).toBeVisible();
  await expect(page.locator('.showcase-fallback')).toHaveCount(0);
  await page.waitForTimeout(2000);
  expect(errors).toEqual([]); expect(failures).toEqual([]);
  // Leave the WebGL presentation using its visible catalog control.
  await page.locator('.immersive-exit').click();
  await expect(page.locator('.yogurt-flavors')).toBeVisible();
});

test('Homepage retains its five hero scenes and product/recipe showcase', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const errors: string[] = []; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/ru');
  await expect(page.locator('#hero-story-root [data-scene-index]')).toHaveCount(5);
  await expect(page.locator('[data-home-scroll-showcase]')).toHaveCount(1);
  await expect(page.locator('main h1:visible').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('Product entrance animation is present and respects motion preferences', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`/ru/products/${listedProducts[0].slug}`);
  expect(await page.locator('.product-gallery-entrance').evaluate(e=>getComputedStyle(e).animationName)).toBe('product-gallery-enter');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('.product-gallery-entrance').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
});
