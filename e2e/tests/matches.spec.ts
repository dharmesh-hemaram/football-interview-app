import { test, expect } from '@playwright/test';

test.describe('Matches Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Matches' })).toBeVisible();
  });

  test('shows match status badges', async ({ page }) => {
    const completed = page.getByText('COMPLETED');
    const live = page.getByText('🔴 LIVE');
    const hasStatus = (await completed.count()) > 0 || (await live.count()) > 0;
    expect(hasStatus).toBeTruthy();
  });

  test('shows home and away labels', async ({ page }) => {
    await expect(page.getByText('Home').first()).toBeVisible();
    await expect(page.getByText('Away').first()).toBeVisible();
  });

  test('shows scores for completed matches', async ({ page }) => {
    const scores = page.locator('h3').filter({ hasText: '–' });
    await expect(scores.first()).toBeVisible();
  });

  test('navigates to match detail on click', async ({ page }) => {
    const matchCard = page.locator('.card').first();
    await matchCard.click();
    await expect(page).toHaveURL(/\/matches\//);
  });

  test('screenshot of matches page', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/matches-page.png', fullPage: true });
  });
});
