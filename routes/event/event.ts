import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage, updateStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresUser } from '../../middlewares/requiresUser';
import { eventValidation } from '../../helpers/validation';
import User from '../../models/User';
import Dog from '../../models/Dog';
import Event from '../../models/Event';
import Center from '../../models/Center';

const express = require('express');
const router = express.Router();
const app = express();

const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
app.use(express.json());

const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';
const storeDogsFile = '../AdoptionCenter/Data/storeDogs.json';
const storeEventsFile = '../AdoptionCenter/Data/storeEvents.json';
const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.post('', requiresUser, async (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization as string;
  const token = authorizationHeader.split(' ')[1];
  const userDecode: User = jwt.decode(token) as JwtPayload as User;

  const centers: Center[] = await readStorage(storeCentersFile);
  const dogs: Dog[] = await readStorage(storeDogsFile);
  const events: Event[] = await readStorage(storeEventsFile);
  const users: User[] = await readStorage(storeUsersFile);

  const event: Event = req.body as Event;
  const { error } = eventValidation(event);

  if (error) return res.status(400).send('Valid event data.');

  try {
    const user: User = users.find((user) => user.id === userDecode.id) as User;
    if (user === undefined) return res.status(400).send('Invalid token.');

    event.id = uniqid();
    event.userId = user.id;
    event.isAccepted = false;

    // Adding an event only if the dog's id is in the store file
    const dog: Dog = dogs.find((dog) => dog.id === event.dogId) as Dog;
    if (dog === undefined)
      return res.status(400).send('There is no dog with the given id');

    // Adding an event only if the center's id is in the store file
    const center: Center = centers.find(
      (center) => center.id === dog.idCenter
    ) as Center;
    if (center === undefined)
      return res.status(400).send('Dog has unknown center.');

    center.events.push(event);
    user.events.push(event);
    events.push(event);

    await updateStorage<Event>(storeEventsFile, events);
    await updateStorage<Center>(storeCentersFile, centers);
    await updateStorage<User>(storeUsersFile, users);
    res.status(200).send(event);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
