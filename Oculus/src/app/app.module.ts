import { MkApiService } from './Energie-Monitor/mk-api.service';
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
import { WebApiService } from './web-api.service';
import { HomeComponent } from './home/home.component';

import { UserComponent } from './Energie-Monitor/user/user.component';
import { DashboardComponent } from './Energie-Monitor/dashboard/dashboard.component';
import { LoginComponent } from './Energie-Monitor/login/login.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    AppRoutingModule,
    ChartsModule,
  ],
  providers: [WebApiService, MkApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
