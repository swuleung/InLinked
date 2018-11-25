import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  constructor(private http: HttpClient, private userService: UserService) { }

  create(candidateId: number, schoolName: string, startMonth: number, startYear: number, location: string, endMonth?: number, endYear?: number, degree?: string): Observable<boolean> {
    const payload = {
      education: {
        educationId: 0,
        candidateId: candidateId,
        schoolName: schoolName,
        startMonth: startMonth,
        startYear: startYear,
        location: location,
        endMonth: endMonth || null,
        endYear: endYear || null,
        degree: degree || null
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.post<any>(`${environment.api_path}/education`, payload)
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

  get(educationId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.get<any>(`${environment.api_path}/experience/${educationId}`, { headers: headers })
      .pipe(
        map(res => {
          if (!res.success || res.success === 0) {
            return null;
          }
          return res.data;
        }),
        catchError(err => of(null))
      );
  }

  update(educationId: number, candidateId: number, schoolName: string, startMonth: number, startYear: number, location: string, endMonth?: number, endYear?: number, degree?: string) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
     'Content-Type': 'application/json' });

    const payload = {
      education: {
        educationId: educationId,
        candidateId: candidateId,
        schoolName: schoolName,
        startMonth: startMonth,
        startYear: startYear,
        location: location,
        endMonth: endMonth || null,
        endYear: endYear || null,
        degree: degree || null
      },
      user: this.userService.buildAuthBody()
    };
    
    return this.http.put<any>(`${environment.api_path}/experience/${educationId}`, payload, { headers: headers })
      .pipe(
        map(res => {
          if (!res.success || res.success === 0) {
            return false;
          }
          return true;
        }),
        catchError(err => {
          return of(false);
        })
      );
  }

  delete(educationId: number) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.delete<any>(`${environment.api_path}/user/${educationId}`, { headers: headers });
  }

  getByUserId(userId: number) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.api_path}/education/user/${userId}`, this.userService.buildAuthBody(), { headers: headers })
      .pipe(
        map(res => {
          if (!res.success || res.success === 0) {
            return null;
          }
          return res.data;
        }),
        catchError(err => of(null))
      );
  }
}
