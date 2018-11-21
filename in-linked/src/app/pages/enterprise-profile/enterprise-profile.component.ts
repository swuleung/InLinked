import { Component, OnInit, Input } from '@angular/core';
import { Enterprise } from '../../models/enterprise';

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.scss']
})
export class EnterpriseProfileComponent implements OnInit {

  @Input()
  enterprise: Enterprise;

  constructor() { }

  ngOnInit() {
  }

}
