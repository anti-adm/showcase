import {test, expect} from '@playwright/test';

for (const mode of ['cups', 'bottles'] as const) {
  test(`${mode}: direct flavor selection, reverse navigation and scroll stay in sync`, async ({page}, info) => {
    test.setTimeout(120000);
    await page.emulateMedia({reducedMotion: 'no-preference'});
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/ru/yogurts${mode === 'bottles' ? '?showcase=bottles' : ''}`);
    const nav = page.locator('[data-flavor-navigation]');
    const mobile = info.project.name === 'mobile';
    const select = async (name: string) => {
      if (mobile) await nav.getByRole('button', {name: 'Вкусы', exact: true}).click();
      const button = nav.getByRole('button', {name, exact: true, includeHidden: true});
      await expect(button).toBeEnabled({timeout: 30000});
      await button.click();
      await expect(button).toHaveAttribute('aria-current', 'true');
      if (mobile) await expect(nav).toHaveAttribute('data-open', 'false');
      if (mode === 'bottles') await expect(page.locator('[data-bottle-running]')).toHaveAttribute('data-bottle-running', 'false');
      else await page.waitForTimeout(1000);
    };
    for (const name of ['Персик', 'Ананас', 'Клубника и банан', 'Малина']) {
      await select(name);
      if (mode === 'cups') {
        const step = {'Персик': '8', 'Ананас': '3', 'Клубника и банан': '9', 'Малина': '2'}[name];
        await expect(page.locator('.cup-model-stage')).toHaveAttribute('data-cup-step', step!);
        await expect(page.locator('.cup-model-stage')).toHaveAttribute('data-cup-progress', '1');
      } else {
        const key = {'Персик': 'shaftoli', 'Ананас': 'ananas', 'Клубника и банан': 'qulupnay-banan', 'Малина': 'malina'}[name];
        await expect(page.locator('[data-bottle-flavor]')).toHaveAttribute('data-bottle-flavor', key!);
      }
    }
    await page.locator('body').click({position: {x: 5, y: 200}});
    await page.keyboard.press('PageDown');
    await expect(nav.locator('[aria-current="true"]')).toContainText(mode === 'cups' ? 'Ананас' : 'Вишня');
    if (mode === 'bottles') await expect(page.locator('[data-bottle-running]')).toHaveAttribute('data-bottle-running', 'false');
    else await expect(page.locator('.cup-model-stage')).toHaveAttribute('data-cup-progress', '1');
    await page.waitForTimeout(700);
    await page.screenshot({path: `test-results/flavors-${mode}-${info.project.name}.png`});
    expect(errors).toEqual([]);
  });
}
