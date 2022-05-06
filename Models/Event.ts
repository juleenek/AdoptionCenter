import {Request, Response} from "express";
class Event{
    public Id: number;
    public DogId: number;
    public UserId: number;
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