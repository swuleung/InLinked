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
import { AdminComponent } from './pages/admin/admin.component';
import { ServiceTestComponent } from './pages/service-test/service-test.component';
import { AuthGuard } from './guards/auth.guard';

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
      },
      {
        path: 'admin',
        component: AdminComponent
      }
    ]
  },
  // 404
  // {
  //   path: '**',
  //   component: PageNotFoundComponent
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
