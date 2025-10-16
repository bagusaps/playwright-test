import { expect, Page } from '@playwright/test';

export class FindCommunityMembersScreen {
  readonly page: Page;
  readonly projectName: string;
  readonly title;
  readonly memberFilter;
  readonly accountStatusFilter;
  readonly activeStatus;
  readonly pendingStatus;
  readonly closedStatus;
  readonly datePicker;
  readonly dateCalendar;
  readonly goToPrevMonthButton;
  readonly goToNextMonthButton;
  readonly monthYearLabel;
  readonly memberListResult;
  readonly tableRows;
  readonly cardItems;
  readonly mobileContainer;
  readonly desktopContainer;
  readonly COLUMN_NAME = 0;
  readonly COLUMN_EMAIL = 1;
  readonly COLUMN_PHONE = 2;
  readonly COLUMN_ACCOUNT_STATUS = 3;
  readonly COLUMN_USER_ID = 4;
  readonly COLUMN_SIGNUP_DATE = 5;
  readonly memberCountText;

  constructor(page: Page, projectName = '') {
    this.page = page;
    this.projectName = projectName;
    this.title = page.getByText(/Find community members/);
    this.memberFilter = page.getByTestId('member-search');
    this.datePicker = page.getByTestId('date-range-picker');
    this.dateCalendar = page.getByTestId('date-calendar');
    this.goToPrevMonthButton = page.locator('button[aria-label="Go to the Previous Month"]');
    this.goToNextMonthButton = page.locator('button[aria-label="Go to the Next Month"]');
    this.monthYearLabel = 'table[aria-label]';
    this.memberListResult = this.page.locator('[data-testid^="member-row-"]');
    this.tableRows = this.memberListResult.filter({ has: this.page.locator('td') });
    this.cardItems = this.memberListResult.filter({ has: this.page.locator('h3') });
    this.mobileContainer = this.page.getByTestId('members-table-mobile');
    this.desktopContainer = this.page.getByTestId('members-table-desktop');
    this.memberCountText = page.getByText(/\d+\s+members?\s+found/i).first();
    this.accountStatusFilter = page.getByRole('combobox');
    this.activeStatus = page.getByRole('option', { name: 'Active' });
    this.pendingStatus = page.getByRole('option', { name: 'Pending' });
    this.closedStatus = page.getByRole('option', { name: 'Closed' });
  }

  private get isMobile() {
    return /safari|iphone|mobile/i.test(this.projectName || '');
  }

  async goto() {
    await this.page.goto('/');
  }

  async isfindCommunityMembersScreenTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  async filterMemberByName(name: string) {
    await this.memberFilter.fill(name);
  }

  async filterMemberByUserId(userId: string) {
    await this.memberFilter.fill(userId);
  }

  async filterMemberByEmail(email: string) {
    await this.memberFilter.fill(email);
  }

  async clickDatePicker() {
    await this.datePicker.click();
  }

  async isDateCalendarVisible() {
    await expect(this.dateCalendar).toBeVisible();
  }

  async filterByActiveStatus() {
    await this.accountStatusFilter.click();
    await this.activeStatus.click();
  }

  async filterByPendingStatus() {
    await this.accountStatusFilter.click();
    await this.pendingStatus.click();
  }

  async filterByClosedStatus() {
    await this.accountStatusFilter.click();
    await this.closedStatus.click();
  }

  private memberListInCurrentLayout() {
    if (this.isMobile) {
      return this.mobileContainer.locator('[data-testid^="member-row-"]:visible');
    }
    return this.desktopContainer.locator('[data-testid^="member-row-"]:visible');
  }

  async verifyFilterResultVisible() {
    await expect(async () => {
      if (this.isMobile) {
        await this.mobileContainer.waitFor({ state: 'visible', timeout: 10_000 });
      } else {
        await this.desktopContainer.waitFor({ state: 'visible', timeout: 10_000 });
      }
      const rows = this.memberListInCurrentLayout();
      await rows.first().waitFor({ state: 'visible', timeout: 10_000 });
      const count = await rows.count();
      expect(count, `Expected at least 1 result, but found ${count}`).toBeGreaterThan(0);
    }).toPass();
  }

  async verifyMemberCountMatchesTable() {
    const rows = this.memberListInCurrentLayout();
    await rows.first().waitFor({ state: 'visible', timeout: 10_000 });
    await expect(async () => {
      const actual = await rows.count();
      const text = await this.memberCountText.textContent({ timeout: 5000 });
      const expected = parseInt(text!.match(/\d+/)![0], 10);
      expect(actual, `Expected ${expected} rows, but found ${actual}`).toBe(expected);
    }).toPass();
  }

  async verifyMemberNameInList(name: string) {
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const item = rows.nth(i);
      const text = isMobile
        ? (await item.locator('h3').innerText()).trim()
        : (await item.locator('td').nth(this.COLUMN_NAME).innerText()).trim();

      expect(
        text.toLowerCase().includes(name.toLowerCase()),
        `Row/Card ${i + 1} name "${text}" does not include filter "${name}"`,
      ).toBeTruthy();
    }
  }

  async verifyMemberUserIdInList(userId: string) {
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const item = rows.nth(i);
      const text = isMobile
        ? (
            await item
              .locator('div', { hasText: /^User ID:/ })
              .locator('span.font-mono')
              .innerText()
          ).trim()
        : (await item.locator('td').nth(this.COLUMN_USER_ID).innerText()).trim();

      expect(
        text.toLowerCase().includes(userId.toLowerCase()),
        `Row/Card ${i + 1} name "${text}" does not include filter "${userId}"`,
      ).toBeTruthy();
    }
  }

  async verifyMemberEmailInList(email: string) {
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const item = rows.nth(i);
      const text = isMobile
        ? (await item.locator('p').filter({ hasText: '@' }).first().innerText()).trim()
        : (await item.locator('td').nth(this.COLUMN_EMAIL).innerText()).trim();

      expect(
        text.toLowerCase().includes(email.toLowerCase()),
        `Row/Card ${i + 1} name "${text}" does not include filter "${email}"`,
      ).toBeTruthy();
    }
  }

  async verifyMemberStatusInList(status: string) {
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const item = rows.nth(i);
      const loc = isMobile
        ? item.locator('span[data-testid^="status-badge-"]')
        : item
            .locator('td')
            .nth(this.COLUMN_ACCOUNT_STATUS)
            .locator('span[data-testid^="status-badge-"]');
      if (isMobile) await loc.scrollIntoViewIfNeeded().catch(() => {});
      const text = ((await loc.textContent()) || '').trim().toLowerCase();
      expect(
        text.toLowerCase().includes(status.toLowerCase()),
        `Row/Card ${i + 1} name "${text}" does not include filter "${status}"`,
      ).toBeTruthy();
    }
  }

  private parseMonthYear(label: string): Date {
    return new Date(`${label} 1`);
  }

  private async goToMonthYear(monthYear: string) {
    const targetMonthYear = this.parseMonthYear(monthYear);
    const currentMonth = this.page.locator(this.monthYearLabel).first();
    for (let i = 0; i < 36; i++) {
      const currentMonthLabel = await currentMonth.getAttribute('aria-label');
      if (!currentMonthLabel) throw new Error('current month label not found');
      const currentMonthYear = this.parseMonthYear(currentMonthLabel);
      if (currentMonthYear.getTime() === targetMonthYear.getTime()) return;
      const goNext = currentMonthYear < targetMonthYear;
      if (goNext) {
        await expect(this.goToNextMonthButton).toBeVisible();
        await expect(this.goToNextMonthButton).toBeEnabled();
        await this.goToNextMonthButton.click();
      } else {
        await expect(this.goToPrevMonthButton).toBeVisible();
        await expect(this.goToPrevMonthButton).toBeEnabled();
        await this.goToPrevMonthButton.click();
      }
      await expect(currentMonth).not.toHaveAttribute('aria-label', currentMonthLabel, {
        timeout: 4000,
      });
    }
    throw new Error(`Uncovered month-year`);
  }

  async clickButtonByDate(day: number, monthYear: string) {
    await this.goToMonthYear(monthYear);
    const year = this.parseMonthYear(monthYear).getFullYear();
    const month = String(this.parseMonthYear(monthYear).getMonth() + 1).padStart(2, '0');
    const formatedDay = String(day).padStart(2, '0');
    const target = `${year}-${month}-${formatedDay}`;
    const dateButton = this.page.locator(
      `td[role="gridcell"][data-day="${target}"]:not([data-outside="true"]) button`,
    );
    await dateButton.waitFor({ state: 'visible', timeout: 5000 });
    await dateButton.click();
  }

  private getLastDayOfMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  async selectMonthYearRange(startMonthYear: string, endMonthYear: string) {
    if (this.isMobile) {
      await this.page.evaluate(() => window.scrollBy(0, 300));
    }
    await this.datePicker.click();
    await this.isDateCalendarVisible();
    await this.clickButtonByDate(1, startMonthYear);
    const end = this.parseMonthYear(endMonthYear);
    const lastDay = this.getLastDayOfMonth(end.getFullYear(), end.getMonth() + 1);
    await this.clickButtonByDate(lastDay, endMonthYear);
    await this.page.keyboard.press('Escape');
  }

  async verifyMemberSignUpDateInList(startMonthYear: string, endMonthYear: string) {
    const start = this.parseMonthYear(startMonthYear);
    const endBase = this.parseMonthYear(endMonthYear);
    const end = new Date(
      endBase.getFullYear(),
      endBase.getMonth(),
      this.getLastDayOfMonth(endBase.getFullYear(), endBase.getMonth() + 1),
    );
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const item = rows.nth(i);
      const loc = isMobile
        ? item
            .locator('div', { hasText: /^Sign Up:/ })
            .locator('span')
            .nth(1)
        : item.locator('td').nth(this.COLUMN_SIGNUP_DATE);
      if (isMobile) await loc.scrollIntoViewIfNeeded().catch(() => {});
      const text = ((await loc.textContent()) || '').replace(/\s+/g, ' ').trim();
      const d = new Date(text);
      expect(
        d.getTime(),
        `Row ${i + 1} signup date "${text}" is outside of range ${start.toDateString()} – ${end.toDateString()}`,
      ).toBeGreaterThanOrEqual(start.getTime());
      expect(
        d.getTime(),
        `Row ${i + 1} signup date "${text}" is outside of range ${start.toDateString()} – ${end.toDateString()}`,
      ).toBeLessThanOrEqual(end.getTime());
    }
  }

  async clickMemberDetailByName(memberName: string) {
    const rows = this.memberListInCurrentLayout();
    const isMobile = this.isMobile;
    const member = rows.filter({ hasText: memberName }).first();
    if (isMobile) await member.scrollIntoViewIfNeeded().catch(() => {});
    await expect(member, `Member "${memberName}" not found`).toBeVisible({ timeout: 5000 });
    await member.click();
  }
}
