import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { JobService } from '../../../services/job/job.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-job-delete-modal',
    templateUrl: './job-delete-modal.component.html',
    styleUrls: ['./job-delete-modal.component.scss']
})
export class JobDeleteModalComponent {
    private modalRef: NgbModalRef;
    username: string;
    enteredUsername: string;
    closeResult: string;
    jobId: number;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private user: UserService,
        private job: JobService,
        private route: ActivatedRoute,) { }

    open(content) {
        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.populateForm();
    }

    populateForm() {
        if (this.user.enterpriseData) {
            const currUser = this.user.enterpriseData;
            this.username = currUser.username;

            this.route.params.subscribe(params => {
                this.jobId = +params['jobid'];
            });
        }
    }

    onSubmit(): void {
        this.job.delete(this.jobId).subscribe((res) => {
            if (res) {
                this.modalRef.close('Deleted job');
                this.router.navigate(['/dashboard/job/viewjobs']);
            } else {
                window.alert('Could not delete job');
            }
        });
    }

}
