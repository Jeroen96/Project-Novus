import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class LoginService {
  private apiUrl = 'https://treepi.dynu.net/api/';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private accessToken = '';
  private jwtHelper: JwtHelper = new JwtHelper();
  public userRights: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public username: string;

  constructor(private http: Http) { }

  login(username: string, password: string) {
    const url = this.apiUrl + 'login';
    return this.http.post(url, JSON.stringify({ 'gebruikersnaam': username, 'wachtwoord': password }), { headers: this.headers })
      .map(res => res.json());
  }

  register(username: string, password: string) {
    const url = this.apiUrl + 'register';
    return this.http.post(url, JSON.stringify({ 'username': username, 'password': password }), { headers: this.headers })
      .map(res => res.json());
  }

  // Receive acces token, decode and set the token and userRight properties.
  setAccessToken(token: string) {
    this.accessToken = token;
    // const decodedToken = this.jwtHelper.decodeToken(token);
    // const splittedString: string[] = decodedToken.data.split(';', 2);
    // this.userRights.next(Number(splittedString[1]));
    // this.username = splittedString[0];
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
