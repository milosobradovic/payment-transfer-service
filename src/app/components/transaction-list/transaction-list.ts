import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, } from '@angular/material/table';
import { TransferService } from '../../services/transfer.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { effect } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionListComponent implements OnInit {
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    displayedColumns: string[] = ['id', 'remitterFulllName', 'recipientFullName', 'amount', 'date', 'note'];

    dataSource = new MatTableDataSource<Transaction>([]);

    get transactions() {
        return this.transferService.transactions;
    }

    constructor(private transferService: TransferService) {
        effect(() => {
            this.dataSource.data = new MatTableDataSource<Transaction>(this.transactions()).data;
        });
    }

    ngOnInit(): void {
        this.transferService.loadTransactions();
    }
}
