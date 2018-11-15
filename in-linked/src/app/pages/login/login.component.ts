import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private userEmail = '';
  private userPassword = '';

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this.auth.login(email, password)
      .subscribe(
        () => {
          console.log('Hello');
          console.log(localStorage);
        },
        (err) => {
          console.log('error thrown in login');
        }
      )
  }

  onSubmit(): void {
    this.login(this.userEmail, this.userPassword);
  }
}
