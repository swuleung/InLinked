import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
    private router: Router,
    private user: UserService) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this.errorMessage = '';
    this.auth.login(email, password)
      .subscribe(
        (data) => {
          this.user.get(data)
            .subscribe(
              (retrieved) => {
                // Check if there is an error
                if (!retrieved) {
                  this.errorMessage = 'Error: please login again.'; // This should not happen
                } else {
                  this.router.navigate(['/dashboard']); // Reroute to dashboard
                }
              }
            );
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
