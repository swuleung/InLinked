import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private userEmail = '';
  private userPassword = '';
  private errorMessage = '';

  constructor(
    private auth: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this.errorMessage = '';
    this.auth.login(email, password)
      .subscribe(
        (data) => {
          console.log(data);
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          this.errorMessage = 'Invalid email and/or password';
        }
      );
  }

  onSubmit(): void {
    this.login(this.userEmail, this.userPassword);
  }
}
