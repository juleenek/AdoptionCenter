import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresAdmin } from '../../middlewares/requiresAdmin';
import User from '../../models/User';

const express = require('express');
const router = express.Router();
const app = express();

const jwt = require('jsonwebtoken');
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

router.get(
  '',
  authentication,
  requiresAdmin,
  async (req: Request, res: Response) => {
    const users = await readStorage(storeUsersFile);
    if(users == undefined)
    {
        res.status(404).send("There are no users.");
    }
    else
    {
        res.status(200).send(users);
    }
  }
);

module.exports = router;