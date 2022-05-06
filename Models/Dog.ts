class Dog{
    public Id: string;
    public Name: string;
    public Breed: string;
    public Age: number;
    public Gender: string;
    public IdCenter: string;
    //public Events?: Event[]
    constructor(dog: Dog){
        this.Name = dog.Name;
        this.Breed = dog.Breed;
        this.Age = dog.Age;
        this.Gender = dog.Gender;
        this.IdCenter = dog.IdCenter;
    }
}
export default Dog;