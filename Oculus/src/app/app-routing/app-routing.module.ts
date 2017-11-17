import { LoginGuardService } from './login-guard.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './../login/login.component';
import { DownloadsComponent } from './../downloads/downloads.component';
import { UserComponent } from './../Energie-Monitor/user/user.component';
import { DashboardComponent } from './../Energie-Monitor/dashboard/dashboard.component';
import { ControlPanelComponent } from './../control-panel/control-panel.component'

import { HomeComponent } from './../home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
  { path: 'em', pathMatch: 'full', redirectTo: '/em/dashboard', canActivate: [AuthGuardService] },
  { path: 'em/dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'em/dashboard/:id', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'controlPanel', component: ControlPanelComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, LoginGuardService]
})
export class AppRoutingModule {
}
