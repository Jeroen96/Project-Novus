import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginService } from './login/login.service';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ApiService {
  private userApiUrl = 'https://jberk.nl/userApi/';
  private tokenHeaders;
  public userUpdated: boolean;

  constructor(private loginService: LoginService, private http: Http) {
  }

  setHeaders(token: string) {
    this.tokenHeaders = new Headers({ 'Content-Type': 'application/json', 'Access-Token': token });
  }

  getData(type: string, count: number) {
    const url = this.userApiUrl + 'getData';
    return this.http.post(url, JSON.stringify({ 'type': type, 'count': count }), { headers: this.tokenHeaders })
      .map(res => res.json());
  }

  getDataSingle(type: string, count: number, userId: number) {
    const url = this.userApiUrl + 'getData/' + userId;
    return this.http.post(url, JSON.stringify({ 'type': type, 'count': count }), { headers: this.tokenHeaders })
      .map(res => res.json());
  }

  getAllUsers() {
    const url = this.userApiUrl + 'getData/';
    return this.http.post(url, JSON.stringify({ 'type': 'type', 'count': 'count' }), { headers: this.tokenHeaders })
      .map(res => res.json());
  }

  updatePendingUser(username: string, approved: boolean, setRole: number) {

  }

}
