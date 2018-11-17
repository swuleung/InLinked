import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from 'src/app/models/candidate';
import { Enterprise } from '../models/enterprise';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs/operators';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'localhost:8080/api/v1';
  private candidateData: Candidate;
  private enterpriseData: Enterprise;
  private decoded: any;
  private created;

  constructor(private http: HttpClient) { }

  create(username: string, password: string, email: string, acctype: string): boolean {
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
    this.http.post(`${this.apiUrl}/user`, {user: newUser})
      .pipe(
        map(created =>  this.created = created), // Change this later, need to return true at some point
      );
    return false;
  }

  get(data: string): void {
    this.decoded = helper.decodeToken(data);
    console.log(this.decoded);
  }
}
