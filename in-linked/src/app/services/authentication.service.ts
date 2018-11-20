import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = 'http://localhost:8080/api/v1'; // URL for server

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email: email, password: password })
      .pipe(
        map(
          user => {
            if (user && user.success === 0) {
              throw new Error('Error Login');
            }
            if (user && user.authToken) {
              localStorage.setItem('token', JSON.stringify(user.authToken));
            }
            return user.authToken;
          }
        ),
        catchError(
          (err, caught) => {
            throw err;
          }
        )
      );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
