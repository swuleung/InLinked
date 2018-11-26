import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-search-enterprises',
  templateUrl: './search-enterprises.component.html',
  styleUrls: ['./search-enterprises.component.scss']
})
export class SearchEnterprisesComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
  }

  navigateToEnterpriseProfile(username: string) {
    this.router.navigate([`/dashboard/enterprise/${username}`]);
  }

}
