import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate, isCandidate } from 'src/app/models/candidate';
import { Enterprise } from '../models/enterprise';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, delay, map, mergeMap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

import { AuthenticationService } from './authentication.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:8080/api/v1';
  private candidateData: Candidate;
  private enterpriseData: Enterprise;
  private decoded: any;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) { }

  decode(token: string): any {
    return helper.decodeToken(token);
  }

  /**
   * Create user in the database
   *
   * @param {string} fullName - user's full name
   * @param {string} username - user's username
   * @param {string} password - user's password
   * @param {string} email - user's email
   * @param {string} educationLevel - user's education level
   * @param {string} acctype - user's account type (either candidate or enterprise)
   * @returns {Observable<boolean>} - true on success, false otherwise
   * @memberof UserService
   */
  create(fullName: string, username: string, password: string, email: string, educationLevel: string, acctype: string):
    Observable<boolean | Subscription> {

    const newUser = {
      userId: 0, // To satisfy user model in backend
      username: username,
      headline: '',
      password: password,
      email: email,
      profilePicture: '',
      coverPhoto: '',
      role: 'user',
      acctype: acctype
    };
    const body: any = {};
    body.user = newUser;
    if (acctype === 'candidate') {
      body.candidate = {
        candidateId: 0,
        fullName: fullName,
        skills: '',
        educationLevel: educationLevel.toLocaleLowerCase(),
        displayEmail: 1
      };
    } else {
      body.enterprise = {
        enterpriseId: 0,
        enterpriseName: fullName,
        enterpriseDescription: '',
        ceo: '',
        headquarters: '',
        industry: ''
      };
    }
    return this.http.post<any>(`${this.apiUrl}/user`, body)
      .pipe(
        map(result => {
          if (acctype === 'candidate') {
            this.candidateData = {
              candidateId: result.userId,
              username: result.username,
              headline: result.headline,
              email: result.email,
              profilePicture: result.profilePicture,
              coverPhoto: result.coverPhoto,
              fullName: fullName,
              skills: '',
              educationLevel: educationLevel.toLocaleLowerCase(),
              displayEmail: 1
            };
          } else {
            this.enterpriseData = {
              enterpriseId: result.userId,
              enterpriseName: fullName,
              enterpriseDescription: '',
              ceo: '',
              headquarters: '',
              industry: '',
              email: result.email,
              profilePicture: result.profilePicture,
              coverPhoto: result.coverPhoto
            };
          }
          return true;
        }),
        delay(250),
        map(res => {
          return this.authService.login(email, password).subscribe(val => {
            console.log(val);
            return val.success === 1 && res; // Only return success on creating account and logging in
          });
        }),
        catchError(err => of(false)) // If account exists, or other error
      );
  }

  /**
   * Get the user information that is logged in from the database and populates either candidate or enterprise
   * TODO: For personal data requests, retrieve unsanitized version
   *
   * @param {string} data - authentication token of the user
   * @returns {Observable<any>} - return object containing user information along with candidate/enterprise data
   * @memberof UserService
   */
  getPersonal(data: string): Observable<any> {
    this.decoded = helper.decodeToken(data);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${data}`, 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.get<any>(`${this.apiUrl}/user/${this.decoded.id}`, {headers: headers})
      .pipe(
        map(result => {
          // if (result.success && result.success === 0) {
          //   return null; // If there is an error
          // }

          // // TODO: What is this for?
          // if (isCandidate(result)) {
          //   this.candidateData = {
          //     candidateId: result.candidateId,
          //     username: result.username,
          //     headline: result.headline,
          //     email: result.email,
          //     profilePicture: result.profilePicture,
          //     coverPhoto: result.coverPhoto,
          //     fullName: result.fullName,
          //     skills: result.skills,
          //     educationLevel: result.educationLevel,
          //     displayEmail: result.displayEmail.data[0]
          //   };
          // } else {
          //   this.enterpriseData = {
          //     enterpriseId: result.enterpriseId,
          //     enterpriseName: result.enterpriseName,
          //     enterpriseDescription: result.enterpriseDescription,
          //     ceo: result.ceo,
          //     headquarters: result.headquarters,
          //     industry: result.industry,
          //     email: result.email,
          //     profilePicture: result.profilePicture,
          //     coverPhoto: result.coverPhoto
          //   };
          // }

          // Filter result object before returning?
          return result;
        }),
        catchError(err => of(null))
      );
  }

  /**
   * Returns sanitized data for every user that is not the current one logged in
   * 
   * @param {number} id 
   * @returns {Observable<any>} 
   * @memberof UserService
   */
  get(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
      'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/user/${id}`, {headers: headers})
      .pipe(
        map(res => {
          if (res.success && res.success == 0) {
            return null;
          }
          return res;
        }),
        catchError(err => of(null))
      );
  }

  /**
   * Update a candidate's fullName, skills, educationLevel, and/or displayEmail
   * or an enterprise's enterpriseName, enterpriseDescription, ceo, headquarters, and/ or industry
   *
   * @param {any} user - The candidate or enterprise being updated
   * @returns {Observable<boolean>} - true on success, false otherwise
   * @memberof UserService
   */
  update(user: any): Observable<boolean> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
     'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/user`, {headers: headers, body: user})
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
  delete(id: number): Observable<any> {
    // Note: the authorization token is of the admin
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
      'Content-Type': 'application/json' });
    return this.http.delete(`${this.apiUrl}/user/${id}`, {headers: headers});
  }
}
