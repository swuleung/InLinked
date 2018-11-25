import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthUser } from '../../models/auth-user';

import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Candidate } from '../../models/candidate';
import { ExperienceService } from '../../services/experience/experience.service';
import { EducationService } from '../../services/education/education.service';
import { Experience } from '../../models/experience';
import { Education } from '../../models/education';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  private authUser: AuthUser; // Get user identify from stored token
  isCurrentUser: boolean; // Used to check if we should enable edit options
  skills: string[];
  experienceList: Experience[];
  educationList: Education[];

  candidate: Candidate;

  constructor(private route: ActivatedRoute, private userService: UserService, private experienceService: ExperienceService, private educationService: EducationService) { }

  ngOnInit() {
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user
    this.loadUser();
  }

  onTitleModalUpdate(update: boolean) {
    if (update) {
      this.loadUser();
    }
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
          this.initExperience(this.candidate.candidateId);
          this.initEducation(this.candidate.candidateId);
        });
      }
    } else {
      console.log('other account');
      this.userService.getByUsername(username).subscribe((res: Candidate) => {
        this.candidate = res;
        this.skills = res.skills.split(',');
        this.initExperience(this.candidate.candidateId);
        this.initEducation(this.candidate.candidateId);
      });
    }
  }

  initExperience(candidateId: number): void {
    this.experienceService.getByUserId(candidateId).subscribe((experienceList: Experience[]) => {
      this.experienceList = experienceList;
    });
  }

  initEducation(candidateId: number): void {
    this.educationService.getByUserId(candidateId).subscribe((educationList: Education[]) => {
      this.educationList = educationList;
    });
  }

}
