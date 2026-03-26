import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TransferService } from '../../services/transfer.service';
import { Account } from '../../models/account.model';
import { ACCOUNT_TYPE_CONFIG } from '../../models/account-type.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountListComponent implements OnInit {
  @Output() transferRequested = new EventEmitter<string>();

  ACCOUNT_TYPE_CONFIG = ACCOUNT_TYPE_CONFIG;

  get accounts() {
    return this.transferService.accounts;
  }

  constructor(private transferService: TransferService) {}

  ngOnInit(): void {
    this.transferService.loadAccounts();
  }

  onTransfer(account: Account) {
    this.transferRequested.emit(account.id);
  }
}
