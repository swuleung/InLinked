import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = 'localhost:8080/api/v1'; // URL for server

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email: email, password: password})
      .pipe(
        map(
          user => {
            if (user && user.error) {
              throw new Error('Error Login');
            }
            if (user && user.token) {
              localStorage.setItem('user', JSON.stringify(user));
            }
          }
        ),
        catchError(this.handleError({error: 'Invalid Login'}))
      );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log('Error in the Login');
      return of(result as T);
    };
  }

  logout() {
    localStorage.removeItem('user');
  }
}
