import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:9090/authenticate'; // Backend login URL
  private authTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<string> {
    const payload = { username, password };
    return this.http.post(this.loginUrl, payload, { responseType: 'text' });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authTokenSubject.next(null);
  }

  redirectToLogin(): void {
    window.location.href = '/login';
  }

}
