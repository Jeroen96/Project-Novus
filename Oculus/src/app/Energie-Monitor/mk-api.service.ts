import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MkApiService {
  private apiUrl = 'https://treepi.dynu.net/api/';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private accessToken = '';
  private tokenHeader;

  constructor(private http: Http) {
  }

  login(username: string, password: string) {
    const url = this.apiUrl + 'login';
    return this.http.post(url, JSON.stringify({ 'gebruikersnaam': username, 'wachtwoord': password }), { headers: this.headers })
      .map(res => res.json());
  }

  getData(type: string, count: number) {
    const url = this.apiUrl + 'getData';
    return this.http.post(url, JSON.stringify({ 'type': type, 'count': count }), { headers: this.tokenHeader })
      .map(res => res.json());
  }

  getDataSingle(type: string, count: number, userId: number) {
    const url = this.apiUrl + 'getData/' + userId;
    return this.http.post(url, JSON.stringify({ 'type': type, 'count': count }), { headers: this.tokenHeader })
      .map(res => res.json());
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.tokenHeader = new Headers({ 'Content-Type': 'application/json', 'Access-Token': token });
  }

  getAccessToken() {
    if (this.accessToken !== '') {
      return true;
    }
    return false;
  }
}
