class Dog {
  public id: string;
  public name: string;
  public breed: string;
  public age?: number;
  public gender: string;
  public idCenter: string;

  constructor(dog: Dog) {
    this.name = dog.name;
    this.breed = dog.breed;
    this.age = dog.age;
    this.gender = dog.gender;
    this.idCenter = dog.idCenter;
  }
}
export default Dog;

