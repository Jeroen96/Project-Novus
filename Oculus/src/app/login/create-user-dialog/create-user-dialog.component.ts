import { LoginService } from './../login.service';
import { ApiService } from './../../api.service';
import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {
  public errorMsg = '';

  // tslint:disable-next-line:max-line-length
  constructor(public dialogRef: MdDialogRef<CreateUserDialogComponent>, private api: ApiService, private loginService: LoginService, private snackbar: MdSnackBar) { }

  ngOnInit() {
  }

  sendRequest(username: string, passw: string, passwRepeat: string) {
    if (username === '' || passw === '' || passwRepeat === '') {
      this.errorMsg = 'Fields cannot be empty';
    } else {
      if (passw !== passwRepeat) {
        this.errorMsg = 'Passwords do not match';
      } else {
        this.loginService.register(username, passw).subscribe((response) => {
          this.errorMsg = '';
          this.dialogRef.close();
          this.openSnackbar('Account created', 'ok', 2500);
        },
          error => {
            this.errorMsg = '';
            this.openSnackbar('Account already exists', 'ok', 2500);
          });
      }
    }
  }

  openSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, { duration: duration });
  }

}
