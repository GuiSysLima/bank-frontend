export const AccountType = {
  CHECKING_ACCOUNT: 'CHECKING_ACCOUNT',
  SAVINGS_ACCOUNT: 'SAVINGS_ACCOUNT'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];