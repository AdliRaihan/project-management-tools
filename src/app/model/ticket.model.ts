

interface modelerObj {
    deserializer(input:any): this
}

export class ticketModel implements modelerObj {
    tasks: any
    deserializer(input: any): this {
        Object.assign(this, input)
        return this
    }
}
