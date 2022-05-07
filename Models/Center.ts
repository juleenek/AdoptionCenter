import {Request, Response} from "express";
import Dog from '../models/Dog';

class Center{
    public Id: string;
    public CenterName: string;
    public City: string;
    public Address: string;
    public Phone: string;
    public Dogs?: Dog[]
    public Events?: Event[]
    public Password: string;
    constructor(center?: Center){
        this.CenterName = center.CenterName;
        this.City = center.City;
        this.Address = center.Address;
        this.Phone = center.Phone;
        this.Password = center.Password;
    }
}
export default Center;