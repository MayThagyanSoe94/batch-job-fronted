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
      (response) => {
        if (response && typeof response === 'string') {
          this.authService.saveToken(response);
          this.router.navigate(['/transactions']);
        } else {
          this.errorMessage = 'Unexpected error occurred. Please try again.';
        }
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      }
    );
  }
}
