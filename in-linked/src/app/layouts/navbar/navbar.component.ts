import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  brandTitle = 'InLinked';

  constructor() { }

  ngOnInit() {
  }

  status: boolean = false;

  toggleNavbar(){
    this.status = !this.status;
  }
}

