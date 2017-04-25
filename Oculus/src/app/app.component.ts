import { WebApiService } from './web-api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public route = '';
  constructor(private webApi: WebApiService) {
    webApi.routeName.subscribe((value) => this.route = value);
  }
}
