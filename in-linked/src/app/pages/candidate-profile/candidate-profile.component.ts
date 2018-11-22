import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthUser } from '../../models/auth-user';

import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from '../../models/candidate';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  private authUser: AuthUser; // Get user identify from stored token
  isCurrentUser: boolean; // Used to check if we should enable edit options
  skills: string[];

  candidate: Candidate;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user
    this.loadUser();
  }

  loadUser(): void {
    const authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user
    console.log(authUser);
    this.route.params.subscribe(params => {
      this.isCurrentUser = authUser.username === params['username'];
      console.log(authUser.username, params['username']);
      this.initCandidate(this.isCurrentUser, params['username']);
    });
  }

  initCandidate(isCurrentUser: boolean, username: string): void {
    if (isCurrentUser) {
      this.candidate = this.userService.getCorrespondingUserData() as Candidate;

      // Check if it was loaded before
      if (!this.candidate) {
        this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((res: Candidate) => {
          this.candidate = res;
          this.skills = res.skills.split(',');
        });
      }
    } else {
      console.log('other account');
      this.userService.getByUsername(username).subscribe((res: Candidate) => {
        this.candidate = res;
        this.skills = res.skills.split(',');
      });
    }
  }

}
