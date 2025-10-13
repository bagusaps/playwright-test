import { test } from '@playwright/test';
import { FindCommunityMembersScreen } from '../screens/community_members/find-community-members.screen';
import { MemberDetailScreen } from '../screens/community_members/member-detail.screen';

test('User filter by exist name', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterMemberByName('Jennifer Brown');
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberNameTable('Jennifer Brown');
});

test('User filter by exist user ID', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterMemberByUserId('410987654');
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberUserIdTable('410987654');
});

test('User filter by exist email', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterMemberByEmail('emily.davis@example.com');
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberEmailTable('emily.davis@example.com');
});

test('User filter by signup date', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.selectMonthYearRange('Dec 2024', 'Jan 2025');
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListSignupDateTable('Dec 2024', 'Jan 2025');
});

test('User filter by active account status', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterByActiveStatus();
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberAccountStatusTable('Active');
});

test('User filter by pending account status', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterByPendingStatus();
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberAccountStatusTable('Pending');
});

test('User filter by closed account status', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterByClosedStatus();
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.verifyListMemberAccountStatusTable('Closed');
});

test('User navigate to valid member datail page', async ({ page }) => {
  const findCommunityMembersScreen = new FindCommunityMembersScreen(page);
  const memberDetail = new MemberDetailScreen(page);
  await findCommunityMembersScreen.goto();
  await findCommunityMembersScreen.isfindCommunityMembersScreenTitleVisible();
  await findCommunityMembersScreen.filterMemberByName('Jennifer Brown');
  await findCommunityMembersScreen.verifyFilterResultVisible();
  await findCommunityMembersScreen.verifyMemberCountMatchesTable();
  await findCommunityMembersScreen.clickMemberDetailByName('Jennifer Brown');
  await memberDetail.verifyMemberNameTitleVisible('Jennifer Brown');
  await memberDetail.verifyMemberKycBadge('KYC Verified');
  await memberDetail.verifyMemberCashoutBadge('Completed');
  await memberDetail.verifyMemberAccountBadge('Active');
});

test('User navigate to member not found page', async ({ page }) => {
  const memberDetail = new MemberDetailScreen(page);
  await memberDetail.goToMemberDetailPage('123456789');
  await memberDetail.verifyMemberNotFound();
});

test('User navigate to member not ready page', async ({ page }) => {
  const memberDetail = new MemberDetailScreen(page);
  await memberDetail.mockMemberNotReadyPage();
  await memberDetail.goToMemberDetailPage('987654321');
  await memberDetail.verifyMemberNotReady();
});