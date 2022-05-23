import { Request, Response } from 'express';
import Center from '../../models/Center';
import User from '../../models/User';
import { readStorage, updateStorage } from '../../services/service';
import {
  registerValidation,
  loginUserValidation,
  loginCenterValidation,
} from '../../helpers/validation';

// Zrobiłam osobne 'auth', poniewaz nie tylko user będzie się logować, a schronisko równiez
// Haszujemy hasło czy nie ma po co? (npm bcrypt)

const express = require('express');
const router = express.Router();
const app = express();
require('dotenv').config();

const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');

app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';
const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';

/////// Only users register

router.post('/register', async (req: Request, res: Response) => {
  const user: User = req.body;
  const users = await readStorage<User>(storeUsersFile);

  const { error } = registerValidation(user);
  if (error) return res.status(400).send('Valid register.');

  // Check if the user exist
  if (users.some((user) => user.login === req.body.login)) {
    return res.status(400).send({
      error: 'User already exist',
    });
  }

  // Create a new user
  try {
    user.id = uniqid();
    if(req.body.role === undefined) user.role = 'user';
    await updateStorage<User>(storeUsersFile, [...users, user]);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

/////// Users and the centers can log in

router.post('/login', async (req: Request, res: Response) => {
  const users = await readStorage<User>(storeUsersFile);
  const centers = await readStorage<Center>(storeCentersFile);

  // Check if the user exist
  if (
    users.some(
      (user) =>
        user.login === req.body.login && user.password === req.body.password
    )
  ) {
    const { error } = loginUserValidation(req.body);
    if (error) return res.status(400).send('Login or password is wrong.');
    const user: User = users.find(
      (user) =>
        user.login === req.body.login && user.password === req.body.password
    ) as User;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.TOKEN_SECRET
    );
    // console.log(user.role);
    res.status(200).send(token);
  } else if (
    centers.some(
      (center) =>
        center.centerName === req.body.centerName &&
        center.password === req.body.password
    )
  ) {
 
    const { error } = loginCenterValidation(req.body);
    if (error) return res.status(400).send('Login or password is wrong.');
    const center: Center = centers.find(
      (center) =>
        center.centerName === req.body.centerName && center.password === req.body.password
    ) as Center;
    const token = jwt.sign(
      { id: center.id, name: center.centerName },
      process.env.TOKEN_SECRET
    );
    res.status(200).send(token);
  } else {
    return res.status(400).send({
      error: 'Login or password is wrong.',
    });
  }
});

module.exports = router;
