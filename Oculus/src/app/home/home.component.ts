import { WebApiService } from './../web-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public apps: Array<any> = ['App 1', 'App 2', 'App 3', 'App 4', 'App 5'];
  public files: Array<any> = ['File 1', 'File 2', 'File 3', 'File 4', 'File 5'];

  constructor(private webApi: WebApiService) { }

  ngOnInit() {
    this.webApi.updateRouteName('Home');
  }

}
