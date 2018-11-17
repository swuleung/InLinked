import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

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

  constructor(private user: UserService) { }

  ngOnInit() {
  }

  onSubmit(): void {
    // Try to add the account to the database, error on fail
    const acctype = this.enterpriseCheck ? 'enterprise' : 'candidate';
    const result = this.user.create(this.userName, this.userPassword, this.userEmail, acctype);
  }

}
