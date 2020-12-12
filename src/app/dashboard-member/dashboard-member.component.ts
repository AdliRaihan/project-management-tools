import { Component, OnInit, Injectable, ViewChild, ElementRef, Testability, Input } from '@angular/core';
import { Observable } from 'rxjs';

import './dashboard-member.model';

import { dashboardTicketModel, subTicketModel } from './dashboard-member.model';
import { ticketModel } from '../model/ticket.model'
import { HttpClient, HttpRequest } from '@angular/common/http';
import { faEdit, faPlus, faBuilding, faCertificate, faDatabase, faAngleDown, faClock, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faApple, faAndroid, faAngular } from '@fortawesome/free-brands-svg-icons';
import { userComponents } from '../service/user.components';
import { __spreadArrays } from 'tslib';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard-member',
  // template: '<div> maintenance </div>',
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
    "faClock": faClock,
    "faCheck": faCheck
  }

  // Model
  service: dashboardMemberService
  ticketMaster: Array<String> = new Array()
  subTicketModel: Array<String>
  conditionSubTicket: Boolean = false
  addNewTicket: Boolean = true
  elementSelected: HTMLElement;

  detailTicketsModel: Array<ticketModel> = new Array<ticketModel>()
  selectedTicket: ticketModel;

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
    ticketSub: new FormControl(''),
    ticketDescription: new FormControl(''),
    ticketPlatform: new FormControl('')
  })

  constructor(private http: HttpClient) {
    this.service = new dashboardMemberService(this.http)
  }

  ngOnInit(): void {
    this.getDetailTasksForm()
    // this.service.sendNowPATCH()
  }

  getDetailTasksForm() {
    var wSelf = this;
    
    firebase.database().ref('ticket/project/example_project/detail_tickets/').on('value', (snapshot) => {
      snapshot.forEach(e => {

        var masterConstructor = snapshot.val()[e.key]
        if (wSelf.detailTicketsModel.length > 0) {
          wSelf.detailTicketsModel = []
        }

        if (wSelf.ticketMaster.length == 0) {
          wSelf.ticketMaster.push(e.key)
        } else {
          wSelf.ticketMaster.map( (value,index,array) => {
            if (value != e.key) {
              alert(e.key)
              wSelf.ticketMaster.push(e.key)
            }
         })
        }

        for (const key in masterConstructor) {
          if (Object.prototype.hasOwnProperty.call(masterConstructor, key)) {
            const element = masterConstructor[key];
            var ticketSingleModel = new ticketModel()
            ticketSingleModel.deserializer(element)
            ticketSingleModel.UID = key
            wSelf.detailTicketsModel.push(ticketSingleModel)
          }
        }
      })
    })
  }

  selectSpecificTicket(e: number) {
    this.selectedTicket = this.detailTicketsModel[e]
    console.warn(this.detailTicketsModel[e])
    // firebase.database().ref('ticket/project/example_project/detail_tickets/backlog/'+ e).remove()
  }

  addNewTicket_Action() {
    this.outLetTicketsModalForm.isModalOpen = !this.outLetTicketsModalForm.isModalOpen;
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

  addTicketTo (row, section) {
    var documentAdd = document.getElementById("boxTicket-add-" + row);
    if (documentAdd.style.display === "none") {
      documentAdd.style.display = 'block';
    } else {
      documentAdd.style.display = "none"
    }

    var documentTitleInput = document.getElementById("newTicketTitle")
    var documentDescriptionInput = document.getElementById("newTicketDescription")
    documentTitleInput.addEventListener("input", this.onInputChanges, false)
  }

  onInputChanges(e) {
    // console.warn(e.target.value)
  }

  onFocusInput(e:string) {
    var element = document.getElementById(e)
    if (e == "newTicketTitle") {
      element.innerHTML = ""
    } else if (e == "newTicketDescription") {
      element.innerHTML = ""
    }
  }

  onFocusOut(e:string) {
    var element = document.getElementById(e)
    var elementValue = element.innerHTML
    if ((elementValue == "" || elementValue == "Input Title") && e == "newTicketTitle") {
      element.innerHTML = "Input Title"
    } else if ((elementValue == "" || elementValue == "Input Description") && e == "newTicketDescription") {
      element.innerHTML = "Input Description"
    }
  }

  addNewTicket_Push() {
    var documentTitleInput = document.getElementById("newTicketTitle")
    var documentDescriptionInput = document.getElementById("newTicketDescription")
    // Validation
    if (this.addNewTicket_Push_Validation("newTicketTitle") || this.addNewTicket_Push_Validation("newTicketDescription")) {
      
    } else {
      // value
      const titleValue = documentTitleInput.innerHTML
      const descriptionValue = documentDescriptionInput.innerHTML.replace("&nbsp;","")
      // Value + Json Request
      var ticketDetails = { tpdName: titleValue, tpdDescriptor: descriptionValue, tpdPlatform: "none"};
      this.service.sendNewTicket(ticketDetails)
    }
  }

  addNewTicket_Push_Validation(e:string) {
    var element = document.getElementById(e)
    var elementValue = element.innerHTML
    if ((elementValue == "" || elementValue == "Input Title") && e == "newTicketTitle") {
      element.innerHTML = "Input Title"
      this.setFieldError(e,false)
      return true
    } else if ((elementValue == "" || elementValue == "Input Description") && e == "newTicketDescription") {
      element.innerHTML = "Input Description"
      this.setFieldError(e,false)
      return true
    }
    alert(elementValue)
    return false
  }

}

@Injectable()
export class dashboardMemberService {

  detailTicketsModel: ticketModel = new ticketModel()

  constructor(private http: HttpClient) { }
  allTicketURL = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/ticket_project.json"
  ticketObject(): Observable<firebase.firestore.DocumentData> {
    return this.http.get<firebase.firestore.DocumentData>(this.allTicketURL, { responseType: 'json' });
  }

  sendExampleTasks = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/detail_tickets/"
  sendExampleTasksPATCH = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/detail_tickets.json"
  sendSubTicketData =  "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/sub_ticket_form.json"
  sendNowPATCH() { 
    var ticketSubTasks = [
      {
        sbTasksName: "benerin Bug!",
        sbTasksDone: false,
      }
    ]
    var ticketDetails =
    {
      tpdName: "adli raihan testing",
      tpdDescriptor: "descriptor25",
      tpdPlatform: "platformTest26",
      tpdSubTasks: ticketSubTasks
    };

    var httpRequest = new HttpRequest("POST", this.sendExampleTasks + "backlog.json", {
      tasks : ticketDetails
    })
    this.http.request(httpRequest).subscribe({
      complete() {
        console.warn("sukses")
      }
    })

  }

  sendNewSubTicket() {
    // var ticketSubTasks = [
    //   {
    //     sbTasksName: "benerin Bug!",
    //     sbTasksDone: false,
    //   }
    // ]
    // var ticketDetails =
    // {
    //   tpdName: "adli raihan testing",
    //   tpdDescriptor: "descriptor25",
    //   tpdPlatform: "platformTest26",
    //   tpdSubTasks: ticketSubTasks
    // };
    var httpRequest = new HttpRequest("PATCH", this.sendExampleTasks + "needToFix.json", {

    })
    this.http.request(httpRequest).subscribe({
      complete() {
        alert();
      }
    })
  }

  sendNewTicket(request: any) {
    var httpRequest = new HttpRequest("POST", this.sendExampleTasks + "backlog.json", {
      tasks: request
    })
    this.http.request(httpRequest).subscribe({
      complete() {
        console.warn("sukses")
      }
    })
  }

  // getDetailTickets(): Promise<firebase.database.DataSnapshot> {
  //   firebase.database().ref('ticket/project/example_project/detail_tickets/').on('value', (data) => {
  //     return data
  //   })
  // }

  getDetailTicketsBySub(sub: string): Promise<firebase.database.DataSnapshot> {
    return firebase.database().ref('ticket/project/example_project/detail_tickets/' + sub).once('value')
  }

}

export class modelText {
  username = "";
}
