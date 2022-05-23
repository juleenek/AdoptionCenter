import { Request, Response } from 'express';
import Dog from '../../models/Dog';
import Event from '../../models/Event';
import Center from '../../models/Center';
import { updateStorage, readStorage } from '../../services/service';
import { registerDogValidation } from '../../helpers/validation';
import { authentication } from '../../middlewares/authentication';
import { requiresCenter } from '../../middlewares/requiresCenter';
import { JwtPayload } from 'jsonwebtoken';
import { filterDog } from '../../helpers/filter';

const jwt = require('jsonwebtoken');
const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();
const app = express();
app.use(express.json());

//PATHS
const DogPath = 'Data/storeDogs.json';
const CenterPath = 'Data/storeCenters.json';

//GET SHOW DOGS BY FILTERS
router.get('', (req: Request, res: Response) => {
  const filters: any = req.query;
  filterDog(filters, res);
});

//GET SHOW DOG BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const dogs = await readStorage(DogPath);
  const id = req.params.id;
  const dog = dogs.find((dog) => dog.id === id);
  if (dog == undefined) {
    res.status(404).send("This dog doesn't exist.");
  } else {
    res.status(200).send(dog);
  }
});

//POST ADD DOG(CENTER)
router.post(
  '',
  authentication,
  requiresCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const center: Center = jwt.decode(token) as JwtPayload as Center;

    const dogs = await readStorage(DogPath);
    const centers: any = await readStorage(CenterPath);

    const dog: Dog = req.body;
    const newCenters = centers.filter(
      (existingCenters: any) => existingCenters.id !== center.id
    );

    const { error } = registerDogValidation(dog);
    if (error) return res.status(400).send('Invalid data, try again.');

    dog.id = uniqid();
    dog.idCenter = center.id;

    const newCenter: Center = centers.find((x: any) => x.id == dog.idCenter);
    newCenter.dogs?.push(dog);

    await updateStorage(DogPath, [...dogs, dog]);
    await updateStorage(CenterPath, [...newCenters, newCenter]);

    return res.status(201).send(dog);
  }
);

//PUT UPDATE DOG(CENTER)
router.put(
  '/:id',
  authentication,
  requiresCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const center: Center = jwt.decode(token) as JwtPayload as Center;

    const dogs: any = await readStorage(DogPath);
    const centers: any = await readStorage(CenterPath);

    const newDogs = dogs.filter((n: any) => n.id !== req.params.id);
    const oldDog = dogs.find((dog: any) => dog.id === req.params.id);
    const newDog: Dog = req.body;

    const { error } = registerDogValidation(newDog);
    if (error) return res.status(400).send('Invalid data, try again.');

    if (oldDog == undefined) {
      return res.status(404).send("This dog doesn't exist.");
    }
    if (center.id != oldDog.idCenter) {
      return res.status(202).send("You can't edit this dog.");
    }

    const allDogsInsideCenter = centers.reduce(
      (prev: any, next: any) => prev.concat(next.dogs),
      []
    );
    const dogInsideCenter = allDogsInsideCenter.indexOf(
      allDogsInsideCenter.find((obj: any) => obj.id === oldDog.id)
    );
    const newCenters = centers.filter((n: any) => n.id !== center.id);
    const newCenter = centers.find((n: any) => n.id === center.id);

    newDog.idCenter = center.id;
    newDog.id = oldDog.id;
    newCenter.dogs[dogInsideCenter] = newDog;

    await updateStorage(DogPath, [...newDogs, newDog]);
    await updateStorage(CenterPath, [...newCenters, newCenter]);
    return res.status(201).send(newDog);
  }
);

//DELETE DELETE A DOG(CENTER)
router.delete(
  '/:id',
  authentication,
  requiresCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const center: Center = jwt.decode(token) as JwtPayload as Center;

    const dogs: any = await readStorage(DogPath);
    const centers: any = await readStorage(CenterPath);

    const newDogs = dogs.filter((n: any) => n.id !== req.params.id);
    const dog = dogs.find((dog: any) => dog.id === req.params.id);

    const allDogsInsideCenter = centers.reduce(
      (prev: any, next: any) => prev.concat(next.dogs),
      []
    );
    const dogInsideCenter = allDogsInsideCenter.indexOf(
      allDogsInsideCenter.find((obj: any) => obj.id === dog.id)
    );
    const newCenters = centers.filter((n: any) => n.id !== center.id);
    const newCenter = centers.find((n: any) => n.id === center.id);

    newCenter.dogs.splice(dogInsideCenter, 1);

    if (dog == undefined) {
      return res.status(404).send("This dog doesn't exist.");
    }
    if (center.id != dog.idCenter) {
      return res.status(202).send("You can't delete this dog.");
    }
    await updateStorage(DogPath, [...newDogs]);
    await updateStorage(CenterPath, [...newCenters, newCenter]);
    return res.status(400).send('Successfully deleted the dog.');
  }
);
module.exports = router;
