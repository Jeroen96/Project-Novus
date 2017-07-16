import { NavbarService } from './../navbar.service';
import { Router } from '@angular/router';
import { ApiService } from './../api.service';
import { LoginService } from './login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginError;
  // tslint:disable-next-line:max-line-length
  constructor(private loginService: LoginService, private api: ApiService, private router: Router, private dialog: MdDialog, private nav: NavbarService) { }

  onLoginButtonClick(name: string, password: string) {
    this.loginService.login(name, password).subscribe(response => {
      this.loginService.setAccessToken(response.token);
      this.api.setHeaders(response.token);
      this.router.navigate(['/home']);
    },
      error => {
        this.loginError = 'Invalid username and/or password credentials';
      });
  }

  ngOnInit() {
    this.nav.setName('Login');
    this.nav.hide();
  }

  ngOnDestroy(): void {
    this.nav.show();
  }

  openAboutDialog() {
    // const dialogRef = this.dialog.open(AboutDialogComponent);
  }

  openCreateDialog() {
    // const dialogRef = this.dialog.open(CreateUserDialogComponent);
  }
}
