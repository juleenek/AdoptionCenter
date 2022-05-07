import { Request, Response } from 'express';
import User from '../models/User';
const uniqid = require('uniqid');
import { checkRequired } from '../Service/checks';
import { readStorage, updateStorage } from '../service/service';

// Zrobiłam osobne 'auth', poniewaz nie tylko user będzie się logować, a schronisko równiez

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';
const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';
// this.Login = user.Login;
// this.Name = user.Name;
// this.IsAdmin = user.IsAdmin;
// this.Surname = user.Surname;

// Rejestrują się tylko i wyłącznie uzytkownicy
router.post('/register', async (req: Request, res: Response) => {
  const user: User = req.body;
  const users = await readStorage<User>(storeUsersFile);

  checkRequired(user.login, res, 'Please enter a center name.', 400);
  checkRequired(user.name, res, 'Please enter a center city.', 400);
  checkRequired(user.surname, res, 'Please enter a center address.', 400);
  user.id = uniqid();

  try {
    await updateStorage<User>(storeUsersFile, [...users, user]);
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Zalogować się mogą uzytkownicy oraz schronisko
router.post('/login', async (req: Request, res: Response) => {});

module.exports = router;
