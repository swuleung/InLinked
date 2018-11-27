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
    this.route.params.subscribe(params => {
      this.isCurrentUser = authUser.username === params['username'];
      this.initCandidate(this.isCurrentUser, params['username']);
    });
  }

  initCandidate(isCurrentUser: boolean, username: string): void {
    if (isCurrentUser) {
      this.candidate = this.userService.getCorrespondingUserData() as Candidate;
      this.skills = (this.candidate) ? this.candidate.skills.split(',') : [];
      console.log(this.skills);
      // Check if it was loaded before
      if (!this.candidate) {
        this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((res: Candidate) => {

          this.candidate = res;
          this.skills = res.skills.split(',');
          
          // If skills just contains an empty string, set it to null
          console.log(this.skills.length);
          if (this.skills.length > 0 && this.skills[0] === '') {
            console.log('null');
            this.skills = null;
          }

          this.initExperience(this.candidate.candidateId);
          this.initEducation(this.candidate.candidateId);
        });
      } else {
        // If skills just contains an empty string, set it to null
        console.log(this.skills.length);
        if (this.skills.length > 0 && this.skills[0] === '') {
          console.log('null');
          this.skills = null;
        }
        this.initExperience(this.candidate.candidateId);
        this.initEducation(this.candidate.candidateId);
      }
    } else {
      this.userService.getByUsername(username).subscribe((res: Candidate) => {
        // Request resource was not found
        if (!res || res.acctype !== 'candidate') {
          window.location.href = 'dashboard/error';
          return;
        }
        this.candidate = res;
        this.skills = res.skills.split(',');
        // If skills just contains an empty string, set it to null
        if (this.skills.length > 0 && this.skills[0] === '') {
          this.skills = null;
        }
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
