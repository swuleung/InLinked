import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job/job.service';

@Component({
    selector: 'app-search-jobs',
    templateUrl: './search-jobs.component.html',
    styleUrls: ['./search-jobs.component.scss']
})
export class SearchJobsComponent implements OnInit {
    private employmentTypes = [
        'Full-Time',
        'Part-Time',
        'Contract',
        'Temporary',
        'Volunteer',
        'Other'
    ];

    private experienceLevels = [
        'Entry-level',
        'Internship',
        'Associate',
        'Senior',
        'Director',
        'Executive'
    ];

    private educationLevels = [
        'High School',
        'Bachelors',
        'Masters',
        'Doctorate',
        'Postdoc'
    ];

    private datePosted = [
        'Past Week',
        'Past Month',
        'Past Year',
        'Any Time'
    ];

    constructor(private jobService: JobService) { }

    ngOnInit() {
    }

}
