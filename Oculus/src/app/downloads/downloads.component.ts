import { NavbarService } from './../navbar.service';
import { ApiService } from './../api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  public apps: Array<any> = ['App 1', 'App 2', 'App 3', 'App 4', 'App 5'];
  public files: Array<any> = ['File 1', 'File 2', 'File 3', 'File 4', 'File 5'];

  constructor(private nav: NavbarService) { }

  ngOnInit() {
    this.nav.setName('Downloads');
  }

}
