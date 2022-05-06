import {Request, Response} from "express";
class Event{
    public Id: string;
    public DogId: string;
    public UserId: string;
    public Date: Date;
    public IsAccepted: boolean;
    public Message?: string;
    
    constructor(event?: Event){
        this.Date = event.Date;
        this.IsAccepted = event.IsAccepted;
        this.Message = event.Message;
    }
}
export default Event;