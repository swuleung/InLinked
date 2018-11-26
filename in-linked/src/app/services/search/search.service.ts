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
  private searchAllResult: any;
  private searchEnterpriseResult: any;
  private searchCandidateResult: any;
  private searchJobsResult: any;

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
    console.log(data);

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
          console.log('ENTERPRISE SEARCH RESULT', result);
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
    console.log(data);

    return this.http.get<any>(`${environment.api_path}/job`, { headers: headers, params: data })
      .pipe(
        map(result => {
          console.log('JOB SEARCH RESULT', result);
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
    this.searchCandidate(query).subscribe(
      result => {
        console.log('SEARCH CANDIDATE RESULT', result);
        this.searchCandidateResult = result;
      }
    );
    this.searchEnterprise(query).subscribe(
      result => {
        console.log('SEARCH ENTERPRISE RESULT', result);
        this.searchEnterpriseResult = result;
      }
    );
    this.searchJobs(query).subscribe(
      result => {
        console.log('SEARCH JOB RESULT', result);
        this.searchJobsResult = result;
      }
    );
  }

}
