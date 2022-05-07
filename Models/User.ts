class User{
  public id: string;
  public login: string;
  public name: string;
  public isAdmin: boolean = false;
  public events?: Event[];
  public surname: string;

  constructor(user: User){
    this.login = user.login;
    this.name = user.name;
    this.isAdmin = user.isAdmin;
    this.events = user.events
    this.surname = user.surname;
  }
}
export default User;