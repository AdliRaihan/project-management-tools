
// import {Deserializable} from '@angular/'

interface modelerObj {
    deserializer(input:any): this
}

export class ticketModel implements modelerObj {

    tasks: tasks

    deserializer(input: any): this {
        Object.assign(this, input)
        return this
    }
    
}

class tasks implements modelerObj {

    ticketProjectId: number
    ticketProjectDetail: [ticketProjectDetail]

    deserializer(input: any): this {
        Object.assign(this, input)
        return this
    }
}

class ticketProjectDetail implements modelerObj {

    tpdName: String
    tpdDescriptor: String
    tpdSubTasks: String
    tpdPlatform: String

    deserializer(input: any): this {
        Object.assign(this, input)
        return this
    }
}