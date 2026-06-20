import { test, expect } from '@playwright/test';

test.describe('Team Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teams');
    await page.waitForLoadState('networkidle');
    await page.getByRole('heading', { name: 'Arsenal FC' }).click();
    await expect(page).toHaveURL(/\/teams\//);
    await page.waitForLoadState('networkidle');
  });

  test('shows team name as heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Arsenal FC' })).toBeVisible();
  });

  test('shows squad tab', async ({ page }) => {
    await expect(page.getByText('Squad')).toBeVisible();
  });

  test('shows fixtures section', async ({ page }) => {
    await expect(page.getByText('Fixtures')).toBeVisible();
  });

  test('shows player names in squad', async ({ page }) => {
    await expect(page.getByText('Bukayo Saka')).toBeVisible();
  });

  test('screenshot of team detail page', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/team-detail-page.png', fullPage: true });
  });
});
