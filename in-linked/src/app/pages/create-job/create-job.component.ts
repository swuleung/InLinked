import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-create-job',
    templateUrl: './create-job.component.html',
    styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {
    private educationLevels = [
        'High School',
        'Bachelors',
        'Masters',
        'Doctorate',
        'Postdoc'
    ];

    private experienceLevels = [
        'Entry-level',
        'Internship',
        'Associate',
        'Senior',
        'Director',
        'Executive'
    ];

    private employmentTypes = [
        'Full-Time',
        'Part-Time',
        'Contract',
        'Temporary',
        'Volunteer',
        'Other'
    ];
    constructor() { }

    ngOnInit() {
    }

}
