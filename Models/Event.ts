
class Event{
    public id: string;
    public dogId: string;
    public userId: string;
    public date: Date;
    public isAccepted: boolean;
    public message?: string;
    
    constructor(event?: Event){
        this.date = event.date;
        this.isAccepted = event.isAccepted;
        this.message = event.message;
    }
}
export default Event;