import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job/job.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Enterprise } from 'src/app/models/enterprise';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
    isCurrentUser: boolean; // Used to check if we should enable edit options
    // private authUser: AuthUser;
    job: Job;
    enterprise: Enterprise;

    constructor(private route: ActivatedRoute, private jobService: JobService, private userService: UserService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.initJob(true, +params['jobid']);
        });
    }

    initJob(isCurrentUser: boolean, jobid: number) {
        this.jobService.get(jobid).subscribe((res: Job) => {
            this.job = res;

            this.userService.get(this.job.enterpriseId).subscribe((resu: any) => {
                this.enterprise = resu.data;
            });
        });
    }
}
