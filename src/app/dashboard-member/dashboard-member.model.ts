import { IterableDiffers } from '@angular/core'
import { initializeApp } from 'firebase'

export class dashboardTicketModel {
    raw_ticket: string
    ticket_header: String
    ticket_lists: _ticketModel
    ticket_detail_description: String
    ticket_assign_by: String
    constructor() {}
    init(response: any) {
        this.ticket_header = response["ticket_header"]
        this.raw_ticket = response["raw_ticket"]
        this.ticket_detail_description = response["ticket_detail_description"]
        this.ticket_assign_by = response["ticket_assign_by"]
        this.ticket_lists = new _ticketModel().init((response["ticket_lists"]))
        return this
    }
}

export class _ticketModel {
    ticket_detail = new Array<_ticketDetail>()
    constructor() {}
    init(response: any) {
        console.warn(response["ticket_detail"])
        Object.values(response["ticket_detail"]).forEach( element => {
            this.ticket_detail.push(new _ticketDetail().init(element))
        })
        return this
    }
}

export class _ticketDetail {
    ticket_description: string = ""
    ticket_checked: boolean = false
    constructor() {}
    init(response: any) {
        this.ticket_checked = response["ticket_checked"]
        this.ticket_description = response["ticket_description"]
        return this
    }
}

export class ticketAssignment {

}

export class dashboardModel {

    ticketDetailsFirstChild: firebase.firestore.DocumentData
    ticketDetailsRaw: firebase.firestore.DocumentData
    ticketName = ""
    ticketAssignModel = new Array<dashboardMemberModel>()
    ticketListsModel = new Array<dashboardMemberTicket>()
    ticketDueDate = ""
    ticketMainDescription = ""

    constructor(private response: firebase.firestore.DocumentData) {
        // Markup Json
        var responseClean = this.response["project_ticket"]

        // Asssign Model
        this.ticketName = responseClean["ticket_name"]
        this.ticketDetailsRaw = responseClean["ticket_details"]
        this.ticketDueDate = this.ticketDetailsRaw["project_ticket_due_date"];
        this.ticketMainDescription = this.ticketDetailsRaw["ticket_number_description"];

        this.ticketDetailsRaw["project_ticket_assigned_to"].forEach(element => {
            this.ticketAssignModel.push(new dashboardMemberModel(element))
        });

        this.ticketDetailsRaw["project_ticket_lists"].forEach(element => {
            this.ticketListsModel.push(new dashboardMemberTicket(element))
        });
    }
}

class dashboardMemberModel {
    memberName = ""
    memberSurname = ""
    constructor(private responseArr: any) {
        this.memberName = responseArr["member_name"];    
    }
}

class dashboardMemberTicket {
    checked = false
    description = ""
    constructor(private responseArr:any) {
        this.checked = responseArr["checked"]
        this.description = responseArr["ticket_description"]
    }
}

// SubTicket
export class subTicketModel {

    subTickets: Array<string> = []

    constructor(json: any) {
        try {
            json['values'].forEach(element => {
                this.subTickets.push(element)
            });
        } catch (exception) {
            
        }
    }
}