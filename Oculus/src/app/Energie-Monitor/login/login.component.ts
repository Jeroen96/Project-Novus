import { MkApiService } from './../mk-api.service';
import { WebApiService } from './../../web-api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginError;
  constructor(private webApi: WebApiService, private mkApi: MkApiService, private router: Router) { }

  onLoginButtonClick(name: string, password: string) {
    this.mkApi.login(name, password).subscribe(response => {
      this.mkApi.setAccessToken(response.token);
      this.router.navigate(['em/dashboard']);
    },
      error => {
        this.loginError = 'Invalid username and/or password credentials';
      });
  }

  ngOnInit() {
    this.webApi.updateRouteName('Energy-M Login');
  }

}
