import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardMemberComponent } from './dashboard-member/dashboard-member.component';
import { LoginComponent } from './login/login.component';
import * as firebase from 'firebase/app';
import 'firebase/auth'

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardMemberComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
