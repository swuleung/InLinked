import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private http: HttpClient, private userService: UserService) { }

  create(candidateId: number, positionName: string, enterpriseName: string, startMonth: number, startYear: number, enterpriseId?: number, description?: string, endMonth?: number, endYear?: number, location?: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
     'Content-Type': 'application/json' });

    const payload = {
      experience: {
        experienceId: 0,
        candidateId: candidateId,
        enterpriseId: enterpriseId || null,
        enterpriseName: enterpriseName,
        positionName: positionName,
        description: description || null,
        startMonth: startMonth,
        startYear: startYear,
        endMonth: endMonth || null,
        endYear: endYear || null,
        location: location || null
      },
      user: this.userService.buildAuthBody()
    };

    return this.http.post<any>(`${environment.api_path}/experience`, payload, { headers: headers })
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

  get(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.get<any>(`${environment.api_path}/experience/${id}`, { headers: headers })
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

  update(experienceId: number, positionName: string, enterpriseName: string, startMonth: number, startYear: number, endMonth?: number, endYear?: number, description?: string,positionLocation?: string): Observable<boolean> {

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
     'Content-Type': 'application/json' });

    const payload = {
      experience: {
        experienceId: experienceId,
        positionName: positionName,
        enterpriseName: enterpriseName,
        startMonth: startMonth,
        startYear: startYear,
        endMonth: endMonth || null,
        endYear: endYear || null,
        description: description || null,
        location: positionLocation || null
      },
      user: this.userService.buildAuthBody()
    };
    
    return this.http.put<any>(`${environment.api_path}/experience/${experienceId}`, payload, { headers: headers })
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

  delete(experienceId: number): Observable<boolean> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
      // Note that delete does not allow bodies in Angular 6, but is allowed in HTTP spec
      return this.http.request<any>('delete', `${environment.api_path}/experience/${experienceId}`, { headers: headers, body: { user: this.userService.buildAuthBody() } }).pipe(
        map(() => true)
      );
  }

  getByUserId(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(environment.token_key)}`,
      'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.api_path}/experience/user/${userId}`, { user: this.userService.buildAuthBody() }, { headers: headers })
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
