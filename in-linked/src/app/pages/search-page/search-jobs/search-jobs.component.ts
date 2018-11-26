import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job/job.service';

@Component({
  selector: 'app-search-jobs',
  templateUrl: './search-jobs.component.html',
  styleUrls: ['./search-jobs.component.scss']
})
export class SearchJobsComponent implements OnInit {

  constructor(private jobService: JobService) { }

  ngOnInit() {
  }

}
