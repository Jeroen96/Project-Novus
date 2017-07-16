import { LoginService } from './../login/login.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
// Prevents the user from going back to the login screen after loggin in
export class LoginGuardService implements CanActivate {

  constructor(private loginService: LoginService) { }

  canActivate() {
    if (this.loginService.checkAccessTokenAvailable()) { return false; }
    return true;
  }

}
