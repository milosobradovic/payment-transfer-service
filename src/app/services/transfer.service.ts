import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { AccountsService } from './accounts.service';
import { Signal, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TransferResponse } from  '../models/transfer-response.model';
import { TransferRequest } from '../models/transfer-request.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
    private accountsSignal = signal<Account[]>([]);
    private transactionsSignal = signal<Transaction[]>([]);

    constructor(private http: AccountsService) {}

    loadAccounts(): void {
        this.http.getAccounts().subscribe((accounts: Account[]) => {
            this.accountsSignal.set([...accounts]);
        });
    }

    readonly totalBalance: Signal<number> = computed(() =>
        this.accountsSignal().reduce((acc, account) => acc + account.balance, 0)
    );

    readonly totalNumOfAccounts: Signal<number> = computed(() =>
        this.accountsSignal().length
    );

    get accounts(): Signal<Account[]> {
        return this.accountsSignal;
    }

    transferFunds(
        request: TransferRequest
    ): Observable<TransferResponse> {

        return this.http
        .transferFunds(request).pipe(
            tap(() => {
                this.loadTransactions();
                this.loadAccounts();
            })
        );
    }

    loadTransactions(): void {
        this.http.getTransactions().subscribe((transactions: Transaction[]) => {
            this.transactionsSignal.set([...transactions]);
        });
    }

    readonly totalNumOfTransactions: Signal<number> = computed(() =>
        this.transactionsSignal().length
    );

    readonly totalTransfer: Signal<number> = computed(() =>
        this.transactionsSignal().reduce((acc, transaction) => acc + transaction.amount, 0)
    );

    get transactions(): Signal<Transaction[]> {
        return this.transactionsSignal;
    }
}
