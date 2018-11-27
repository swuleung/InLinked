import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchEnterpriseResult = [];
  private searchCandidateResult = [];
  private searchJobsResult = [];

  private filteredJobs = [];

  constructor(private http: HttpClient, private userService: UserService) { }

  searchCandidate(query: string, username?: boolean, headline?: boolean, email?: boolean, fullname?: boolean, skills?: boolean, educationLevel?: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });

    const filters = [];
    if (username) { filters.push('Username'); }
    if (headline) { filters.push('Headline'); }
    if (email) { filters.push('Email'); }
    if (fullname) { filters.push('FullName'); }
    if (skills) { filters.push('Skills'); }
    if (educationLevel) { filters.push('EducationLevel'); }

    const data = {
      'search': query,
      'categories': filters.join(',')
    };

    return this.http.get<any>(`${environment.api_path}/user/search/candidate`, { headers: headers, params: data })
      .pipe(
        map(result => {
          console.log('CANDIDATE SEARCH RESULT', result);
          if (!result.success || result.success === 0) {
            return [];
          }
          return result.data;
        }),
        catchError(err => of([]))
      );
  }

  searchEnterprise(query: string, headline?: boolean, email?: boolean, enterpriseName?: boolean, enterpriseDescription?: boolean, ceo?: boolean, headquarters?: boolean, industry?: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });

    const filters = [];
    if (headline) { filters.push('Headline'); }
    if (email) { filters.push('Email'); }
    if (enterpriseName) { filters.push('EnterpriseName'); }
    if (enterpriseDescription) { filters.push('EnterpriseDescription'); }
    if (ceo) { filters.push('CEO'); }
    if (headquarters) { filters.push('Headquarters'); }
    if (industry) { filters.push('Industry'); }

    const data = {
      'search': query,
      'categories': filters.join(',')
    };

    return this.http.get<any>(`${environment.api_path}/user/search/enterprise`, { headers: headers, params: data })
      .pipe(
        map(result => {
          if (!result.success || result.success === 0) {
            return [];
          }
          return result.data;
        }),
        catchError(err => of([]))
      );
  }

  /* Job Fuzzy Search */
  searchJobs(query: string, jobTitle?: string, jobDescription?: string, employmentType?: string, experienceLevel?: string, educationLevel?: string, city?: string, province?: string, country?: string, jobUrl?: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });

    const filters = [];
    if (jobTitle) { filters.push(jobTitle); }
    if (jobDescription) { filters.push(jobDescription); }
    if (employmentType) { filters.push(employmentType); }
    if (experienceLevel) { filters.push(experienceLevel); }
    if (educationLevel) { filters.push(educationLevel); }
    if (city) { filters.push(city); }
    if (province) { filters.push(province); }
    if (country) { filters.push(country); }
    if (jobUrl) { filters.push(jobUrl); }

    const data = {
      'search': query,
      'categories': filters.join(',')
    };

    return this.http.get<any>(`${environment.api_path}/job`, { headers: headers, params: data })
      .pipe(
        map(result => {
          if (!result.success || result.success === 0) {
            return [];
          }
          return result.data;
        }),
        catchError(err => of([]))
      );
  }

  /* When a search is executed, this is called, to populate all the searches */
  searchAll(query: string) {
    // Clear out the data for new search
    this.searchCandidateResult = [];
    this.searchEnterpriseResult = [];
    this.searchJobsResult = [];
    this.filteredJobs = [];
    this.searchCandidate(query).subscribe(
      result => {
        console.log(result);
        this.searchCandidateResult = result;
      }
    );
    this.searchEnterprise(query).subscribe(
      result => {
        console.log(result);
        this.searchEnterpriseResult = result;
      }
    );
    this.searchJobs(query).subscribe(
      result => {
        /* Substitute the enterpriseId with enterpriseName */
        for (const job of result) {
          console.log(job);
          this.userService.get(job.enterpriseId).subscribe(
            enterprise => {
              enterprise ? job['enterpriseId'] = enterprise.enterpriseName : job['enterpriseId'] = 'N/A';
            }
          );
        }
        this.searchJobsResult = result;
        console.log(this.searchJobsResult);
      }
    );
  }

  filterJobs(employmentTypes: any[], experienceLevels: any[], educationLevel: string, date: string): void {
    if (!this.searchJobsResult.length) {
      return;
    }
    employmentTypes = employmentTypes.filter((v) => v.checked === true).map((emp) => emp.value);
    experienceLevels = experienceLevels.filter((v) => v.check === true).map((exp) => exp.value);
    for (const job of this.searchJobsResult) {
      if (job.employmentType in employmentTypes) {
        this.filteredJobs.push(job);
      } else if (job.experienceLevel in experienceLevels) {
        this.filteredJobs.push(job);
      } else if (job.educationLevel === educationLevel) {
        this.filteredJobs.push(job);
      } else if (this.checkJobDate(job, date)) {
        this.filteredJobs.push(job);
      }
    }
  }

  checkJobDate(job: any, date: string): boolean {
    if (date === 'Any Time') {
      return true;
    }
    return true;
  }
}
