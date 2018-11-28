import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: ['./search-candidates.component.scss']
})
export class SearchCandidatesComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
  }

  navigateToCandidateProfile(username: string) {
    this.router.navigate([`/dashboard/candidate/${username}`]);
  }

}
