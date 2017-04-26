import { WebApiService } from './../../web-api.service';
import { MkApiService } from './../mk-api.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public userId = 0;
  public currentUsage;
  public costs24h;
  public kWh24h;

  // Arrays for day history
  lineChartDataHour: Array<any> = [];
  lineChartLabelsHour: Array<any> = [];
  // Arrays for day history
  lineChartDataDay: Array<any> = [];
  lineChartLabelsDay: Array<any> = [];
  // Arrays for trend history
  lineChartDataTrend: Array<any> = [];
  lineChartLabelTrend: Array<any> = [];

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
    }
  ];

  constructor(private apiService: MkApiService, private webapi: WebApiService, private route: ActivatedRoute, private location: Location, private router: Router) { }

  ngOnInit() {
    // Route Guard
    if (!this.apiService.getAccessToken()) {
      this.router.navigate(['/em/login']);
    }
    this.webapi.updateRouteName('Energy-M User');
    // Get day data
    this.route.params.switchMap((params: Params) => this.apiService.getDataSingle('day', 3, +params['id'])).subscribe(json => {
      this.userId = json.data.userId;
      this.processDayData(json.data.results);
    });
    // Get hour data
    this.route.params.switchMap((params: Params) => this.apiService.getDataSingle('hour', 1, +params['id'])).subscribe(json => {
      this.processHourData(json.data.results);
    });
  }

  clickBackButton() {
    this.location.back();
  }

  processDayData(array: Array<any>) {
    let currentHour = new Date(array[0].tijdstip).getHours();
    let totalPulses = 0;
    const dataArray: Array<any> = [];
    const labelArray: Array<any> = [];
    const dateArray: Array<Date> = [];

    for (let i = 0; i < array.length; i++) {
      const day = new Date(array[i].tijdstip);
      // If hour is different, reset count and push data
      if (day.getHours() !== currentHour) {
        dataArray.push(totalPulses);
        const pastDate = new Date(array[i - 1].tijdstip);
        const timedate = pastDate.getFullYear() + '-' + (pastDate.getMonth() + 1)
          + '-' + pastDate.getDate() + ' ' + pastDate.getHours() + 'h';
        labelArray.push(timedate);
        dateArray.push(pastDate);
        totalPulses = 0;
      }
      // Update pulse count and current hour
      totalPulses += array[i].waarde;
      currentHour = day.getHours();
    }
    // Add remainder of the unfinished hour (if available) to the list
    if (totalPulses > 0) {
      dataArray.push(totalPulses);
      const pastDate = new Date(array[array.length - 1].tijdstip);
      const timedate = pastDate.getFullYear() + '-' + (pastDate.getMonth() + 1)
        + '-' + pastDate.getDate() + ' ' + pastDate.getHours() + 'h';
      labelArray.push(timedate);
      dateArray.push(pastDate);
    }
    // Process trend with the processed days
    this.processTrend(dataArray, dateArray);
    // Convert pulses to kWh
    for (let i = 0; i < dataArray.length; i++) {
      dataArray[i] = dataArray[i] / 1000;
    }
    this.lineChartDataDay = [{ 'data': dataArray, 'label': 'kWh' }];
    this.lineChartLabelsDay = labelArray;

    // Collect kWh from last 24 hours
    let kWhTotal = 0;
    for (let i = dataArray.length - 1; i > dataArray.length - 25; i--) {
      kWhTotal += dataArray[i];
    }
    this.kWh24h = kWhTotal.toFixed(2);
    this.costs24h = (kWhTotal * 0.1833).toFixed(2);
  }

  processTrend(dataArray: Array<any>, dateArray: Array<Date>) {
    const averageData: Array<any> = [];
    const trendLabel: Array<any> = [];

    let dayData: Array<any> = [];
    const startHour = dateArray[0].getHours();
    let daysCount = 0;
    // Init avg data array with 24 items
    for (let idx = 0; idx < 24; idx++) {
      averageData.push(0);
    }
    // Iterate over all hours but the first
    for (let i = 0; i < dataArray.length; i++) {
      if (i > 0) {
        dayData.push(dataArray[i]);
        // If iterated hour is same as start hour, 24h collected.
        if (startHour === (dateArray[i].getHours())) {
          daysCount++;
          for (let ix = 0; ix < averageData.length; ix++) {
            averageData[ix] = averageData[ix] + dayData[ix];
          }
          // empty dayData so it can collect for the next 24 hours
          dayData = [];
        }
      }
    }
    // Divide total by counted days convert to kWh
    for (let i = 0; i < averageData.length; i++) {
      const avg = Math.floor(averageData[i] / daysCount);
      averageData[i] = avg / 1000;
    }
    // Quickfix shift all values +1 hour
    const avgFixData: Array<any> = [];
    for (let i = 0; i < averageData.length; i++) {
      // If at last index set value to index 0
      if (i === averageData.length - 1) {
        avgFixData[0] = averageData[i];
      } else {
        avgFixData[i + 1] = averageData[i];
      }
    }

    for (let i = 0; i < 24; i++) {
      const dateTime = dateArray[i];
      const newDate = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1)
        + '-' + (dateTime.getDate() + daysCount) + ' ' + dateTime.getHours() + 'h';
      trendLabel.push(newDate);
    }
    this.lineChartDataTrend = [{ 'data': avgFixData, 'label': 'kWh' }];
    this.lineChartLabelTrend = trendLabel;
  }

  processHourData(array: Array<any>) {
    const lineChartDataToFill: Array<any> = [];
    const lineChartLabelsToFill: Array<any> = [];

    // Split data from recieved array into seperate arrays for x and y axis
    for (let ix = 0; ix < array.length; ix++) {
      // Convert pulse to Wmin and fill array
      const Wmin = array[ix].waarde * 60;
      lineChartDataToFill.push(Wmin);
      lineChartLabelsToFill.push(array[ix].tijdstip);
    }
    // Assign arrays
    this.lineChartDataHour = [{ 'data': lineChartDataToFill, 'label': 'Wmin' }];
    this.lineChartLabelsHour = lineChartLabelsToFill;
    // Set current usage value
    this.currentUsage = lineChartDataToFill[lineChartDataToFill.length - 1];
  }
}
