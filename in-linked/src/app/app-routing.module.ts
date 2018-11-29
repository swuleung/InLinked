import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './layouts/dashboard/container/dashboard/dashboard.component';
import { CandidateProfileComponent } from './pages/candidate-profile/candidate-profile.component';
import { EnterpriseProfileComponent } from './pages/enterprise-profile/enterprise-profile.component';
import { JobComponent } from './pages/job/job.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { UserFeedComponent } from './pages/user-feed/user-feed.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ServiceTestComponent } from './pages/service-test/service-test.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './pages/error/error.component';
import { CreateJobComponent } from './pages/create-job/create-job.component';
import { ViewJobsComponent } from './pages/view-jobs/view-jobs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
  },
  {
    path: 'service-test',
    component: ServiceTestComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserFeedComponent
      },
      {
        path: 'candidate/:username',
        component: CandidateProfileComponent
      },
      {
        path: 'enterprise/:username',
        component: EnterpriseProfileComponent
      },
      {
        path: 'search',
        component: SearchPageComponent
      },
      {
        path: 'search/:query',
        component: SearchPageComponent
      },
      {
        path: 'job',
        component: CreateJobComponent
      },
      {
          path: 'job/viewjobs',
          component: ViewJobsComponent
      },
      {
        path: 'job/:jobid',
        component: JobComponent
      },
      {
        path: 'error',
        component: ErrorComponent
      },
    ]
  },
  // 404
  {
    path: '**',
    redirectTo: 'dashboard/error'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
