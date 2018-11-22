import { Component, OnInit, Input } from '@angular/core';
import { Enterprise } from '../../models/enterprise';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { AuthUser } from '../../models/auth-user';

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.scss']
})
export class EnterpriseProfileComponent implements OnInit {

  isCurrentUser: boolean; // Used to check if we should enable edit options
  private authUser: AuthUser;
  enterprise: Enterprise;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user
    // Check if this is the user we are loading
    this.loadUser(this.authUser);
  }

  /**
   * Verifies if the profile we are loading belongs to the user logged in
   *
   * @param {Enterprise} enterprise
   * @memberof EnterpriseProfileComponent
   */
  loadUser(authUser: AuthUser): void {
    console.log(authUser);
    this.route.params.subscribe(params => {
      this.isCurrentUser = authUser.username === params['username'];
      console.log(authUser.username, params['username']);
      this.initEnterprise(this.isCurrentUser, params['username']);
    });
      
  }

  initEnterprise(isCurrentUser: boolean, username: string) {
    if (isCurrentUser) {
      this.enterprise = this.userService.getCorrespondingUserData() as Enterprise;

      // Check if it was loaded before
      if (!this.enterprise) {
        this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((res: Enterprise) => {
          this.enterprise = res;
        });
      }
    } else {
      console.log('other account');
      this.userService.getByUsername(username).subscribe((res: Enterprise) => {
        this.enterprise = res;
      });
    }
  }

}
