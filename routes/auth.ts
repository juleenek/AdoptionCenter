import { Request, Response } from 'express';
import User from '../models/User';
const uniqid = require('uniqid');
import { checkRequired } from '../Service/checks';
import { readStorage, updateStorage } from '../service/service';
import { registerValidation } from '../validation';

// Zrobiłam osobne 'auth', poniewaz nie tylko user będzie się logować, a schronisko równiez

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';
const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';

// Rejestrują się tylko i wyłącznie uzytkownicy
router.post('/register', async (req: Request, res: Response) => {
  const user: User = req.body;
  const users = await readStorage<User>(storeUsersFile);

  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send("Valid register.");

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
