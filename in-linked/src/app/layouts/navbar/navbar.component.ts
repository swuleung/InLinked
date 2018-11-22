import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  brandTitle = 'InLinked';
  status: boolean;

  @Input()
  profileName: string;
  @Input()
  profileType: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.status = false;
    // this.profileName = this.userService.getCorrespondingUserData().username;
  }

  toggleNavbar() {
    this.status = !this.status;
  }
}

