import { test, expect } from '@playwright/test';

test.describe('Players Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/players');
    await page.waitForLoadState('networkidle');
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'All Players' })).toBeVisible();
  });

  test('shows player names', async ({ page }) => {
    await expect(page.getByText('Bukayo Saka')).toBeVisible();
    await expect(page.getByText('Mohamed Salah')).toBeVisible();
  });

  test('shows position badges', async ({ page }) => {
    const fwdBadges = page.getByText('FWD');
    await expect(fwdBadges.first()).toBeVisible();
  });

  test('shows nationality', async ({ page }) => {
    await expect(page.getByText('England').first()).toBeVisible();
  });

  test('shows card stats', async ({ page }) => {
    const yellowCards = page.getByText(/yellow/i);
    await expect(yellowCards.first()).toBeVisible();
  });

  test('navigates to player detail on click', async ({ page }) => {
    await page.getByText('Bukayo Saka').click();
    await expect(page).toHaveURL(/\/players\//);
    await expect(page.getByText('Bukayo Saka')).toBeVisible();
  });

  test('screenshot of players page', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/players-page.png', fullPage: true });
  });
});
