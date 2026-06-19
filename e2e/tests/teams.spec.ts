import { test, expect } from '@playwright/test';

test.describe('Teams Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teams');
    await page.waitForLoadState('networkidle');
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.getByText('Premier League Clubs')).toBeVisible();
  });

  test('shows team cards with names', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Arsenal FC' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Liverpool FC' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Chelsea FC' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tottenham Hotspur' })).toBeVisible();
  });

  test('shows stadium names on team cards', async ({ page }) => {
    await expect(page.getByText('Emirates Stadium')).toBeVisible();
    await expect(page.getByText('Anfield')).toBeVisible();
  });

  test('shows W/D/L badges', async ({ page }) => {
    const wBadges = page.getByText(/^W \d+$/);
    await expect(wBadges.first()).toBeVisible();
  });

  test('navigates to team detail on click', async ({ page }) => {
    await page.getByRole('heading', { name: 'Arsenal FC' }).click();
    await expect(page).toHaveURL(/\/teams\//);
    await expect(page.getByRole('heading', { name: 'Arsenal FC' })).toBeVisible();
  });

  test('screenshot of teams page', async ({ page }) => {
    await expect(page.getByText('Premier League Clubs')).toBeVisible();
    await page.screenshot({ path: 'screenshots/teams-page.png', fullPage: true });
  });
});
