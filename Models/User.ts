class User{
  public Id: string;
  public Login: string;
  public Name: string;
  public IsAdmin: boolean = false;
  public Events?: Event[];
  public Surname: string;

  constructor(user: User){
    this.Login = user.Login;
    this.Name = user.Name;
    this.IsAdmin = user.IsAdmin;
    this.Surname = user.Surname;
  }
}
export default User;