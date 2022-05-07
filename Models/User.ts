import Event from '../models/Event';

class User{
  public id: string;
  public login: string;
  public name: string;
  public isAdmin: boolean = false;
  public events?: Event[];
  public surname: string;
  public password: string;

  constructor(user: User){
    this.id = user.id;
    this.login = user.login;
    this.name = user.name;
    this.isAdmin = user.isAdmin;
    this.events = user.events
    this.surname = user.surname;
    this.password = user.password;
  }
}
export default User;