export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  createdDate: Date;
  accountType: 'savings' | 'business' | 'student' | 'retirement' | 'trust' | 'prepaid';
}
