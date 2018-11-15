import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidate } from 'src/app/models/candidate';
import { Enterprise } from '../models/enterprise';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'localhost:8080/api/v1';
  private candidateData: Candidate;
  private enterpriseData: Enterprise;
  private decoded: any;

  constructor(private http: HttpClient) { }

  get(data: string): void {
    this.decoded = helper.decodeToken(data);
    console.log(this.decoded);
  }
}
