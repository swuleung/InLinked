import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job/job.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Enterprise } from 'src/app/models/enterprise';
import { AuthUser } from 'src/app/models/auth-user';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
    private authUser: AuthUser;
    isCurrentEnterprise: boolean;
    job: Job;
    enterprise: Enterprise;

    constructor(private route: ActivatedRoute, private jobService: JobService, private userService: UserService) { }

    ngOnInit() {
        this.authUser = this.userService.decode(localStorage.getItem(environment.token_key));
        this.route.params.subscribe(params => {
            this.initJob(+params['jobid']);
        });
    }

    onJobUpdate(update: boolean) {
        if (update) {
            this.initJob(this.job.jobId);
        }
    }

    initJob(jobid: number) {
        this.jobService.get(jobid).subscribe((res: Job) => {
            this.job = res;
            if (this.job) {
                this.isCurrentEnterprise = this.job.enterpriseId === this.authUser.id ? true : false;
                this.userService.get(this.job.enterpriseId).subscribe((resu: any) => {
                    this.enterprise = resu.data;
                });
            }
        });
    }
}
