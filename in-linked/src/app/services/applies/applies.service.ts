import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppliesService {

  constructor(private http: HttpClient, private userService: UserService) { }

  create(jobId: number, candidateId: number, dateApplied: Date): Observable<boolean> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    const payload = {
      applies: {
        jobId: jobId,
        candidateId: candidateId,
        dateApplied: dateApplied
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.post<any>(`${environment.api_path}/applies`, payload, { headers: headers})
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

  get(jobId: number, candidateId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.get<any>(`${environment.api_path}/applies/${jobId}/${candidateId}`, { headers: headers })
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

  update(jobId: number, candidateId: number, dateApplied: Date): Observable<boolean> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    const payload = {
      applies: {
        dateApplied: dateApplied
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.put<any>(`${environment.api_path}/applies/${jobId}/${candidateId}`, payload, { headers: headers })
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

  delete(jobId: number, candidateId: number): Observable<void> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.delete<any>(`${environment.api_path}/applies/${jobId}/${candidateId}`, { headers: headers });
  }

  getByCandidate(candidateId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.api_path}/applies/candidate/${candidateId}`, { user: this.userService.buildAuthBody() }, { headers: headers })
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

  //QUESTION: ARE WE KEEPING TRACK OF HOW MANY PEOPLE APPLIED OR HOW MANY PEOPLE VIEWED !important
  getByJob(jobId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.api_path}/applies/job/${jobId}`, { user: this.userService.buildAuthBody() }, { headers: headers })
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
