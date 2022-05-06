import { Request, Response } from 'express'
import { readStorage } from '../service/service';

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.get('/:id', async (req: Request, res: Response) =>{
  // ToDo: jeśli zalogowany użytkownik jest adminem
  const users = await readStorage(storeUsersFile);
});

module.exports = router;