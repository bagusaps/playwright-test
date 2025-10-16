import { expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class MemberDetailScreen {
  readonly page: Page;
  readonly projectName: string;
  readonly memberNameTitle;
  readonly kycBadge;
  readonly cashoutBadge;
  readonly accountStatusBadge;
  readonly memberNotFoundTitle;
  readonly memberNotReadyTitle;
  readonly invalidMemberDescription;

  constructor(page: Page, projectName = '') {
    this.page = page;
    this.projectName = projectName;
    this.memberNameTitle = page.locator('h1.text-2xl.font-bold.text-black');
    this.kycBadge = page
      .locator('div.flex.items-center.gap-2', { hasText: 'KYC:' })
      .locator('span[data-slot="badge"]');
    this.cashoutBadge = page
      .locator('div.flex.items-center.gap-2', { hasText: 'Cashout:' })
      .locator('span[data-slot="badge"]');
    this.accountStatusBadge = page
      .locator('div.flex.items-center.gap-2', { hasText: 'Account:' })
      .locator('span[data-slot="badge"]');
    this.memberNotFoundTitle = page.getByRole('heading', { level: 2, name: 'Member Not Found' });
    this.memberNotReadyTitle = page.getByRole('heading', { level: 2, name: 'Member Not Ready' });
    this.invalidMemberDescription = page.locator('p.text-muted-foreground.mb-6');
  }

  async goToMemberDetailPage(memberId: string) {
    await this.page.goto(`/members/${memberId}`);
  }

  async verifyMemberNameTitleVisible(name: string) {
    await expect(async () => {
      await expect(this.memberNameTitle).toBeVisible({ timeout: 5000 });
      await expect(this.memberNameTitle).toHaveText(name);
    }).toPass();
  }

  async verifyMemberKycBadge(kyc: string) {
    await expect(async () => {
      await expect(this.kycBadge).toBeVisible({ timeout: 5000 });
      await expect(this.kycBadge).toHaveText(kyc);
    }).toPass();
  }

  async verifyMemberCashoutBadge(cashout: string) {
    await expect(async () => {
      await expect(this.cashoutBadge).toBeVisible({ timeout: 5000 });
      await expect(this.cashoutBadge).toHaveText(cashout);
    }).toPass();
  }

  async verifyMemberAccountBadge(accountStatus: string) {
    await expect(async () => {
      await expect(this.accountStatusBadge).toBeVisible({ timeout: 5000 });
      await expect(this.accountStatusBadge).toHaveText(accountStatus);
    }).toPass();
  }

  async verifyMemberNotFound() {
    await expect(this.memberNotFoundTitle).toBeVisible();
    await expect(this.memberNotFoundTitle).toHaveText('Member Not Found');
    await expect(this.invalidMemberDescription).toBeVisible();
    await expect(this.invalidMemberDescription).toHaveText(
      "The member you're looking for doesn't exist or has been removed.",
    );
  }

  async verifyMemberNotReady() {
    await expect(this.memberNotReadyTitle).toBeVisible();
    await expect(this.memberNotReadyTitle).toHaveText('Member Not Ready');
    await expect(this.invalidMemberDescription).toBeVisible();
    await expect(this.invalidMemberDescription).toHaveText(
      'This member is pending review by account manager. Please wait.',
    );
  }

  async mockMemberNotReadyPage(htmlFilePath?: string) {
    const filePath = htmlFilePath || path.resolve(__dirname, '../../mocks/member-not-ready.html');
    const mockBody = fs.readFileSync(filePath, 'utf8');
    await this.page.route('**/members/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: mockBody,
      });
    });
  }
}
