import { Component, OnInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import './dashboard-member.model';

import { dashboardTicketModel, subTicketModel } from './dashboard-member.model';
import { ticketModel } from '../model/ticket.model'
import { HttpClient, HttpRequest } from '@angular/common/http';
import { faEdit, faPlus, faBuilding, faCertificate, faDatabase, faAngleDown } from '@fortawesome/free-solid-svg-icons';
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
    "faEdit": faEdit,
    "faArrowDown": faAngleDown
  }

  selectedCard:String = "Backlog";

  today = "03:00:00 AM"
  service: dashboardMemberService
  ticketModel = new Array<dashboardTicketModel>()
  selectedTicket = 0
  onLoadingDetail = false

  timerWork = 0

  // Model
  subTicketModel: Array<String>
  conditionSubTicket: Boolean = false

  detailTicketsModel: ticketModel = new ticketModel()

  constructor(private http: HttpClient) {
    this.service = new dashboardMemberService(this.http)
  }

  ngOnInit(): void {
    this.startTimer()
    this.getSubTicketForm()
    // this.service.sendExampleDetailTickets()
    this.getDetailTasksForm()
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

  // Worker - [Get Sub Ticket Form]
  changeCard(key:String) {
    this.selectedCard = key
  }

  getSubTicketForm() {
    var wSelf = this;
    this.service.getSubTicketForm().subscribe({
      next(value) {
        wSelf.subTicketModel = new subTicketModel(value).subTickets
        wSelf.conditionSubTicket = true
        wSelf.subTicketModel.length
      }
    })
  }

  getDetailTasksForm() {
    var wSelf = this;
    this.service.getDetailTickets().subscribe( {
      next(value) {
        wSelf.detailTicketsModel.deserializer(value)
        console.warn(wSelf.detailTicketsModel)
        console.log(wSelf.detailTicketsModel.tasks.ticketProjectDetail)
      }
    })
  }
}

@Injectable()
export class dashboardMemberService {

  constructor(private http:HttpClient) { }
  allTicketURL = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/ticket_project.json"
  ticketObject(): Observable<firebase.firestore.DocumentData> {
    return this.http.get<firebase.firestore.DocumentData>(this.allTicketURL, { responseType: 'json' });
  }


  // Scripts
  exampleSubTicketForm = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/sub_ticket_form.json"
  sendExampleResponse() {
    var jsonParam = [
      "backlog",
      "Need To Fix",
      "On Hold Features",
      "Deployment",
      "Setup"
    ]
    var httpRequest = new HttpRequest("PATCH", this.exampleSubTicketForm, {
      values: jsonParam
    })
    this.http.request(httpRequest).subscribe( {
      complete() {
        console.warn("sukses")
      }
    })
  }

  sendExampleTasks = "https://projectmanagementsystem-59c8d.firebaseio.com/ticket/project/example_project/detail_tickets.json"
  sendExampleDetailTickets() {
    var ticketSubTasks = [
      {
        sbTasksName: "benerin Bug!",
        sbTasksDone: false,
      }
    ]
    var ticketDetails = [
      {
        tpdName: "adli raihan testing",
        tpdDescriptor: "descriptor",
        tpdPlatform: "platformTest",
        tpdSubTasks: ticketSubTasks 
      },
      {
        tpdName: "adli raihan testing",
        tpdDescriptor: "descriptor",
        tpdPlatform: "platformTest",
        tpdSubTasks: ticketSubTasks 
      },
      {
        tpdName: "adli raihan testing",
        tpdDescriptor: "descriptor",
        tpdPlatform: "platformTest",
        tpdSubTasks: ticketSubTasks 
      },
      {
        tpdName: "adli raihan testing",
        tpdDescriptor: "descriptor",
        tpdPlatform: "platformTest",
        tpdSubTasks: ticketSubTasks 
      }
  ]
    var jsonParam = {
      ticketProjectId: 0,
      ticketProjectDetail: ticketDetails 
    }
    var httpRequest = new HttpRequest("PATCH", this.sendExampleTasks, {
      tasks: jsonParam
    })
    this.http.request(httpRequest).subscribe( {
      complete() {
        console.warn("sukses")
      }
    })
  }

  getSubTicketForm(): Observable<Object> {
    return this.http.get(this.exampleSubTicketForm)
  }

  getDetailTickets(): Observable<Object> {
    return this.http.get(this.sendExampleTasks)
  }
}

export class modelText {
  username = "";
}