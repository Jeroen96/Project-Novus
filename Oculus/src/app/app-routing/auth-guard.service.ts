import { Router, CanActivate } from '@angular/router';
import { LoginService } from './../login/login.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate() {
    if (this.loginService.checkAccessTokenAvailable()) { return true; }
    this.router.navigate(['/login']);
    return false;
  }
 }
