import { Component, OnInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import './dashboard-member.model';

import { dashboardTicketModel, subTicketModel } from './dashboard-member.model';
import { ticketModel } from '../model/ticket.model'
import { HttpClient, HttpRequest } from '@angular/common/http';
import { faEdit, faPlus, faBuilding, faCertificate, faDatabase, faAngleDown, faClock, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faApple, faAndroid, faAngular } from '@fortawesome/free-brands-svg-icons';
import { userComponents } from '../service/user.components';
import { __spreadArrays } from 'tslib';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-member',
  templateUrl: './dashboard-member.component.html',
  styleUrls: ['./dashboard-member.component.css'],
  // template: '<div>maintenance</div><button (click)="this.service.sendNowPATCH()">PATCH NOW</button>'
})

export class DashboardMemberComponent implements OnInit {

  // Fa-Icons
  faIcons = {
    "faPlus": faPlus,
    "faSearch": faSearch,
    "faCertificate": faCertificate,
    "faApple": faApple,
    "faAndroid": faAndroid,
    "faAngular": faAngular,
    "faDatabase": faDatabase,
    "faEdit": faEdit,
    "faArrowDown": faAngleDown,
    "faClock": faClock
  }

  // Model
  service: dashboardMemberService
  subTicketModel: Array<String>
  conditionSubTicket: Boolean = false
  addNewTicket: Boolean = true

  detailTicketsModel: Array<ticketModel> = new Array<ticketModel>()

  outLetTicketsModalForm = {
    name: "modalFormTicket",
    isModalOpen: false,
    formOutlet: {
      ticketName: "ticketName",
      ticketDescription: "ticketDescription",
      ticketPlatform: "ticketPlatform"
    }
  }

  subticketForm = new FormGroup({
    ticketName: new FormControl(''),
    ticketDescription: new FormControl(''),
    ticketPlatform: new FormControl('')
  })

  constructor(private http: HttpClient) {
    this.service = new dashboardMemberService(this.http)
  }

  ngOnInit(): void {
    this.getDetailTasksForm()
  }

  getDetailTasksForm() {
    var wSelf = this;
    this.service.getDetailTickets().then(snapshot => {
      snapshot.forEach(e => {
        var ticketSingleModel = new ticketModel()
        ticketSingleModel.deserializer(snapshot.val()[e.key])
        console.log(snapshot.val()[e.key])
        wSelf.detailTicketsModel.push(ticketSingleModel)
      })
    })
  }

  addNewTicket_Action() {
    var valueTranslate = {
      before: "",
      after: ""
    }
    var valueBoolean = !this.outLetTicketsModalForm.isModalOpen
    if (valueBoolean) {
      this.outLetTicketsModalForm.isModalOpen = valueBoolean
      valueTranslate.before = 'translate(120%,0%)'
      valueTranslate.after = 'translate(0%,0%)'
    } else {
      valueTranslate.after = 'translate(120%,0%)'
      valueTranslate.before = 'translate(0%,0%)'
    }
    document.getElementById(this.outLetTicketsModalForm.name).style.transform = valueTranslate.before
    document.getElementById(this.outLetTicketsModalForm.name).animate([
      { transform: valueTranslate.before },
      { transform: valueTranslate.after }
    ], {
      duration: 250,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).finished.then(_ => {
      this.outLetTicketsModalForm.isModalOpen = valueBoolean
    })
  }

  addNewTicket_Publish() {
    if (this.subticketForm.value.ticketName !== "" && this.subticketForm.value.ticketDescription !== "") {
      var ticketSubTasks = [
        {
          sbTasksName: "benerin Bug!",
          sbTasksDone: false,
        }
      ]
      var ticketDetails = {
        tpdName: this.subticketForm.value.ticketName,
        tpdDescriptor: this.subticketForm.value.ticketDescription,
        tpdPlatform: "none",
        tpdSubTasks: ticketSubTasks
      };
      this.service.sendNewTicket(ticketDetails)
    } else {
      this.setFieldError(this.outLetTicketsModalForm.formOutlet.ticketName, this.subticketForm.value.ticketName)  
      this.setFieldError(this.outLetTicketsModalForm.formOutlet.ticketDescription, this.subticketForm.value.ticketDescription) 
    }
  }

  setDefault(otName:string) {
    var field = document.getElementById(otName)
  }

  setFieldError (outletName : string, didValid: boolean) {
    var elemStylus = {borderColor: (didValid) ? 'red' : 'rgba(0,0,0,.1)',borderColorAfter: (didValid) ? 'rgba(0,0,0,.1)' : 'red'};var field = document.getElementById(outletName);if (field.style.borderColor != 'red') {field.animate([{},{borderColor: elemStylus.borderColorAfter}],{duration: 250,easing: 'ease-in-out',fill: 'forwards'})}}
}

@Injectable()
export class dashboardMemberService {

  detailTicketsModel: ticketModel = new ticketModel()

  constructor(private http: HttpClient) { }
  allTicketURL = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/ticket_project.json"
  ticketObject(): Observable<firebase.firestore.DocumentData> {
    return this.http.get<firebase.firestore.DocumentData>(this.allTicketURL, { responseType: 'json' });
  }

  sendExampleTasks = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/detail_tickets.json"
  sendExampleTasksPATCH = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/detail_tickets.json"
  sendNowPATCH() {
    var ticketSubTasks = [
      {
        sbTasksName: "benerin Bug!",
        sbTasksDone: false,
      }
    ]
    var ticketDetails =
    {
      tpdName: "adli raihan testing24",
      tpdDescriptor: "descriptor25",
      tpdPlatform: "platformTest26",
      tpdSubTasks: ticketSubTasks
    };

    var httpRequest = new HttpRequest("POST", this.sendExampleTasks, {
      tasks: ticketDetails
    })
    this.http.request(httpRequest).subscribe({
      complete() {
        console.warn("sukses")
      }
    })

  }

  sendNewTicket(request: any) {
    var httpRequest = new HttpRequest("POST", this.sendExampleTasks, {
      tasks: request
    })
    this.http.request(httpRequest).subscribe({
      complete() {
        console.warn("sukses")
      }
    })
  }

  getDetailTickets(): Promise<firebase.database.DataSnapshot> {
    return firebase.database().ref('ticket/project/example_project/detail_tickets/').once('value')
  }

}

export class modelText {
  username = "";
}
