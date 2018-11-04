import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = ''; // URL for server

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    /*
    return this.http.post<any>(`${this.apiUrl}/login`, { username: username, password: password})
      .pipe(
        map(
          user => {
            if (user && user.token) {
              localStorage.setItem('user', JSON.stringify(user));
            }
          }
        )
      );*/
  }

  logout() {

  }
}
