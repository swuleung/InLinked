import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job/job.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Enterprise } from 'src/app/models/enterprise';
import { AuthUser } from 'src/app/models/auth-user';


@Component({
    selector: 'app-view-jobs',
    templateUrl: './view-jobs.component.html',
    styleUrls: ['./view-jobs.component.scss']
})
export class ViewJobsComponent implements OnInit {
    isCurrentUser: boolean; // Used to check if we should enable edit options
    private authUser: AuthUser;
    enterprise: Enterprise;
    jobsList: any;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private jobService: JobService) { }

    ngOnInit() {
        this.authUser = this.userService.decode(localStorage.getItem(environment.token_key)); // Get the current user
        if (this.userService.candidateData) {
            this.router.navigate([`/dashboard/candidate/${this.userService.candidateData.username}`]);
        }
        this.initViewJobs();
    }


    initViewJobs() {
        console.log(this.userService.enterpriseData);
        this.enterprise = this.userService.getCorrespondingUserData() as Enterprise;

        // Check if it was loaded before
        if (!this.enterprise) {
            this.userService.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((res: any) => {
                if (this.userService.currentAccountType === 'enterprise') {
                    this.enterprise = res;
                    this.jobService.getByEnterpriseId(this.enterprise.userId).subscribe((resu: any) => {
                        this.jobsList = resu;
                    });
                } else {
                    this.router.navigate([`/dashboard/candidate/${this.userService.candidateData.username}`]);
                    console.log('not an enterprise');
                }
            });
        } else {
            this.jobService.getByEnterpriseId(this.enterprise.userId).subscribe((result: any) => {
                this.jobsList = result;
            });
        }
    }

}
