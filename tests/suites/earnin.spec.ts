import { test } from '@playwright/test';
import { FinancialCalculatorsScreen } from '../screens/earnin/financial-calculators.screen';
import { BudgetCalculatorScreen } from '../screens/earnin/budget-calculators.screen';
import { interceptSegmentT } from '../utils/segment';

test.describe('earnin financial calculator scenario @earnin', () => {
  test('Verify analytic event calculate budget calculator', async ({ page }, testInfo) => {
    await interceptSegmentT(page);
    const financialCalculators = new FinancialCalculatorsScreen(page, testInfo.project.name);
    const budgetCalculators = new BudgetCalculatorScreen(page);
    await financialCalculators.goToFinancialCalculator();
    await financialCalculators.clickBudgetCalculator();
    await budgetCalculators.verifyBudgetCalculatorScreenVisible();
    await budgetCalculators.verifyEventViewedBudgetCalculators();
    await budgetCalculators.inputIncomeBudgetCalculators('9000');
    await budgetCalculators.verifyEventInputIncomeBudgetCalculators();
    await budgetCalculators.inputZipCodeBudgetCalculators('94040');
    await budgetCalculators.verifyEventInputZipCodeBudgetCalculators();
    await budgetCalculators.clickCalculateBudgetCalculator();
    await budgetCalculators.verifyEventCalculateButtonBudgetCalculators();
  });

  test('Compare snapshot financial calculator screen', async ({ page }, testInfo) => {
    const financialCalculators = new FinancialCalculatorsScreen(page, testInfo.project.name);
    await financialCalculators.goToFinancialCalculator();
    await financialCalculators.compareSnapshot();
  });
});
