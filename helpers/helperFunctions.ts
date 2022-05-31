import { Response } from 'express';
import User from './../models/User';
import Dog from './../models/Dog';
import Event from './../models/Event';
import Center from './../models/Center';

const express = require('express');
const app = express();
app.use(express.json());

export const findCenterByDog = (
  dogs: Dog[],
  centers: Center[],
  event: Event,
  res: Response
) => {
  // Adding an event only if the dog's id is in the store file
  const dog: Dog = dogs.find((dog) => dog.id === event.dogId) as Dog;
  if (dog === undefined) {
    res.status(400).send('There is no dog with the given id');
  }
  // Adding an event only if the center's id is in the store file
  const center: Center = centers.find(
    (center) => center.id === dog.idCenter
  ) as Center;
  if (center === undefined) {
    res.status(400).send('Dog has unknown center.');
  }
  return center;
};
