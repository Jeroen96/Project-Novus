import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NavbarService } from '../navbar.service';
import { LoginService } from '../login/login.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  public userRights: number;
  rights = [
    { userValue: 1, userReadValue: 'User' },
    { userValue: 2, userReadValue: 'Admin' }
  ];
  users = [];
  admins = [];
  pending = [];

  // tslint:disable-next-line:max-line-length
  constructor(private api: ApiService, private navBar: NavbarService, private loginApi: LoginService, private dialog: MatDialog, private snackbar: MatSnackBar) {
    navBar.setName('Control Panel');
  }

  ngOnInit() {
    this.loginApi.userRights.subscribe((value) => this.userRights = value);
    this.refreshUsers();

    // this.dialog.afterAllClosed.subscribe((response) => {
    //   if (this.api.userUpdated) {
    //     this.api.userUpdated = false;
    //     this.refreshUsers();
    //   }
    // });
  }

  openEditUserDialog(userName) {
    // const dialogRef = this.dialog.open(EditUserDialogComponent, { data: userName });
  }

  deleteUser(username) {
    // this.api.deleteUser(username).subscribe((response) => {
    //   this.showSnackbar('User deleted', 'ok', 2500);
    //   this.refreshUsers();
    // });
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
            if (user.username !== this.loginApi.username) {
              this.admins.push(user);
            }
            break;
        }
      });
    });
  }

  acceptUser(username: string, role: number) {
    if (role === undefined) {
      this.showSnackbar('Please fill in a role', 'ok', 2500);
      return;
    }
    // this.api.updatePendingUser(username, true, role).subscribe((response) => {
    //   this.showSnackbar('User accepted', 'ok', 2500);
    //   this.refreshUsers();
    // });
  }

  declineUser(username: string) {
    // this.api.updatePendingUser(username, false, 0).subscribe((response) => {
    //   this.showSnackbar('User declined', 'ok', 2500);
    //   this.refreshUsers();
    // });
  }

  showSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, { duration: duration });
  }
}
