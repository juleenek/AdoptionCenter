import {Request, Response} from "express";
import Dog from '../models/Dog';

class Center{
    public id: string;
    public centerName: string;
    public city: string;
    public address: string;
    public phone: string;
    public dogs?: Dog[]
    public events?: Event[]
    public password: string;
    constructor(center?: Center){
        this.centerName = center.centerName;
        this.city = center.city;
        this.address = center.address;
        this.phone = center.phone;
        this.password = center.password;
    }
}
export default Center;