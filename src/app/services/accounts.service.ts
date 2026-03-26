import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';
import { nanoid } from 'nanoid';
import { TransferResponse } from  '../models/transfer-response.model';
import { TransferRequest } from '../models/transfer-request.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private readonly RESPONSE_DELAY_SHORT = 600;
  private readonly RESPONSE_DELAY_LONG = 1800;
  private readonly MAX_TRANSFER_AMOUNT = 10000;

  private accounts: Account[] = [
    { id: '1', firstName: 'Jonathan', lastName: 'Doe', balance: 3400, accountType: 'prepaid', createdDate: new Date('2023-01-15') },
    { id: '2', firstName: 'Jane', lastName: 'Smith', balance: 5500, accountType: 'business', createdDate: new Date('2023-01-16') },
    { id: '3', firstName: 'Alice', lastName: 'Brown', balance: 7000, accountType: 'student', createdDate: new Date('2023-01-17') },
    { id: '4', firstName: 'Bob', lastName: 'Johnson', balance: 2800, accountType: 'retirement', createdDate: new Date('2023-01-18') },
    { id: '5', firstName: 'Charlie', lastName: 'Walker', balance: 1500, accountType: 'trust', createdDate: new Date('2023-01-19') },
    { id: '6', firstName: 'Diana', lastName: 'King', balance: 2200, accountType: 'prepaid', createdDate: new Date('2023-01-20') },
    { id: '7', firstName: 'Ethan', lastName: 'Parker', balance: 600, accountType: 'savings', createdDate: new Date('2023-01-21') },
    { id: '8', firstName: 'Fiona', lastName: 'Lopez', balance: 3200, accountType: 'business', createdDate: new Date('2023-01-22') },
  ];

  private transactions: Transaction[] = [];

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions).pipe(delay(this.RESPONSE_DELAY_SHORT));
  }

  constructor() {}

  getAccount = (id: string) => this.accounts.find((account: Account) => account.id === id);

  getAccounts(): Observable<Account[]> {
    return of(this.accounts).pipe(
      delay(this.RESPONSE_DELAY_SHORT),
    );
  }

  transferFunds(request: TransferRequest): Observable<TransferResponse> {

    const error = this.validateTransfer(request);

    if (error) {
      return of(null).pipe(
        delay(this.RESPONSE_DELAY_LONG),
        switchMap(() => throwError(() => new Error(error)))
      );
    }

    const { remitterId, recipientId, amount, note } = request;

    // Perform transfer
    const remitter = this.getAccount(remitterId)!;
    const recipient = this.getAccount(recipientId)!;

    remitter.balance -= amount;
    recipient.balance += amount;

    // Record transaction
    this.transactions.push({
      id: nanoid(),
      remitterId,
      remitterFulllName: `${remitter.firstName} ${remitter.lastName}`,
      recipientId,
      recipientFullName: `${recipient.firstName} ${recipient.lastName}`,
      amount,
      date: new Date(),
      note: note || ''
    });

    return of({ status: 'Transaction has been completed successfully' }).pipe(
        delay(this.RESPONSE_DELAY_SHORT)
    );
  }

  validateTransfer(request: TransferRequest): string | null {
    const { remitterId, recipientId, amount } = request;

    if (!remitterId) return 'Remitter must be provided';
    if (!recipientId) return 'Recipient must be provided';
    if (remitterId === recipientId) return 'Remitter and recipient cannot be identical';

    const remitter = this.getAccount(remitterId);
    if (!remitter) return 'Remitter account not found';

    const recipient = this.getAccount(recipientId);
    if (!recipient) return 'Recipient account not found';

    if (amount <= 0) return 'Transfer amount must be greater than zero';
    if (amount > this.MAX_TRANSFER_AMOUNT)
      return `Transfer amount cannot exceed $${this.MAX_TRANSFER_AMOUNT}`;

    if (remitter.balance < amount)
      return `Insufficient funds. Available balance: $${Math.round(remitter.balance)}`;

    return null;
  }
}
