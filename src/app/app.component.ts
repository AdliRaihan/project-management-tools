import { Component, OnInit } from '@angular/core';
import { globalComponents } from './service/global.component';
import { faBookmark, faEye, faUserPlus, faCogs, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  faBriefcase = faBookmark;
  faEye = faEye;
  faUserPlus = faUserPlus;
  faCogs = faCogs;
  faSignOut = faSignOutAlt;
  faBell = faBell;
  title = 'project-management-system';
  currentUser;

  services: globalComponents;
  authenticated:boolean;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.services = new globalComponents()
    this.doCheckSomething()
  }

  doCheckSomething() {
    console.warn("Check Auth ")
    var weakSelf = this;
    this.services.checkAuthSubject.subscribe({
      next(value) {
        weakSelf.authenticated = value
      }
    })

    this.services.checkUserEmailSubject.subscribe( {
      next(value) {
        var userName = value.split("@");
        weakSelf.currentUser = userName[0];
      }
    })
  } 

  doLogoutAddListener() {
    this.services.userSessionCheckAuth()
  }

  logout() {
    this.services.userSessionLogout()
  }

}
