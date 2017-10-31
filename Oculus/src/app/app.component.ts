import { NavbarService } from './navbar.service';
import { ApiService } from './api.service';
import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NavbarService]
})
export class AppComponent implements AfterViewChecked {
  public route = '';

  constructor(private api: ApiService, public nav: NavbarService, private cdRef: ChangeDetectorRef) {
    nav.routeName.subscribe((value) => this.route = value);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }
}
