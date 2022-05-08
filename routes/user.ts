import { Request, Response } from 'express';
import { readStorage } from '../services/service';
import {authentication} from '../middlewares/authentication';
import {requiresAdmin} from '../middlewares/requiresAdmin';

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.get('/:id', authentication, requiresAdmin, async (req: Request, res: Response) => {
  // ToDo: jeśli zalogowany użytkownik jest adminem
  const users = await readStorage(storeUsersFile);
  const id = req.params.id;
  const user = users.find((user) => user.id === id);
  if (user == undefined) {
    res.status(404).send("This user doesn't exist.");
  } else {
    res.status(200).send(user);
  }
});

module.exports = router;
 