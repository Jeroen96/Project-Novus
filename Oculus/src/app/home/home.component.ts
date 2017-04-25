import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public test: Array<any> = ['Simply hue', 'Planner', 'Energy monitor', 'test1', 'kappa'];

  constructor() { }

  ngOnInit() {
  }

}
