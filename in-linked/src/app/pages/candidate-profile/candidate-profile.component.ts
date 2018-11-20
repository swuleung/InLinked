import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthUser } from '../../models/auth-user';
import { User } from '../../models/user';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  private authUser: AuthUser; // Get user identify from stored token
  private user: User;

  private isCurrentUser: boolean;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key));

    // Load the corresponding user data
    
  }

}
