import { Component, OnInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import './dashboard-member.model';

import { dashboardTicketModel } from './dashboard-member.model';
import { HttpClient } from '@angular/common/http';
import { faEdit, faPlus, faBuilding, faCertificate, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faApple, faAndroid, faAngular } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-dashboard-member',
  templateUrl: './dashboard-member.component.html',
  styleUrls: ['./dashboard-member.component.css']
})

export class DashboardMemberComponent implements OnInit {

  // Fa-Icons
  faIcons = {
    "faPlus": faPlus,
    "faBuilding": faBuilding,
    "faCertificate": faCertificate,
    "faApple": faApple,
    "faAndroid": faAndroid,
    "faAngular": faAngular,
    "faDatabase": faDatabase,
    "faEdit": faEdit
  }

  today = "03:00:00 AM"
  service: dashboardMemberService
  ticketModel = new Array<dashboardTicketModel>()
  selectedTicket = 0
  onLoadingDetail = false

  timerWork = 0

  constructor(private http: HttpClient) {
    this.service = new dashboardMemberService(this.http)
  }

  ngOnInit(): void {
    this.getTicket()
    this.startTimer()
  }

  // Service Get Ticket
  getTicket() {
    var ticketInfoDetail = new Array<dashboardTicketModel>()
    this.service.ticketObject().subscribe(
      response => {
        Object.keys(response).forEach( data => {
          ticketInfoDetail.push(new dashboardTicketModel().init((response[data])))
        })
        this.ticketModel = ticketInfoDetail;
      }
    )
  }

  // Ubah Tsk
  mainTasksChange(index: number) {
    var object = document.getElementById("ticketDetilsInfo")

    if (index == this.selectedTicket) {
      this.getTicket()
      return;
    }
    object.animate( [
      { opacity : 1 },
      { opacity : 0 }
    ],{
      duration: 150,
      easing: 'ease-in-out',
      fill: "forwards"
    }).finished.then( () => {
      this.selectedTicket = index
      this.getTicket()
      object.animate ( [
        {opacity: 0},
        {opacity: 1}
      ], { duration: 150, easing: 'ease-in-out',
      fill: "forwards"}).finished.then( () => {
        this.onLoadingDetail = false;
      })
    })
  }

  // Melakukan check tasks
  checking(index: number) {
    var currentState = this.ticketModel[this.selectedTicket].ticket_lists.ticket_detail[index].ticket_checked
    this.ticketModel[this.selectedTicket].ticket_lists.ticket_detail[index].ticket_checked = !currentState
    this.sendChecksToDB()
  }

  sendChecksToDB() {
    var spesificTicket = `https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/ticket_project/${this.ticketModel[this.selectedTicket].raw_ticket}.json`
    console.warn(JSON.stringify(this.ticketModel[this.selectedTicket]))
    this.http.put(spesificTicket, this.ticketModel[this.selectedTicket]).subscribe(subscriber => {
      console.warn(subscriber)
    })
  }

  startTimer() {
    // setInterval(()=> {
    //   this.timerWork += 1
    // }, 1000)
  }

  // UI - Animation
  progressiveBar () {
    var sumChecked = this.ticketModel[this.selectedTicket].ticket_lists.ticket_detail.filter(cb => {
      return cb.ticket_checked == true
    })
    return (sumChecked.length / this.ticketModel[this.selectedTicket].ticket_lists.ticket_detail.length) * 100
  }

}

@Injectable()
export class dashboardMemberService {

  constructor(private http:HttpClient) { }
  allTicketURL = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/ticket_project.json"
  ticketObject(): Observable<firebase.firestore.DocumentData> {
    return this.http.get<firebase.firestore.DocumentData>(this.allTicketURL, { responseType: 'json' });
  }
}

export class modelText {
  username = "";
}
