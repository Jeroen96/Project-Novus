import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class LoginService {
  private apiUrl = 'http://jberk.nl/userApi/';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private accessToken = '';
  private jwtHelper: JwtHelper = new JwtHelper();
  public userRights: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public username: string;

  constructor(private http: Http) { }

  login(username: string, password: string) {
    const url = this.apiUrl + 'login';
    return this.http.post(url, JSON.stringify({ 'username': username, 'password': password }), { headers: this.headers })
      .map(res => res.json());
  }

  register(username: string, password: string) {
    const url = this.apiUrl + 'createAccount';
    return this.http.post(url, JSON.stringify({ 'username': username, 'password': password }), { headers: this.headers })
      .map(res => res.json());
  }

  // Receive acces token, decode and set the token, username and userRight properties.
  setAccessToken(token: string) {
    this.accessToken = token;
    const decoded = this.jwtHelper.decodeToken(token);
    this.username = decoded.iss;
    this.userRights.next(decoded.usr);
  }

  checkAccessTokenAvailable() {
    if (this.accessToken !== '') {
      return true;
    }
    return false;
  }

  getAccessToken() {
    return this.accessToken;
  }
}
