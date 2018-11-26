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

    const params = new HttpParams();
    params.append('search', query);
    params.append('categories', filters.join(','));
    console.log('CANDIDATE SEARCH PARAMS', params);

    return this.http.get<any>(`${environment.api_path}/user/search/candidate`, { headers: headers, params: params })
      .pipe(
        map(result => {
          if (!result.status || result.status === 0) {
            return false;
          }
          return true;
        }),
        catchError(err => of(null))
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

    const params = new HttpParams();
    params.append('search', query);
    params.append('categories', filters.join(','));
    console.log('ENTERPRISE SEARCH PARAMS', params);

    return this.http.get<any>(`${environment.api_path}/user/search/enterprise`, { headers: headers, params: params })
      .pipe(
        map(result => {
          if (!result.status || result.status === 0) {
            return false;
          }
          return true;
        }),
        catchError(err => of(null))
      );
  }

  /* Job Fuzzy Search */
  searchJobs(query: string, jobTitle?: string, jobDescription?: string, employmentType?: string, experienceLevel?: string, educationLevel?: string, city?: string, province?: string, country?: string, jobUrl?: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });

    const categories = [
      jobTitle || '',
      jobDescription || '',
      employmentType || '',
      experienceLevel || '',
      educationLevel || '',
      city || '',
      province || '',
      country || '',
      jobUrl || ''
    ];

    const params = new HttpParams();
    params.set('search', query);
    params.set('categories', categories.join(','));
    console.log('JOB SEARCH PARAMS', params.toString());

    return this.http.get<any>(`${environment.api_path}/job`, { headers: headers, params: params })
      .pipe(
        map(result => {
          if (!result.success || result.success === 0) {
            return null;
          }
          return result.data;
        }),
        catchError(err => of(null))
      );
  }

  searchAll(query: string) {

  }

}
