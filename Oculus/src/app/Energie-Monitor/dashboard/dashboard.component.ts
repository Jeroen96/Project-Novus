import { NavbarService } from './../../navbar.service';
import { ApiService } from './../../api.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // LineChartData (y-axis) default array
  public lineChartDataJer: Array<any> = [];
  // LineChartData (y-axis) Wmin format
  public lineChartDataJerW: Array<any> = [];
  // LineChartData (y-axis) pulse format
  public lineChartDataJerP: Array<any> = [];
  // LineChartLabels (x-axis)
  public lineChartLabelsJer: Array<any> = [];
  // lineChart settings
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: '#2980b9',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#2c3e50',
      pointHoverBackgroundColor: 'rgba(148,159,177,1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }, { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(77,83,96,0.7)',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  togglePulse = false;
  constructor(private api: ApiService, private nav: NavbarService, private router: Router) { }

  ngOnInit() {
    this.nav.setName('Enery-M Dashboard');
    this.api.getData('hour', 1).subscribe(res => {
      this.procesData(res.data);
      this.clickPulseToggle(this.togglePulse);
    });
  }

  clickRefreshButton() {
    this.api.getData('hour', 1).subscribe(res => {
      this.procesData(res.data);
      setTimeout(() => this.clickPulseToggle(this.togglePulse), 50);
    });
  }

  clickPulseToggle(togglePulse: boolean) {
    this.togglePulse = togglePulse;
    if (togglePulse) {
      this.lineChartDataJer = this.lineChartDataJerP;
    } else {
      this.lineChartDataJer = this.lineChartDataJerW;
    }
  }

  clickControlButton(id: number) {
    this.router.navigate(['/em/dashboard', id]);
  }

  procesData(array: Array<any>) {
    // Iterate over array with 3 user objects
    for (let i = 0; i < array.length; i++) {
      const userid = array[i].userId;
      const lineChartDataToFillW: Array<any> = [];
      const lineChartDataToFillP: Array<any> = [];
      const lineChartLabelsToFill: Array<any> = [];

      const resultArray: Array<any> = array[i].results;
      // Split data from recieved array into seperate arrays for x and y axis
      for (let ix = 0; ix < resultArray.length; ix++) {
        // Fill array with raw pulse data
        lineChartDataToFillP.push(resultArray[ix].waarde);
        // Convert pulse to Wmin and fill array
        const Wmin = resultArray[ix].waarde * 60;
        lineChartDataToFillW.push(Wmin);
        lineChartLabelsToFill.push(resultArray[ix].tijdstip);
      }
      // Assign correct array based on user id
      switch (userid) {
        case 1:
          this.lineChartDataJerW = [{ 'data': lineChartDataToFillW, 'label': 'Wmin' }];
          this.lineChartDataJerP = [{ 'data': lineChartDataToFillP, 'label': 'pulse(s)' }];
          this.lineChartLabelsJer = lineChartLabelsToFill;
          break;
      }
    }
  }
}
