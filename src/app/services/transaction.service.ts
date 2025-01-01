import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from './transaction';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseURL = "http://localhost:9090/api/transactions";

  constructor(private httpClient: HttpClient) { }

  getFilteredTransactions(customerId: string, accountNumber: string, description: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (customerId.trim()) {
      params = params.set('customerId', customerId);
    }

    if (accountNumber.trim()) {
      params = params.set('accountNumber', accountNumber);
    }

    if (description.trim()) {
      params = params.set('description', description);
    }

    return this.httpClient.get<any>(this.baseURL, { params, headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTransactionList(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>(`${this.baseURL}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTransactionDescription(id: number, newDescription: string): Observable<Transaction> {
    return this.httpClient.put<Transaction>(`${this.baseURL}/${id}`, { newDescription: newDescription }, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Optionally, handle the missing token case
      console.error('Auth token is missing.');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
