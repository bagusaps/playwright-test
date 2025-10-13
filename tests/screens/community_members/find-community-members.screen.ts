import { expect, Page } from "@playwright/test";

export class FindCommunityMembersScreen {
    readonly page: Page;
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
    readonly tableRows;
    readonly COLUMN_NAME = 0;
    readonly COLUMN_EMAIL = 1;
    readonly COLUMN_PHONE = 2;
    readonly COLUMN_ACCOUNT_STATUS = 3;
    readonly COLUMN_USER_ID = 4;
    readonly COLUMN_SIGNUP_DATE = 5;
    readonly memberCountText;

    constructor(page: Page){
        this.page = page;
        this.title = page.getByText(/Find community members/);
        this.memberFilter = page.getByTestId('member-search');
        this.datePicker = page.getByTestId('date-range-picker');
        this.dateCalendar = page.getByTestId('date-calendar');
        this.goToPrevMonthButton = page.locator('button[aria-label="Go to the Previous Month"]');
        this.goToNextMonthButton = page.locator('button[aria-label="Go to the Next Month"]');
        this.monthYearLabel = 'table[aria-label]'
        this.tableRows = page.locator('tr[data-testid^="member-row-"]');
        this.memberCountText = page.getByText(/\d+\s+members?\s+found/i).first();
        this.accountStatusFilter = page.getByRole('combobox');
        this.activeStatus = page.getByRole('option', {name: 'Active'});
        this.pendingStatus = page.getByRole('option', {name: 'Pending'});
        this.closedStatus = page.getByRole('option', {name: 'Closed'});
    }

    async goto(){
        await this.page.goto('https://v0-cmlookup2.vercel.app/');
    }

    async isfindCommunityMembersScreenTitleVisible(){
        await expect(this.title).toBeVisible();
    }

    async filterMemberByName(name: string){
        await this.memberFilter.fill(name);
    }

    async filterMemberByUserId(userId: string){
        await this.memberFilter.fill(userId);
    }

    async filterMemberByEmail(email: string){
        await this.memberFilter.fill(email);
    }

    async clickDatePicker(){
        await this.datePicker.click();
    }

    async isDateCalendarVisible(){
        await expect(this.dateCalendar).toBeVisible();
    }

    async filterByActiveStatus(){
        await this.accountStatusFilter.click();
        await this.activeStatus.click();
    }

    async filterByPendingStatus(){
        await this.accountStatusFilter.click();
        await this.pendingStatus.click();
    }

    async filterByClosedStatus(){
        await this.accountStatusFilter.click();
        await this.closedStatus.click();
    }

    async verifyFilterResultVisible() {
        await this.tableRows.first().waitFor({ state: 'visible', timeout: 7000 });
        const rowCount = await this.tableRows.count();
        expect(rowCount,`Expected at least 1 row after filtering, but found ${rowCount}`).toBeGreaterThan(0);
    }

    async verifyMemberCountMatchesTable() {
        const actual = await this.tableRows.count();
        const text = await this.memberCountText.textContent();
        const expected = parseInt(text!.match(/\d+/)![0], 10);
        expect(actual, `Expected ${expected} rows, but found ${actual}`).toBe(expected);
    }

    async verifyListMemberNameTable(name: string){
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const nameCell = row.locator('td').nth(this.COLUMN_NAME);
            const text = (await nameCell.innerText()).trim().toLowerCase();
            expect(text.includes(name.toLowerCase()),
                `Row ${i + 1} name "${text}" does not include filter "${name}"`
            ).toBeTruthy();
        }
    }

    async verifyListMemberUserIdTable(userId: string){
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const userIdCell = row.locator('td').nth(this.COLUMN_USER_ID);
            const text = (await userIdCell.innerText()).trim().toLowerCase();
            expect(text.includes(userId.toLowerCase()),
                `Row ${i + 1} user ID "${text}" does not include filter "${userId}"`
            ).toBeTruthy();
        }   
    }

    async verifyListMemberEmailTable(email: string){
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const emailCell = row.locator('td').nth(this.COLUMN_EMAIL);
            const text = (await emailCell.innerText()).trim().toLowerCase();
            expect(text.includes(email.toLowerCase()),
                `Row ${i + 1} email "${text}" does not include filter "${email}"`
            ).toBeTruthy();
        }
    }

    async verifyListMemberAccountStatusTable(status: string){
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const statusCell = row.locator('td').nth(this.COLUMN_ACCOUNT_STATUS);
            const text = (await statusCell.innerText()).trim().toLowerCase();
            expect(text === status.toLowerCase(),
                `Row ${i + 1} account status "${text}" does not match filter "${status}"`
            ).toBeTruthy();
        }
    }

    private parseMonthYear(label: string): Date {
        return new Date(`${label} 1`);
    }

    private async getVisibleMonths(): Promise<Date[]> {
        const tables = this.page.locator(this.monthYearLabel);
        const n = await tables.count();
        const dates: Date[] = [];
        for (let i = 0; i < n; i++) {
            const label = await tables.nth(i).getAttribute('aria-label');
            if (label) dates.push(this.parseMonthYear(label));
        }
        return dates;
    }

    private async goToMonthYear(monthYear: string) {
        const targetMonthYear = this.parseMonthYear(monthYear);
        const monthTables = this.page.locator(this.monthYearLabel);
        const leftMonth = monthTables.first();
        for (let i = 0; i < 36; i++) {
            const visibleMonths = await this.getVisibleMonths();
            if (visibleMonths.some(d => d.getTime() === targetMonthYear.getTime())) return;
            let goNext: boolean | null = null;
            if (visibleMonths.length >= 2) {
                const left  = visibleMonths[0];
                const right = visibleMonths[1];
                if (targetMonthYear < left)  goNext = false;
                if (targetMonthYear > right) goNext = true;
                if (goNext === null) return;
            } else {
                goNext = visibleMonths.length === 1 ? visibleMonths[0] < targetMonthYear : true;
            }
            const before = await leftMonth.getAttribute('aria-label');
            if (goNext) {
                await expect(this.goToNextMonthButton).toBeVisible();
                await expect(this.goToNextMonthButton).toBeEnabled();
                await this.goToNextMonthButton.click();
            } else {
                await expect(this.goToPrevMonthButton).toBeVisible();
                await expect(this.goToPrevMonthButton).toBeEnabled();
                await this.goToPrevMonthButton.click();
            }
            await expect(leftMonth).not.toHaveAttribute('aria-label', before ?? '', { timeout: 4000 });
        }
        throw new Error(`Uncovered month-year`);
    }

    async clickButtonByDate(day: number, monthYear: string) {
        await this.goToMonthYear(monthYear);
        const year = this.parseMonthYear(monthYear).getFullYear();
        const month = String(this.parseMonthYear(monthYear).getMonth() + 1).padStart(2, '0');
        const formatedDay = String(day).padStart(2, '0');
        const target = `${year}-${month}-${formatedDay}`;
        const dateButton = this.page.locator(`td[role="gridcell"][data-day="${target}"]:not([data-outside="true"]) button`)
        await dateButton.waitFor({ state: 'visible', timeout: 5000 });
        await dateButton.click();
    }

    private getLastDayOfMonth(year: number, month: number) {
        return new Date(year, month, 0).getDate();
    }

    async selectMonthYearRange(startMonthYear: string, endMonthYear: string) {
        await this.datePicker.click();
        await this.isDateCalendarVisible();
        await this.clickButtonByDate(1, startMonthYear);
        const end = this.parseMonthYear(endMonthYear);
        const lastDay = this.getLastDayOfMonth(end.getFullYear(), end.getMonth() + 1);
        await this.clickButtonByDate(lastDay, endMonthYear);
        await this.page.keyboard.press('Escape');
    }

    async verifyListSignupDateTable(startMonthYear: string, endMonthYear: string) {
        const start = this.parseMonthYear(startMonthYear);
        const endBase = this.parseMonthYear(endMonthYear);
        const end = new Date(
            endBase.getFullYear(),
            endBase.getMonth(),
            this.getLastDayOfMonth(endBase.getFullYear(), endBase.getMonth() + 1));
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.tableRows.nth(i);
            const dateCell = row.locator('td').nth(this.COLUMN_SIGNUP_DATE);
            const text = (await dateCell.innerText()).trim();
            const d = new Date(text);
            expect(d.getTime(),
                `Row ${i + 1} signup date "${text}" is outside of range ${start.toDateString()} – ${end.toDateString()}`
            ).toBeGreaterThanOrEqual(start.getTime());
            expect(d.getTime(),
                `Row ${i + 1} signup date "${text}" is outside of range ${start.toDateString()} – ${end.toDateString()}`
            ).toBeLessThanOrEqual(end.getTime());
        }
    }

    async clickMemberDetailByName(memberName: string) {
        const member = this.tableRows.filter({ hasText: memberName }).first();
        await member.click();
    }
}
