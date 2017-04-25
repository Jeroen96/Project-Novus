import { WebApiService } from './../../web-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private webApi: WebApiService) { }

  ngOnInit() {
    this.webApi.updateRouteName('Energie Monitor Login');
  }

}
