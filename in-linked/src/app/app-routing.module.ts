import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './layouts/dashboard/container/dashboard/dashboard.component';
import { CandidateProfileComponent } from './pages/candidate-profile/candidate-profile.component';
import { EnterpriseProfileComponent } from './pages/enterprise-profile/enterprise-profile.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserFeedComponent } from './pages/user-feed/user-feed.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { JobSearchComponent } from './pages/job-search/job-search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
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
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: UserFeedComponent
      },
      { // temporary - no candidates can be loaded yet
        path: 'candidate',
        component: CandidateProfileComponent
      },
      { // temporary - no enterprises can be loaded yet
        path: 'enterprise',
        component: EnterpriseProfileComponent
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
        path: 'jobs',
        component: JobSearchComponent
      },
      {
        path: 'jobs/:query',
        component: JobSearchComponent
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
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
