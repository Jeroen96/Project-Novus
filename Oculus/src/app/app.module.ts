import { LoginService } from './login/login.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';

import { ApiService } from './api.service';

import { UserComponent } from './Energie-Monitor/user/user.component';
import { DashboardComponent } from './Energie-Monitor/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { DownloadsComponent } from './downloads/downloads.component';
import { LoginComponent } from './login/login.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    UserComponent,
    DownloadsComponent,
    LoginComponent,
    ControlPanelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    ChartsModule,
  ],
  providers: [ApiService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
