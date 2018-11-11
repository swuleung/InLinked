import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { EnterpriseProfileComponent } from './pages/enterprise-profile/enterprise-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JobApplicantsComponent } from './pages/job-applicants/job-applicants.component';
import { CandidateProfileComponent } from './pages/candidate-profile/candidate-profile.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EnterpriseProfileComponent,
    LoginComponent,
    SettingsComponent,
    SearchPageComponent,
    JobApplicantsComponent,
    CandidateProfileComponent,
    CreateAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
