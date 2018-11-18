import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* Font Awesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

library.add(faMinus, faEdit);

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
import { TitleSectionModalComponent } from './pages/candidate-profile/title-section-modal/title-section-modal.component';
import { ExperienceSectionModalComponent } from './pages/candidate-profile/experience-section-modal/experience-section-modal.component';
import { SkillsSectionModalComponent } from './pages/candidate-profile/skills-section-modal/skills-section-modal.component';
import { EducationSectionModalComponent } from './pages/candidate-profile/education-section-modal/education-section-modal.component';
import { EnterpriseTitleSectionModalComponent } from './pages/enterprise-profile/title-section-modal/title-section-modal.component';
import { FastFactsSectionModalComponent } from './pages/enterprise-profile/fast-facts-section-modal/fast-facts-section-modal.component';

// Automatically attach token to each request with http module
export function tokenGetter() {
  return localStorage.getItem('token');
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
    AdminComponent,
    TitleSectionModalComponent,
    ExperienceSectionModalComponent,
    SkillsSectionModalComponent,
    EducationSectionModalComponent,
    EnterpriseTitleSectionModalComponent,
    FastFactsSectionModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080/dashboard'], // Paths we want to send the auth token with in the header
        blacklistedRoutes: [
          'localhost:8080/login/',
          'localhost:8080/create-account/'
        ] // Paths that we do not want to send the auth token with (typically like login and stuff)
      }
    }),
    FontAwesomeModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
