import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../../models/employee';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = 'http://localhost:8080/api/v1';
  private adminData: Employee;
  private decoded: any;

  constructor(
    private user: UserService,
    private authService: AuthenticationService,
    private http: HttpClient) { }

  /**
   * Delete the user from the user and candidate/enterprise table
   *
   * @param {number} id - id of the user being deleted
   * @returns {Observable<string>} - message saying action taken or the error that resulted
   * @memberof AdminService
   */
  deleteUser(id: number): Observable<string> {
    return this.user.delete(id)
      .pipe(
        map(
          result => result.message
        ),
        catchError(
          err => err.message
        )
      );
  }

  create(username: string, password: string, email: string): Observable<boolean | Subscription> {
    const newUser = {
      userId: 0, // To satisfy user model in backend
      username: username,
      headline: '',
      password: password,
      email: email,
      profilePicture: '',
      coverPhoto: '',
      role: 'admin',
      acctype: 'n/a'
    };

    return this.http.post(`${this.apiUrl}/user`, {user: newUser})
      .pipe(
        map(res => {
          // Login to store the token in the local storage
          return this.authService.login(email, password).subscribe(val => {
            this.decoded = this.user.decode(val);
            this.adminData = {
              employeeId: this.decoded.id,
              username: username,
              email: email,
              role: 'admin',
              dateJoined: new Date().toLocaleDateString()
            };
            return of(true);
          });
        }),
        catchError(err => of(false))
      );
  }
}
