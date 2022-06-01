import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage, updateStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresUser } from '../../middlewares/requiresUser';
import { requiresCenter } from '../../middlewares/requiresCenter';
import { requiresUserCenter } from '../../middlewares/requiresUserCenter';
import { eventValidation } from '../../helpers/validation';
import { findCenterByDog } from '../../helpers/helperFunctions';

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

// Add event (only Users can)
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

    // Validation
    const event: Event = req.body as Event;
    const { error } = eventValidation(event);
    if (error) return res.status(400).send('Valid event data.');

    try {
      const user: User = users.find(
        (user) => user.id === userDecode.id
      ) as User;
      if (user === undefined) return res.status(400).send('Invalid token.');

      // Parameters of Event
      event.id = uniqid();
      event.userId = user.id;
      event.isAccepted = false;

      // Trycatch because of function findCenterByDog();
      try {
        const center: Center = findCenterByDog(dogs, centers, event, res);

        center.events.push(event);
        user.events.push(event);
        events.push(event);

        await updateStorage<Event>(storeEventsFile, events);
        await updateStorage<Center>(storeCentersFile, centers);
        await updateStorage<User>(storeUsersFile, users);
        res.status(201).send(event);
      } catch (error) {
        return;
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// Get Event details by Id
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

    try {
      const center: Center = findCenterByDog(dogs, centers, event, res);

      // Only Center and User that has this Event
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
    } catch (error) {
      return;
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
    try {
      const center: Center = findCenterByDog(dogs, centers, newEvent, res);

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
    } catch (error) {
      return;
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

    const user: User = users.find((user) => user.id === event.userId) as User;
   try {
    const center: Center = findCenterByDog(dogs, centers, event, res);

    if (
      (decoded.role === 'user' && decoded.id === event.userId) ||
      (decoded.role === 'center' && decoded.id === center.id)
    ) {
      if (decoded == undefined) {
        res.status(404).send("This user or center doesn't exist.");
      } else {
        // --- Usunięcie Eventu z tablic Centrów

        // Wszystkie Eventy oprócz tego, który ma zostać usunięty
        const newEvents = events.filter((n: any) => n.id !== req.params.id);

        // Wszystkie Eventy w tym Centrum
        const allEventsInsideCenter = centers.reduce(
          (prev: any, next: any) => prev.concat(next.events),
          []
        );
        // Index Eventu, który jest do usunięcia
        const eventInsideCenter = allEventsInsideCenter.indexOf(
          allEventsInsideCenter.find((obj: any) => obj.id === event.id)
        );

        // Wszystkie Centra oprócz tego, w którym znajduje się Event
        const newCenters = centers.filter((n: any) => n.id !== center.id);

        // Nowe Centrum bez Eventu tego do usunięcia
        const newCenter = centers.find(
          (n: any) => n.id === center.id
        ) as Center;
        newCenter.events.splice(eventInsideCenter, 1);

        // --- Usunięcie Eventu z tablic Uzytkowników

        // Wszystkie Eventy Uzytkownika
        const allEventsInsideUser = users.reduce(
          (prev: any, next: any) => prev.concat(next.events),
          []
        );

        // Index Eventu, który jest do usunięcia
        const eventInsideUser = allEventsInsideUser.indexOf(
          allEventsInsideUser.find((obj: any) => obj.id === event.id)
        );

        //  Wszyscy Uzytkownicy oprócz tego, w którym znajduje się Event
        const newUsers = users.filter((n: any) => n.id !== user.id);
        console.log(newUsers);
        // Nowy Uzytkownik bez Eventu tego do usunięcia
        const newUser = users.find((n: any) => n.id === user.id) as User;
        newUser.events.splice(eventInsideUser, 1);

        await updateStorage(storeEventsFile, [...newEvents]);
        await updateStorage(storeCentersFile, [...newCenters, newCenter]);
        await updateStorage(storeUsersFile, [...newUsers, newUser]);
        res.status(200).send('Event deleted.');
      }
    } else {
      res.status(400).send("You can't delete this event.");
    }
   } catch (error) {
     return;
   }
  }
);

router.put(
  '/accept/:id',
  authentication,
  requiresCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center;

    const centers: Center[] = await readStorage(storeCentersFile);
    const users: User[] = await readStorage(storeUsersFile);
    const dogs: Dog[] = await readStorage(storeDogsFile);
    const events: Event[] = await readStorage(storeEventsFile);

    let event: Event = events.find(
      (event) => event.id === req.params.id
    ) as Event;

    if (event === undefined)
      return res.status(400).send('There is no event with the given id');

    const user: User = users.find((user) => user.id === event.userId) as User;
    try {
      const center: Center = findCenterByDog(dogs, centers, event, res);

    if (decoded == undefined) {
      res.status(404).send("This user or center doesn't exist.");
    } else {
      const eventAccepted = event;
      eventAccepted.isAccepted = true;

      event = Object.assign(event, eventAccepted);

      let userEvent = user.events.find((e) => e.id === event.id) as Event;
      userEvent = Object.assign(userEvent, eventAccepted);

      let centerEvent = center.events.find((e) => e.id === event.id) as Event;
      centerEvent = Object.assign(centerEvent, eventAccepted);

      await updateStorage<Event>(storeEventsFile, events);
      await updateStorage<Center>(storeCentersFile, centers);
      await updateStorage<User>(storeUsersFile, users);
      res.status(201).send(eventAccepted);
    }
    } catch (error) {
     return; 
    }
  }
);

router.put(
  '/cancel/:id',
  authentication,
  requiresCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center;

    const centers: Center[] = await readStorage(storeCentersFile);
    const users: User[] = await readStorage(storeUsersFile);
    const dogs: Dog[] = await readStorage(storeDogsFile);
    const events: Event[] = await readStorage(storeEventsFile);

    let event: Event = events.find(
      (event) => event.id === req.params.id
    ) as Event;

    if (event === undefined)
      return res.status(400).send('There is no event with the given id');

    const user: User = users.find((user) => user.id === event.userId) as User;

    try {
      const center: Center = findCenterByDog(dogs, centers, event, res);

      if (decoded == undefined) {
        res.status(404).send("This user or center doesn't exist.");
      } else {
        const eventAccepted = event;
        eventAccepted.isAccepted = false;
  
        event = Object.assign(event, eventAccepted);
  
        let userEvent = user.events.find((e) => e.id === event.id) as Event;
        userEvent = Object.assign(userEvent, eventAccepted);
  
        let centerEvent = center.events.find((e) => e.id === event.id) as Event;
        centerEvent = Object.assign(centerEvent, eventAccepted);
  
        await updateStorage<Event>(storeEventsFile, events);
        await updateStorage<Center>(storeCentersFile, centers);
        await updateStorage<User>(storeUsersFile, users);
        res.status(201).send(eventAccepted);
      }
    } catch (error) {
      return;
    }
  }
);

module.exports = router;
