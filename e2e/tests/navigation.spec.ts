import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('redirects / to /teams', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/teams/);
  });

  test('navbar shows all links', async ({ page }) => {
    await page.goto('/teams');
    await expect(page.getByRole('link', { name: /teams/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /matches/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /all players/i })).toBeVisible();
  });

  test('can navigate to matches page', async ({ page }) => {
    await page.goto('/matches');
    await expect(page.getByRole('heading', { name: 'Matches' })).toBeVisible();
  });

  test('can navigate to all players page', async ({ page }) => {
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: 'All Players' })).toBeVisible();
  });
});
