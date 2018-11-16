import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { EnterpriseProfileComponent } from './pages/enterprise-profile/enterprise-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { CandidateProfileComponent } from './pages/candidate-profile/candidate-profile.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { DashboardComponent } from './layouts/dashboard/container/dashboard/dashboard.component';
import { UserFeedComponent } from './pages/user-feed/user-feed.component';
import { JobSearchComponent } from './pages/job-search/job-search.component';
import { AdminComponent } from './pages/admin/admin.component';

// Automatically attach token to each request with http module
export function tokenGetter() {
  return localStorage.getItem('access_token'); // TODO: Change this to what Jeffrey set it to
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EnterpriseProfileComponent,
    LoginComponent,
    SettingsComponent,
    SearchPageComponent,
    CandidateProfileComponent,
    CreateAccountComponent,
    DashboardComponent,
    UserFeedComponent,
    JobSearchComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // TODO: CHANGE THESE URLS
        whitelistedDomains: ['localhost:3001'], // Paths we want to send the auth token with in the header
        blacklistedRoutes: ['localhost:3001/auth/'] // Paths that we do not want to send the auth token with (typically like login and stuff)
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
