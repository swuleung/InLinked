import { Component, Output, EventEmitter } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { environment } from 'src/environments/environment';
import { Job } from '../../../models/job';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/services/job/job.service';

@Component({
    selector: 'app-job-modal',
    templateUrl: './job-modal.component.html',
    styleUrls: ['./job-modal.component.scss']
})
export class JobModalComponent {
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

    @Output() jobUpdated = new EventEmitter<boolean>();
    private modalRef: NgbModalRef;
    private jobId;
    private jobTitle = '';
    private jobUrl = '';
    private jobDescription;
    private educationLevel;
    private experienceLevel;
    private employmentType;
    private salary = '';
    private city = '';
    private province = '';
    private country = '';
    private errorMessage = '';
    closeResult: string;

    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private user: UserService,
        private job: JobService
    ) { }

    open(content) {
        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.populateModal();
    }

    populateModal() {
        this.route.params.subscribe(params => {
            this.jobId = +params['jobid'];
            this.job.get(this.jobId).subscribe((res: Job) => {
                this.jobTitle = res.jobTitle;
                this.jobDescription = res.jobDescription;
                this.salary = res.salary;
                this.employmentType = res.employmentType;
                this.experienceLevel = res.experienceLevel;
                this.educationLevel = res.educationLevel;
                this.city = res.city;
                this.province = res.province;
                this.country = res.country;
                this.jobUrl = res.jobUrl;
            });
        });
    }

    onSubmit(): void {
        // Check if fields are valid, close on success
        const updatedJob: Job = {
            jobId: this.jobId,
            enterpriseId: this.user.enterpriseData.userId,
            jobTitle: this.jobTitle,
            jobDescription: this.jobDescription,
            salary: this.salary,
            employmentType: this.employmentType,
            experienceLevel: this.experienceLevel,
            educationLevel: this.educationLevel,
            city: this.city,
            province: this.province,
            country: this.country,
            jobUrl: this.jobUrl,
            postedDate: new Date()
        };

        this.job.update(updatedJob.jobId, updatedJob.jobTitle, updatedJob.jobDescription,
            updatedJob.salary, updatedJob.employmentType, updatedJob.experienceLevel,
            updatedJob.educationLevel, updatedJob.city, updatedJob.province, updatedJob.country, updatedJob.jobUrl).subscribe((res) => {
            if (res) {
                this.jobUpdated.emit(true);
                // this.user.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((user) => {
                //     this.titleUpdateUser.emit(true);
                // });
            } else {
                window.alert('Could not update job');
            }
        });

        // No password update, just close
        this.modalRef.close('updated');
    }
}

