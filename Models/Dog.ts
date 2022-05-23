class Dog {
  public id: string;
  public name: string;
  public breed: string;
  public age?: number;
  public gender: string;
  public idCenter: string;
  // public events: Event[];

  constructor(dog: Dog) {
    this.name = dog.name;
    this.breed = dog.breed;
    // this.events = dog.events;
    this.age = dog.age;
    this.gender = dog.gender;
    this.idCenter = dog.idCenter;
  }
}
export default Dog;

// Czy psy potrzebują Eventów?