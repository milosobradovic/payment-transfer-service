export interface TransferRequest {
  remitterId: string;
  recipientId: string;
  amount: number;
  note?: string;
}
