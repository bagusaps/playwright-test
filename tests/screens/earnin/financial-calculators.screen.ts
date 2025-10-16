import { expect, Page } from '@playwright/test';

export class FinancialCalculatorsScreen {
  readonly page: Page;
  readonly projectName: string;
  readonly agreeCoockiesButton;
  readonly financialCalculatorsDesc;
  readonly budgetCalculator;

  constructor(page: Page, projectName = '') {
    this.page = page;
    this.projectName = projectName;
    this.agreeCoockiesButton = page.getByRole('button', { name: /i agree/i });
    this.financialCalculatorsDesc = page.getByText(/use our calculators/i);
    this.budgetCalculator = page.getByRole('heading', { name: /budget calculator/i });
  }

  async goToFinancialCalculator() {
    await this.page.goto('/financial-calculators');
    await expect(async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await this.agreeCoockiesButton.isVisible({ timeout: 10000 });
      await this.agreeCoockiesButton.click();
      await this.page.waitForTimeout(2000);
      await expect(this.financialCalculatorsDesc).toBeVisible({ timeout: 5000 });
    }).toPass();
  }

  async clickBudgetCalculator() {
    await expect(async () => {
      await this.budgetCalculator.isVisible({ timeout: 5000 });
      await this.page.waitForTimeout(2000);
      await this.budgetCalculator.click();
    }).toPass();
  }

  private async prepareForSnapshot() {
    await this.page.context().addInitScript({
      content: `(function(){
      if (window.__NO_ANIM__) return; window.__NO_ANIM__ = true;
      const s=document.createElement('style'); s.setAttribute('data-e2e','no-anim');
      s.textContent = \`*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
      ::-webkit-scrollbar{display:none} html{scrollbar-width:none}\`;
      (document.documentElement||document.head||document.body).appendChild(s);
    })();`,
    });
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 2000 });
    } catch {}
  }

  async compareSnapshot() {
    this.prepareForSnapshot();
    const isChromium = /Chromium/i.test(this.projectName || '');
    await expect(this.page).toHaveScreenshot('financial-calculator.png', {
      maxDiffPixelRatio: isChromium ? 0.015 : 0.01,
      threshold: isChromium ? 0.3 : 0.2,
    });
  }
}
