import {test, expect} from '@playwright/test';

test('Company chapters reveal in order and year navigation follows the selected chapter', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const errors: string[] = []; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/ru/company');
  await expect(page.locator('main h1')).toBeVisible();
  await page.locator('a[href="#company-journey"]').click();
  await expect(page.locator('[data-company-year="2000"] h3')).toBeInViewport();
  for (const year of ['2017','2019','2021']) {
    const link=page.locator(`#company-journey nav a[href="#year-${year}"]`);
    await link.click();
    await expect(link).toHaveAttribute('aria-current','step');
    const card=page.locator(`[data-company-year="${year}"] h3`);
    await expect(card).toBeInViewport();
    await expect(card.locator('..')).toHaveCSS('opacity','1');
  }
  expect(errors).toEqual([]);
});

test('Removed 400 g cottage cheese is absent from catalog and all localized routes', async ({page,request}) => {
  await page.goto('/ru/products?category=tvorog');
  await expect(page.locator('a[href*="/products/tvorog-soft-5"]')).toHaveCount(0);
  for (const locale of ['ru','en','uz']) expect((await request.get(`/${locale}/products/tvorog-soft-5`)).status()).toBe(404);
});

test('Homepage snap centers the story and scene navigation disappears beyond the hero', async ({page},info) => {
  test.skip(info.project.name!=='desktop');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ru');
  await expect(page.locator('main h1:visible')).toBeVisible();
  await page.keyboard.press('PageDown');
  await expect(page.locator('.home-scene-dot').nth(1)).toHaveAttribute('aria-current','step');
  await expect.poll(async()=>Math.abs((await page.locator('[data-scene-index="1"]').boundingBox())!.y)).toBeLessThan(3);
  const copy=page.locator('[data-scene-index="1"] .home-scene-copy');
  await expect(copy).toBeVisible();
  await page.waitForTimeout(1100);
  const box=(await copy.boundingBox())!;
  expect(Math.abs(box.y+box.height/2-450)).toBeLessThan(90);
  await page.locator('.home-scene-dot').nth(2).click();
  await expect.poll(async()=>Math.abs((await page.locator('[data-scene-index="2"]').boundingBox())!.y)).toBeLessThan(3);
  await page.locator('[data-home-scroll-showcase]').evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top+400,behavior:'instant'}));
  await expect(page.locator('.home-scene-dot').first()).not.toBeVisible();
});

test('Cup title and final collection clear the format toolbar', async ({page},info) => {
  test.skip(info.project.name!=='desktop'); test.setTimeout(90000);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ru/yogurts');
  await expect(page.locator('canvas')).toBeVisible({timeout:30000});
  await page.getByRole('button',{name:'Открыть йогурты'}).click();
  await expect(page.locator('.cup-scene-headline h1')).toHaveCSS('opacity','1');
  const toolbar=(await page.locator('.immersive-mode-bar').boundingBox())!;
  expect((await page.locator('.cup-scene-headline').boundingBox())!.y).toBeGreaterThan(toolbar.y+toolbar.height+12);
  // Each input advances the actual animated showcase, through every flavor to its collection.
  await page.locator("body").click({position:{x:5,y:400}});
  for(let step=1;step<=9;step++) {
    await expect(page.locator('.cup-model-stage')).toHaveAttribute('data-cup-step',String(step));
    await expect(page.locator('.cup-model-stage')).toHaveAttribute('data-cup-progress','1');
    if (step === 2) {
      for (const [width,height] of [[768,600],[1440,650],[1440,900],[1920,1080]]) {
        await page.setViewportSize({width,height});
        await expect(page.locator('.cup-scene-description')).toHaveCSS('opacity','1');
        const title=(await page.locator('.cup-scene-headline').boundingBox())!;
        expect((await page.locator('.cup-scene-description').boundingBox())!.y).toBeGreaterThan(title.y+title.height+8);
      }
      await page.setViewportSize({width:1440,height:900});
    }
    await page.keyboard.press('PageDown');
  }
  await expect(page.locator('[data-collection-stage]')).toHaveAttribute('data-collection-stage','1');
  const heading=(await page.locator('.collection-heading').boundingBox())!;
  expect(heading.y).toBeGreaterThan(toolbar.y+toolbar.height+12);
  const slide=(await page.locator('.collection-slide').first().boundingBox())!;
  expect(slide.y).toBeGreaterThan(heading.y+heading.height+8);
});

test('Mobile yogurt catalog control stays above content and product links work', async ({page},info) => {
  test.skip(info.project.name!=='mobile');test.setTimeout(60000);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/ru/yogurts?showcase=bottles');
  await expect(page.locator('canvas')).toBeVisible({timeout:30000});
  await page.getByRole('button',{name:'Смотреть продукты',exact:true}).click();
  const card=page.locator('[data-showcase-copy][aria-hidden="false"]');
  await expect(card).toHaveCSS('opacity','1');
  const link=card.getByRole('link');
  await expect(link).toBeInViewport();
  const exit=(await page.locator('.immersive-exit').boundingBox())!;
  const copy=(await card.boundingBox())!;
  expect(exit.y+exit.height).toBeLessThan(copy.y);
  await link.click();await expect(page).toHaveURL(/\/products\/yogurt-pineapple-270$/);
  await page.goto('/ru/yogurts');
  await page.getByRole('button',{name:'Открыть йогурты'}).click();
  await expect(page.locator('.cup-mobile-copy h1')).toHaveCSS('opacity','1');
  await page.waitForTimeout(2500);
  await page.locator('body').click({position:{x:5,y:400}});
  await page.keyboard.press('PageDown');
  await expect(page.locator('.cup-mobile-copy a').filter({hasText:'Подробнее'})).toBeVisible();
  await page.locator('.cup-mobile-copy a').filter({hasText:'Подробнее'}).click();
  await expect(page).toHaveURL(/\/products\/yogurt-pineapple-120$/);
});
