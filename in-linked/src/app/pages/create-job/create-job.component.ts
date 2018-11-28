import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job/job.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-job',
    templateUrl: './create-job.component.html',
    styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {
    private jobTitle = '';
    private employmentType = '';
    private experienceLevel = '';
    private educationLevel = '';
    private salary = '';
    private city = '';
    private province = '';
    private country = '';
    private jobDescription = '';
    private jobUrl = '';
    private errorMessage = '';

    private educationLevels = [
        'High School',
        'Bachelors',
        'Masters',
        'Doctorate',
        'Postdoc'
    ];

    private experienceLevels = [
        'Entry level',
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
    constructor(private router: Router, private jobService: JobService, private userService: UserService) { }

    ngOnInit() {
    }

    onSubmit() {
        if (!this.jobTitle) {
            this.errorMessage = 'Job title is required';
            return;
        }
        if (!this.jobDescription) {
            this.errorMessage = 'Job description required';
            return;
        }
        if (!this.jobUrl) {
            this.errorMessage = 'Job url required';
            return;
        }
        this.jobService.create(this.userService.enterpriseData.enterpriseId, this.jobTitle, this.jobDescription, this.jobUrl, new Date(), this.salary, this.employmentType, this.experienceLevel, this.educationLevel, this.city, this.province, this.country)
            .subscribe(result => {
                if (!result) {
                    this.errorMessage = 'Could not create job.';
                } else {
                    this.router.navigate(['/dashboard/job/viewjobs']);
                }
            });
    }
}
