import { test, expect } from '@playwright/test';

test('dashboard smoke: header and autotest button are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/WWG QA Team/i)).toBeVisible();
  await expect(page.getByText(/Beta 2\.0/i)).toBeVisible();
  await expect(page.getByTestId('autotest-start')).toBeVisible();
});

test('in-browser QA autotest can run', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('autotest-start').click();
  await expect(page.getByText('WEBVIEW QA')).toBeVisible();
  await expect(page.getByText(/Smoke OK|Є fail/i)).toBeVisible({ timeout: 15000 });
});

test('temporary mail special panel toggles without creating account', async ({ page }) => {
  await page.goto('/');
  const mail = page.locator('#section-temp-mail');
  await mail.evaluate(node => { node.open = true; });
  await page.getByTestId('special-mail-toggle').click();
  await expect(page.getByTestId('special-mail-input')).toBeVisible();
  await page.getByTestId('special-mail-input').fill(`wwg-auto-${Date.now()}+qa`);
  await expect(page.getByTestId('special-mail-input')).toHaveValue(/wwg-auto-/);
});

test('device info modal opens', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('device-info-details').click();
  await expect(page.getByText('Device Info').first()).toBeVisible();
});
