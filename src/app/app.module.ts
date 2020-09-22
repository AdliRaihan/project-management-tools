import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardMemberComponent } from './dashboard-member/dashboard-member.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import * as firebase from 'firebase/app';

@NgModule({
  declarations: [
    AppComponent,
    DashboardMemberComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor() {
    this.setupFirebase()
  }

  setupFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyDV1-mdBBYcnj4_eWeMdRZG5rX2KnqlyYM",
      authDomain: "projectmanagementsystem-59c8d.firebaseapp.com",
      databaseURL: "https://projectmanagementsystem-59c8d.firebaseio.com",
      projectId: "projectmanagementsystem-59c8d",
      storageBucket: "projectmanagementsystem-59c8d.appspot.com",
      messagingSenderId: "149013147364",
      appId: "1:149013147364:web:b9d745ccc4d642504f06f1",
      measurementId: "G-0BYVH7XSYR"
    };  
    firebase.initializeApp(firebaseConfig);
  }

}
