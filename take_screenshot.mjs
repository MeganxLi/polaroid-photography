import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Desktop Screenshot
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot_desktop.png' });

  // Mobile Screenshot (iPhone SE)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 667 });
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'screenshot_mobile.png' });

  await browser.close();
})();