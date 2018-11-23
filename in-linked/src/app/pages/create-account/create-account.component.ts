import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  private fullName = '';
  private userName = '';
  private userEmail = '';
  private userPassword = '';
  private enterpriseCheck = false;
  private errorMessage = '';
  private educationLevels = [
    'High School',
    'Bachelors',
    'Masters',
    'Doctorate',
    'Postdoc'
  ];
  private educationLevel = '';

  constructor(
    private user: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(): void {
    // Try to add the account to the database, error on fail
    const acctype = this.enterpriseCheck ? 'enterprise' : 'candidate';
    this.user.create(this.fullName, this.userName, this.userPassword, this.userEmail, this.educationLevel, acctype)
      .subscribe(
        (created) => {
          if (!created) {
            this.errorMessage = 'There is already an account with that email, try again.';
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      );
  }

}
