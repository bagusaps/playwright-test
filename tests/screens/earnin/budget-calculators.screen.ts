import { expect, Page } from '@playwright/test';
import { verifyAnalyticsEventProperties } from '../../utils/segment';

export class BudgetCalculatorScreen {
  readonly page: Page;
  readonly projectName: string;
  readonly agreeCookiesButton;
  readonly budgetCalculatorDesc;
  readonly incomeInput;
  readonly zipCodeInput;
  readonly calculateButton;

  constructor(page: Page, projectName = '') {
    this.page = page;
    this.projectName = projectName;
    this.agreeCookiesButton = page.getByRole('button', { name: /i agree/i });
    this.budgetCalculatorDesc = page.getByText(/get insights into your spending habits/i);
    this.incomeInput = page.getByTestId('income');
    this.zipCodeInput = page.getByTestId('zipcode');
    this.calculateButton = page.getByTestId('calculate-button');
  }

  async verifyBudgetCalculatorScreenVisible() {
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL('/financial-tools/budget-calculator');
      await this.agreeCookiesButton.isVisible({ timeout: 30000 });
      await this.page.waitForTimeout(3000);
      await this.page.waitForLoadState('domcontentloaded')
      await expect(this.budgetCalculatorDesc).toBeVisible({ timeout: 30000 });
  }

  async calculateBudget(income: string, zipCode: string) {
    await this.incomeInput.fill(income);
    await this.zipCodeInput.fill(zipCode);
    await this.calculateButton.click();
  }

  async inputIncomeBudgetCalculators(income: string) {
    await this.incomeInput.fill(income);
  }

  async inputZipCodeBudgetCalculators(zipCode: string) {
    await this.zipCodeInput.fill(zipCode);
  }

  async clickCalculateBudgetCalculator() {
    await this.calculateButton.click();
  }

  async verifyEventViewedBudgetCalculators() {
    await verifyAnalyticsEventProperties(this.page, 'User viewed screen', {
      screenName: 'Budget Calculator',
    });
  }

  async verifyEventInputIncomeBudgetCalculators() {
    await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {
      elementName: 'Income',
      component: 'Input Field',
    });
  }

  async verifyEventInputZipCodeBudgetCalculators() {
    await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {
      elementName: 'Zip Code',
      component: 'Input Field',
    });
  }

  async verifyEventCalculateButtonBudgetCalculators() {
    await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {
      elementName: 'Calculate',
      component: 'CTA',
    });
  }
}
