import { DownloadsComponent } from './../downloads/downloads.component';
import { UserComponent } from './../Energie-Monitor/user/user.component';
import { DashboardComponent } from './../Energie-Monitor/dashboard/dashboard.component';
import { LoginComponent } from './../Energie-Monitor/login/login.component';

import { HomeComponent } from './../home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  { path: 'em', pathMatch: 'full', redirectTo: '/em/dashboard' },
  { path: 'em/login', component: LoginComponent },
  { path: 'em/dashboard', component: DashboardComponent },
  { path: 'em/dashboard/:id', component: UserComponent },
  { path: 'downloads', component: DownloadsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
