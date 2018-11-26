import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService, private userService: UserService) { }

  ngOnInit() {
  }

}
