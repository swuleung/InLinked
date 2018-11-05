import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private userEmail = '';
  private userPassword = '';

  constructor() { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    console.log('hello');
  }
}
