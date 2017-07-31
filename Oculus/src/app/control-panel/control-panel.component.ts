import {Component, OnInit} from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {ApiService} from '../api.service';
import {NavbarService} from '../navbar.service';
import {LoginService} from '../login/login.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  private userRights: number;
  rights = [
    {userValue: 1, userReadValue: 'User'},
    {userValue: 2, userReadValue: 'Admin'}
  ];
  users = [];
  admins = [];
  pending = [];

  // tslint:disable-next-line:max-line-length
  constructor(private api: ApiService, private nav: NavbarService, private loginService: LoginService, private dialog: MdDialog, private snackbar: MdSnackBar) {
    nav.setName('Control Panel');
  }

  ngOnInit() {
    this.loginService.userRights.subscribe((value) => this.userRights = value);
    this.refreshUsers();

  }

  refreshUsers() {
    const users = this.api.getAllUsers().subscribe((response) => {
      // Clear all arrays
      this.pending = [];
      this.admins = [];
      this.users = [];

      // Place all pending users in pending array
      this.pending = response.pending;
      // Place all users in unsorted array and sort on userlevel
      const unsortedArray = response.users;
      unsortedArray.forEach(user => {
        switch (user.role) {
          case 1:
            this.users.push(user);
            break;
          case 2:
            // Remove logged in admin from user list
            if (user.username !== this.loginService.username) {
              this.admins.push(user);
            }
            break;
        }
      });
    });
  }

  updateUser() {

  }

  deleteUser() {

  }

  updatePassword() {
  }


}
