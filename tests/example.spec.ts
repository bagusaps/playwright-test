import { test } from '@playwright/test';
import { HomeScreen } from '../screens/HomeScreen';

test('User see homescreen', async ({ page }) => {
  const homeScreen = new HomeScreen(page);

  await homeScreen.goto();
  await homeScreen.isTitleHomeScreenVisible();

});

