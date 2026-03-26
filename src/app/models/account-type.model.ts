type AccountType =
  | 'savings'
  | 'business'
  | 'student'
  | 'retirement'
  | 'trust'
  | 'prepaid';

interface AccountTypeConfig {
  icon: string;
  label: string;
}

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, AccountTypeConfig> = {
  savings: {
    icon: 'savings',
    label: 'Savings Account'
  },
  business: {
    icon: 'business',
    label: 'Business Account'
  },
  student: {
    icon: 'school',
    label: 'Student Account'
  },
  retirement: {
    icon: 'elderly',
    label: 'Retirement Account'
  },
  trust: {
    icon: 'security',
    label: 'Trust Account'
  },
  prepaid: {
    icon: 'account_balance_wallet',
    label: 'Prepaid Account'
  }
};
