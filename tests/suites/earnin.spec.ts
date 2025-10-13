import { test } from '@playwright/test';
import { FinancialCalculatorsScreen } from '../screens/earnin/financial-calculators.screen';
import { BudgetCalculatorScreen } from '../screens/earnin/budget-calculators.screen';
import { interceptSegmentT } from '../utils/segment';

test('Verify analytic event calculate budget calculator', async ({ page }) => {
  await interceptSegmentT(page);
  const financialCalculators = new FinancialCalculatorsScreen(page);
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