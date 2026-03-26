import { Component, inject ,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog';
import { AccountListComponent } from '../account-list/account-list';
import { TransactionListComponent } from '../transaction-list/transaction-list';
import { TransferService } from '../../services/transfer.service';
import { catchError, switchMap, filter, tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { TransferRequest } from '../../models/transfer-request.model';
import { TransferResponse } from '../../models/transfer-response.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, AccountListComponent, TransactionListComponent,MatSnackBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private snackBar = inject(MatSnackBar);

  private readonly MESSAGE_HEADER_PROCESSING = 'Processing Transfer...';
  private readonly MESSAGE_HEADER_SUCCESS = 'Success: ';
  private readonly MESSAGE_HEADER_ERROR = 'Error: ';

  private readonly SNACKBAR_CONFIG: MatSnackBarConfig = {
    duration: 2200,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  constructor(private dialog: MatDialog, public transferService: TransferService) {}

  openTransferDialog(recipientId?: string): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      data: { recipientId },
      width: '600px',
    });
  
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(
        () => this.snackBar.open(this.MESSAGE_HEADER_PROCESSING, '',
        { ... this.SNACKBAR_CONFIG, duration: undefined, panelClass: ['snackbar-info']})
      ),
      switchMap(
        (result: TransferRequest) => this.transferService.transferFunds({
          remitterId: result.remitterId,
          recipientId: result.recipientId,
          amount: result.amount,
          note: result?.note
        })
      ),
      catchError((error) => {
        this.snackBar.open(this.MESSAGE_HEADER_ERROR + error.message, '', {  ... this.SNACKBAR_CONFIG, panelClass: ['snackbar-error'] });
        throw error;
      })
    ).subscribe((result: TransferResponse) => {
      this.snackBar.open(this.MESSAGE_HEADER_SUCCESS + result.status, '', { ... this.SNACKBAR_CONFIG, panelClass: ['snackbar-success'] });
    });
  }

  onTransferRequested(recipientId: string) {
    this.openTransferDialog(recipientId);
  }
}
