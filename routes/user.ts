import { Request, Response } from 'express';
import { readStorage } from '../service/service';
import {authenticateToken} from '../verifyToken';

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.get('/:id', async (req: Request, res: Response) => {
  // ToDo: jeśli zalogowany użytkownik jest adminem
  const users = await readStorage(storeUsersFile);
  const id = req.params.id;
  const user = users.find((user) => user.id === id);
  if (user == undefined) {
    res.status(404).send("This center doesn't exist.");
  } else {
    res.status(200).send(user);
  }
});

module.exports = router;
 