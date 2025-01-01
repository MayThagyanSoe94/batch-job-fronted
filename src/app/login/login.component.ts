import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showLoginForm = true;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {

    this.authService.login(this.username, this.password).subscribe(
      (token) => {
        console.log('Token received:', token);
        this.authService.saveToken(token);
        this.router.navigate(['/transactions']);
        this.showLoginForm = false;
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  onLogin1(): void {
    this.router.navigate(['/transactions']);
  }
}
