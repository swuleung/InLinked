import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthUser } from '../../models/auth-user';

import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Candidate } from '../../models/candidate';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  private authUser: AuthUser; // Get user identify from stored token
  private user: Candidate;

  private isCurrentUser: boolean; // Used to check if we should enable edit options

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user

    // Get account that we are loading
    this.route.params.pipe(
      switchMap(params => this.userService.getByUsername(params['username']).pipe(
        map(userResponse => ({ userResponse }))
      ))
    ).subscribe(({ userResponse }) => {
      this.user = userResponse;
      // Check if we are loading current user's profile
      console.log(this.user.candidateId, this.authUser.id);
      this.isCurrentUser = this.user.candidateId === this.authUser.id;
      console.log('isCurrentUser', this.isCurrentUser);
    });
  }

  test() {
    console.log(this.user);
  }

}
