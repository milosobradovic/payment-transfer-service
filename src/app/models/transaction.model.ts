export interface Transaction {
  id: string;
  remitterId: string;
  remitterFulllName: string;
  recipientId: string;
  recipientFullName: string;
  amount: number;
  date: Date;
  note?: string;
}
