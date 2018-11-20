import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';

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

  //#region User API

  testCreateUser() {
    // This works
  }

  testGetCurrentUser() {
    this.userService.getPersonal(localStorage.getItem(environment.token_key)).subscribe(res => 
      this.apiResponseRef.nativeElement.value = JSON.stringify(res));
  }

  testGetUserById() {
    const id = prompt('Enter a user ID to fetch');
    this.userService.get(Number(id)).subscribe(res => this.apiResponseRef.nativeElement.value = JSON.stringify(res));
  }

  testUpdateUser() {
    
  }

  //#endregion

}
