import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  private userName = ''; // Full name of the user
  private userEmail = '';
  private userPassword = '';
  private enterpriseCheck = false;
  private errorMessage = '';

  constructor(
    private user: UserService
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(): void {
    // Try to add the account to the database, error on fail
    const acctype = this.enterpriseCheck ? 'enterprise' : 'candidate';
    this.user.create(this.userName, this.userPassword, this.userEmail, acctype)
      .subscribe(
        (created) => {
          if (!created) {
            this.errorMessage = 'There is already an account with that email, try again.';
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      )
  }

}
