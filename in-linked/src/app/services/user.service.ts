import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate, isCandidate } from 'src/app/models/candidate';
import { Enterprise } from '../models/enterprise';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:8080/api/v1';
  private candidateData: Candidate;
  private enterpriseData: Enterprise;
  private decoded: any;
  private created;

  constructor(private http: HttpClient) { }

  /**
   * Create user in the database
   *
   * @param {string} username - user's full name
   * @param {string} password - user's password
   * @param {string} email - user's email
   * @param {string} acctype - user's account type (either candidate or enterprise)
   * @returns {Observable<boolean>} - true on success, false otherwise
   * @memberof UserService
   */
  create(username: string, password: string, email: string, acctype: string): Observable<boolean> {
    const newUser = {
      username: username,
      headline: '',
      password: password,
      email: email,
      profilePicture: '',
      coverPhoto: '',
      role: 'user',
      acctype: acctype
    };
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.g}`, 'Content-Type': 'application/x-www-form-urlencoded' });
    this.http.post<any>(`${this.apiUrl}/user`, {user: newUser}, {headers: headers})
      .pipe(
        map(created => {
          console.log(created);
          this.created = created;
          return true;
        })
      );
  }

  /**
   * Get the user information from the database and populates either candidate or enterprise
   *
   * @param {string} data - authentication token of the user
   * @returns {Observable<boolean>} - true on success, false otherwise
   * @memberof UserService
   */
  get(data: string): Observable<boolean> {
    this.decoded = helper.decodeToken(data);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${data}`, 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.get<any>(`${this.apiUrl}/user/${this.decoded.id}`, {headers: headers})
      .pipe(
        map(result => {
          if (result.success && result.success === 0) {
            return false; // If there is an error
          }
          if (isCandidate(result)) {
            this.candidateData = {
              candidateId: result.candidateId,
              username: result.username,
              headline: result.headline,
              email: result.email,
              profilePicture: result.profilePicture,
              coverPhoto: result.coverPhoto,
              fullName: result.fullName,
              skills: result.skills,
              educationLevel: result.educationLevel,
              displayEmail: result.displayEmail.data[0]
            };
          } else {

          }
          return true;
        })
      );
  }

  /**
   * Update a candidate's fullName, skills, educationLevel, and/or displayEmail
   * or an enterprise's enterpriseName, enterpriseDescription, ceo, headquarters, and/ or industry
   *
   * @param {Candidate | Enterprise} user - The candidate or enterprise being updated
   * @returns {Observable<boolean>} - true on success, false otherwise
   * @memberof UserService
   */
  update(user: Candidate | Enterprise): Observable<boolean> {
    // Might need authorization headers again?
    return this.http.put<any>(`${this.apiUrl}/user`, user)
      .pipe(
        map(res => {
          if (res.status === 200) {
            return true;
          }
          return false;
        })
      );
  }

  /**
   * Delete an account (can only be used by admin)
   *
   * @param {number} id - id of the user being deleted
   * @returns {Observable}
   * @memberof UserService
   */
  delete(id: number): Observable<Object> {
    // Note: the authorization token is of the admin
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
    'Content-Type': 'application/x-www-form-urlencoded' }); // Line break for tslint
    return this.http.delete(`${this.apiUrl}/user/${id}`, {headers: headers});
  }
}
