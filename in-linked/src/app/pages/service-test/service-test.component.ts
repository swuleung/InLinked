import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-service-test',
  templateUrl: './service-test.component.html',
  styleUrls: ['./service-test.component.scss']
})
export class ServiceTestComponent implements OnInit {

  // Template references
  @ViewChild('apiResponse') apiResponseRef: ElementRef;

  constructor(private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit() {
  }

  testGetCurrentUser() {
    this.userService.getPersonal(localStorage.getItem('Authorization')).subscribe(res => 
      this.apiResponseRef.nativeElement.value = JSON.stringify(res)));
  }

  testGetUserById() {
    const id = prompt('Enter a user ID to fetch');
    this.userService.get(Number(id)).subscribe(res => this.apiResponseRef.nativeElement.value = JSON.stringify(res));
  }

}
