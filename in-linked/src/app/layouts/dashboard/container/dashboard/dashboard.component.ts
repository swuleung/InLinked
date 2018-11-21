import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';
import { Enterprise } from '../../../../models/enterprise';
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: Candidate | Enterprise;
  username: string;
  acctype: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getCorrespondingUserData();
    // console.log(this.user);
    if (!this.user) {
      this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe(res => {
        console.log('test');
        console.log(res);
        this.user = res;
        this.username = res.username;
        this.acctype = res.acctype;
      });
      return;
    }

    console.log(this.user);
  }

}
