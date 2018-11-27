import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private profileType = '';
  private profileName = '';
  private link = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.loadCurrentUser(localStorage.getItem(`${environment.token_key}`)).subscribe(
      result => {
        if (result) {
          this.profileType = this.userService.candidateData ? 'candidate' : 'enterprise';
          this.profileName = this.userService.candidateData ? this.userService.candidateData.username : this.userService.enterpriseData.username;
          if (this.profileType === '' || this.profileName === '') {
            this.link = '/login';
          } else {
            this.link = `/dashboard/${this.profileType}/${this.profileName}`;
          }
        }
      }
    )
  }

}
