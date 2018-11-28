import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job/job.service';
import { SearchService } from 'src/app/services/search/search.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-jobs',
    templateUrl: './search-jobs.component.html',
    styleUrls: ['./search-jobs.component.scss']
})
export class SearchJobsComponent implements OnInit {
    private employmentTypes = [
        {value: 'Full-Time', checked: false},
        {value: 'Part-Time', checked: false},
        {value: 'Contract', checked: false},
        {value: 'Temporary', checked: false},
        {value: 'Volunteer', checked: false},
        {value: 'Other', checked: false}
    ];

    private experienceLevels = [
        {value: 'Entry level', checked: false},
        {value: 'Internship', checked: false},
        {value: 'Associate', checked: false},
        {value: 'Senior', checked: false},
        {value: 'Director', checked: false},
        {value: 'Executive', checked: false}
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

    private educationLevel: string;
    private date: string;

    constructor(private router: Router, private jobService: JobService, private searchService: SearchService) { }

    ngOnInit() {
    }

    onSubmit() {
        console.log(this.educationLevel);
        console.log(this.date);
        console.log(this.employmentTypes);
        console.log(this.experienceLevels);
        /* Front-end filter for jobs */
        this.searchService.filterJobs(this.employmentTypes, this.experienceLevels, this.educationLevel, this.date);
    }

    navigateToJobPage(jobId: number) {
        this.router.navigate([`/job/${jobId}`]);
    }

    clearJobFilterResults(event) {
        this.searchService.clearJobFilterResults();
        for (const emp of this.employmentTypes) {
            emp.checked = false;
        }
        for (const exp of this.experienceLevels) {
            exp.checked = false;
        }
        this.educationLevel = undefined;
        this.date = undefined;
    }
}
