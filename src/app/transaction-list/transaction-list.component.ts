import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../services/transaction';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  selectedFile: File | null = null;

  customerId: string = '';
  accountNumber: string = '';
  description: string = '';
  currentPage: number = 0;
  totalItems: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;

  constructor(private transactionService: TransactionService, private authService: AuthService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadTransactions()
  }

  loadTransactions(): void {
    this.transactionService.getFilteredTransactions(
      this.customerId,
      this.accountNumber,
      this.description,
      this.currentPage,
      this.pageSize)
      .subscribe(response => {
        this.transactions = response.transactions;
        this.currentPage = response.currentPage;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadTransactions();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.httpClient.post('http://localhost:9090/api/job/import', formData).subscribe(
      response => {
        console.log('File uploaded successfully');
        this.loadTransactions();
        this.selectedFile = null;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error => {
        console.error('File upload failed', error);
      }
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  update(transaction: Transaction, newDescription: string): void {
    this.transactionService.updateTransactionDescription(transaction.id, newDescription)
      .subscribe(updatedTransaction => {
        // Update the local transaction with the new data
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
      });
  }
  onLogout(): void {
    this.authService.logout(); // Call logout from AuthService
    // Redirect or do any additional cleanup here
    this.authService.redirectToLogin(); // Redirect to login page
  }
}
