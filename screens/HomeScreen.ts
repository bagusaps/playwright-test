import { expect, Page } from "@playwright/test";

export class HomeScreen {
    readonly page: Page;
    readonly title;

    constructor(page: Page){
        this.page = page;
        this.title = page.getByText(/Kartu kredit yang kamu suka/);
        this.title = page.locator('.nav_links_text.is-nav', { hasText: 'Promo' })
    }

    async goto(){
        await this.page.goto('https://www.honest.co.id/');
    }

    async isTitleHomeScreenVisible(){
        await expect(this.title).toBeVisible();
    }
}
