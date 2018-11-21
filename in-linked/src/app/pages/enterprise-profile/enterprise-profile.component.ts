import { Component, OnInit, Input } from '@angular/core';
import { Enterprise } from '../../models/enterprise';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.scss']
})
export class EnterpriseProfileComponent implements OnInit {

  enterprise: Enterprise;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.enterprise = this.userService.getCorrespondingUserData() as Enterprise;
    if (!this.enterprise) {
      this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((res: Enterprise) => {
        console.log(res);
        this.enterprise = res;
      });
      return;
    }
    console.log(this.enterprise);
  }

}
