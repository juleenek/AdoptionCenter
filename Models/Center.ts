import { Request, Response } from 'express';
import Dog from '../models/Dog';
import Event from '../models/Event';

class Center {
  public id: string;
  public centerName: string;
  public city: string;
  public address: string;
  public phone: string;
  public dogs?: Dog[];
  public events: Event[];
  public password: string;

  constructor(center: Center) {
    this.id = center.id;
    this.centerName = center.centerName;
    this.city = center.city;
    this.events = center.events;
    this.address = center.address;
    this.phone = center.phone;
    this.password = center.password;
  }
}
export default Center;
