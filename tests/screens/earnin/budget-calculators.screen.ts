import { expect, Page } from "@playwright/test";
import { verifyAnalyticsEventProperties } from "../../utils/segment";
import { clear } from "console";

export class BudgetCalculatorScreen{
    readonly page: Page;
    readonly agreeCoockiesButton;
    readonly budgetCalculatorDesc;
    readonly incomeInput;
    readonly zipCodeInput;
    readonly calculateButton;
    
    constructor(page: Page){
        this.page = page;
        this.agreeCoockiesButton = page.getByRole('button', { name: /i agree/i });
        this.budgetCalculatorDesc = page.getByText(/get insights into your spending habits/i)
        this.incomeInput = page.getByTestId('income');
        this.zipCodeInput = page.getByTestId('zipcode');
        this.calculateButton = page.getByTestId('calculate-button');
    }

    async verifyBudgetCalculatorScreenVisible(){
        await expect(async () => {
            await this.page.waitForLoadState('domcontentloaded');
            await this.agreeCoockiesButton.isVisible({ timeout: 10000 });
            await this.agreeCoockiesButton.click();
            await expect(this.budgetCalculatorDesc).toBeVisible({ timeout: 5000 });
        }).toPass();
    }

    async calculateBudget(income: string, zipCode: string){
        await this.incomeInput.fill(income);
        await this.zipCodeInput.fill(zipCode);
        await this.calculateButton.click();
    }

    async inputIncomeBudgetCalculators(income: string){
        await this.incomeInput.fill(income);
    }

    async inputZipCodeBudgetCalculators(zipCode: string){
        await this.zipCodeInput.fill(zipCode);
    }

    async clickCalculateBudgetCalculator(){
        await this.calculateButton.click();
    }

    async verifyEventViewedBudgetCalculators(){
        await verifyAnalyticsEventProperties(this.page, 'User viewed screen', {screenName: 'Budget Calculator',});
    }

    async verifyEventInputIncomeBudgetCalculators(){
        await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {elementName: 'Income', component: 'Input Field'});
    }

    async verifyEventInputZipCodeBudgetCalculators(){
        await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {elementName: 'Zip Code', component: 'Input Field'});
    }

    async verifyEventCalculateButtonBudgetCalculators(){
        await verifyAnalyticsEventProperties(this.page, 'User interacted with element', {elementName: 'Calculate', component: 'CTA'});
    }

}