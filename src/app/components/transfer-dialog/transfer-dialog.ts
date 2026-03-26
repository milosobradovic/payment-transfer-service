import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TransferService } from '../../services/transfer.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './transfer-dialog.html',
  styleUrl: './transfer-dialog.css',
})
export class TransferDialogComponent {
  transferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransferDialogComponent>,
    private transferService: TransferService,
    @Inject(MAT_DIALOG_DATA) public data: { recipientId?: string }
  ) {
    this.transferForm = this.fb.group({
      remitter: [null as Account | null, Validators.required],
      recipient: [null as Account | null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.recipientId) {
      const account = this.accounts.find((account: Account) => account.id === this.data.recipientId);
      if (account) {
        this.transferForm.patchValue({ recipient: account });
      }
    }
  }

  get accounts(): Account[] {
    return this.transferService.accounts();
  }

  get remitter(): Account | null {
    return this.transferForm.get('remitter')?.value;
  }

  get recipient(): Account | null {
    return this.transferForm.get('recipient')?.value;
  }

  get sameAccountRule(): boolean {
    return !!(
      this.remitter &&
      this.recipient &&
      this.remitter.id === this.recipient.id
    );
  }

  get canSubmit(): boolean {
    return this.transferForm.valid && !this.sameAccountRule;
  }

  submit() {
    if (!this.canSubmit) {
      return;
    }

    const transferData = {
      remitterId: this.remitter?.id,
      remitterFullName: this.remitter ? `${this.remitter.firstName} ${this.remitter.lastName}` : '',
      recipientId: this.recipient?.id,
      recipientFullName: this.recipient ? `${this.recipient.firstName} ${this.recipient.lastName}` : '',
      amount: this.transferForm.get('amount')?.value,
      note: this.transferForm.get('note')?.value,
    };

    this.dialogRef.close(transferData);
  }

  close() {
    this.dialogRef.close();
  }
}
