import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient, private userService: UserService) { }

  create(enterpriseId: number, jobTitle: string, jobDescription: string, jobUrl: string, postedDate: Date, salary?: number, employmentType?: string, experienceLevel?: string, educationLevel?: string, city?: string, province?: string, country?: string): Observable<boolean> {
    const payload = {
      job: {
        jobId: 0,
        enterpriseId: enterpriseId,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        salary: salary || null,
        employmentType: employmentType || null,
        experienceLevel: experienceLevel || null,
        educationLevel: educationLevel || null,
        city: city || null,
        province: province || null,
        country: country || null,
        jobUrl: jobUrl,
        postedDate: postedDate
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.post<any>(`${environment.api_path}/job`, payload)
      .pipe(
        map(result => {
          if (!result.success || result.success === 0) {
            return false;
          }
          return true;
        }),
        catchError(err => of(false))
      );
  }

  get(jobId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.get<any>(`${environment.api_path}/job/${jobId}`, { headers: headers })
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

  update(jobId: number, jobTitle: string, jobDescription: string, salary?: number, employmentType?: string, experienceLevel?: string, educationLevel?: string, city?: string, province?: string, country?: string, jobUrl?: string): Observable<boolean> {

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
     'Content-Type': 'application/json' });

    const payload = {
      job: {
        jobId: jobId,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        salary: salary || null,
        employmentType: employmentType || null,
        experienceLevel: experienceLevel || null,
        educationLevel: educationLevel || null,
        city: city || null,
        province: province || null,
        country: country || null,
        jobUrl: jobUrl || null
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.put<any>(`${environment.api_path}/job/${jobId}`, payload, { headers: headers })
      .pipe(
        map(result => {
          if (!result.success || result.success === 0) {
            return false;
          }
          return true;
        }),
        catchError(err => of(false))
      );
  }

  delete(jobId: number): Observable<void> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.delete<any>(`${environment.api_path}/job/${jobId}`, { headers: headers });
  }

  getByEnterpriseId(enterpriseId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.api_path}/job/enterprise/${enterpriseId}`, this.userService.buildAuthBody(), { headers: headers })
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

  searchJobs(jobTitle?: string, jobDescription?: string, employmentType?: string, experienceLevel?: string, educationLevel?: string, city?: string, province?: string, country?: string, jobUrl?: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });

    const categories = {
      JobTitle: jobTitle || null,
      JobDescription: jobDescription || null,
      EmploymentType: employmentType || null,
      ExperienceLevel: experienceLevel || null,
      EducationLevel: educationLevel || null,
      City: city || null,
      Province: province || null,
      Country: country || null,
      JobUrl: jobUrl || null
    }

    return this.http.get<any>(`${environment.api_path}/job`, { headers: headers, params: categories })
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

}