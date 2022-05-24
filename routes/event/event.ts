import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage, updateStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresUser } from '../../middlewares/requiresUser';
import { requiresUserCenter } from '../../middlewares/requiresUserCenter';
import { eventValidation } from '../../helpers/validation';
import User from '../../models/User';
import Dog from '../../models/Dog';
import Event from '../../models/Event';
import Center from '../../models/Center';

const express = require('express');
const router = express.Router();
const app = express();

const uniqid = require('uniqid');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
app.use(express.json());

const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';
const storeDogsFile = '../AdoptionCenter/Data/storeDogs.json';
const storeEventsFile = '../AdoptionCenter/Data/storeEvents.json';
const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.post(
  '',
  authentication,
  requiresUser,
  async (req: Request, res: Response) => {
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
      const user: User = users.find(
        (user) => user.id === userDecode.id
      ) as User;
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
  }
);

router.get(
  '/:id',
  authentication,
  requiresUserCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center | User;

    const centers: Center[] = await readStorage(storeCentersFile);
    const dogs: Dog[] = await readStorage(storeDogsFile);
    const events: Event[] = await readStorage(storeEventsFile);

    const event: Event = events.find(
      (event) => event.id === req.params.id
    ) as Event;
    if (event === undefined)
      return res.status(400).send('There is no event with the given id');

    const dog: Dog = dogs.find((dog) => dog.id === event.dogId) as Dog;
    if (dog === undefined)
      return res.status(400).send('There is no dog with the given id');

    const center: Center = centers.find(
      (center) => center.id === dog.idCenter
    ) as Center;
    if (center === undefined)
      return res.status(400).send('Dog has unknown center.');

    if (
      (decoded.role === 'user' && decoded.id === event.userId) ||
      (decoded.role === 'center' && decoded.id === center.id)
    ) {
      if (decoded == undefined) {
        res.status(404).send("This user or center doesn't exist.");
      } else {
        res.status(200).send(event);
      }
    } else {
      res.status(400).send("You can't see details of this event.");
    }
  }
);

router.put(
  '/:id',
  authentication,
  requiresUser,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decodedUser = jwt.decode(token) as JwtPayload as User;

    const centers: Center[] = await readStorage(storeCentersFile);
    const users: User[] = await readStorage(storeUsersFile);
    const dogs: Dog[] = await readStorage(storeDogsFile);
    const events: Event[] = await readStorage(storeEventsFile);

    const newEvent: Event = req.body;
    let oldEvent: Event = events.find(
      (event) => event.id === req.params.id
    ) as Event;

    const user: User = users.find((user) => user.id === decodedUser.id) as User;
    if (user === undefined) return res.status(400).send('Invalid token.');

    const dog: Dog = dogs.find((dog) => dog.id === newEvent.dogId) as Dog;
    if (dog === undefined)
      return res.status(400).send('There is no dog with the given id');

    const center: Center = centers.find(
      (center) => center.id === dog.idCenter
    ) as Center;
    if (center === undefined)
      return res.status(400).send('Dog has unknown center.');

    if (oldEvent === undefined)
      return res.status(400).send('There is no event with the given id');

    // If data has not been changed
    if (_.isEqual(oldEvent, newEvent))
      return res.status(400).send('The data is the same as before.');

    if (oldEvent.userId === decodedUser.id) {
      oldEvent = Object.assign(oldEvent, newEvent);

      let centerEvent = center.events.find(
        (e) => e.id === oldEvent.id
      ) as Event;
      centerEvent = Object.assign(centerEvent, oldEvent);

      let userEvent = user.events.find((e) => e.id === oldEvent.id) as Event;
      userEvent = Object.assign(userEvent, oldEvent);

      await updateStorage<Event>(storeEventsFile, events);
      await updateStorage<Center>(storeCentersFile, centers);
      await updateStorage<User>(storeUsersFile, users);
      res.status(201).send(newEvent);
    } else {
      return res.status(400).send("You can't change event that isn't yours.");
    }
  }
);

router.delete(
  '/:id',
  authentication,
  requiresUserCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center | User;

    const centers: Center[] = await readStorage(storeCentersFile);
    const dogs: Dog[] = await readStorage(storeDogsFile);
    const events: Event[] = await readStorage(storeEventsFile);
    const users: User[] = await readStorage(storeUsersFile);

    const event: Event = events.find(
      (event) => event.id === req.params.id
    ) as Event;
    if (event === undefined)
      return res.status(400).send('There is no event with the given id');

    const dog: Dog = dogs.find((dog) => dog.id === event.dogId) as Dog;
    if (dog === undefined)
      return res.status(400).send('There is no dog with the given id');

    const center: Center = centers.find(
      (center) => center.id === dog.idCenter
    ) as Center;
    if (center === undefined)
      return res.status(400).send('Dog has unknown center.');

    if (
      (decoded.role === 'user' && decoded.id === event.userId) ||
      (decoded.role === 'center' && decoded.id === center.id)
    ) {
      if (decoded == undefined) {
        res.status(404).send("This user or center doesn't exist.");
      } else {
        // events.splice(events.findIndex((e) => e.id === event.id));

        // const user: User | undefined = users.find((user) =>
        //   user.events.find((e) => e.id === event.id)
        // );
        // console.log(user);
        // console.log(user);

        // if (decoded.role === 'user') {
        //   const user: User = users.find(
        //     (user) => user.id === decoded.id
        //   ) as User;
        //   user.events.splice(user.events.findIndex((e) => e.id === event.id));
        // } else if (decoded.role === 'center') {
        //   const center: Center = centers.find(
        //     (c) => c.id === decoded.id
        //   ) as Center;
        //   center.events.splice(
        //     center.events.findIndex((e) => e.id === event.id)
        //   );
        // }
        await updateStorage<Event>(storeEventsFile, events);
        await updateStorage<Center>(storeCentersFile, centers);
        await updateStorage<User>(storeUsersFile, users);
        res.status(200).send('Event deleted');
      }
    } else {
      res.status(400).send("You can't delete this event.");
    }
  }
);

// // Center search by dog id
// const centerSearch = (
//   dogs: Dog[],
//   centers: Center[],
//   event: Event,
//   res: Response
// ): Center | Response<any, Record<string, any>> => {
//   // Adding an event only if the dog's id is in the store file
//   const dog: Dog = dogs.find((dog) => dog.id === event.dogId) as Dog;
//   if (dog === undefined)
//     return res.status(400).send('There is no dog with the given id');

//   // Adding an event only if the center's id is in the store file
//   const center: Center = centers.find(
//     (center) => center.id === dog.idCenter
//   ) as Center;
//   if (center === undefined)
//     return res.status(400).send('Dog has unknown center.');

//   return center;
// };

module.exports = router;
