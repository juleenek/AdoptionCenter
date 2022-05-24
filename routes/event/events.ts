import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresUserCenter } from '../../middlewares/requiresUserCenter';
import User from '../../models/User';
import Center from '../../models/Center';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';
const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';

router.get(
  '',
  authentication,
  requiresUserCenter,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center | User;

    const centers: Center[] = await readStorage(storeCentersFile);;
    const users: User[] = await readStorage(storeUsersFile);

    if(decoded.role == 'user'){
      const user: User = users.find(user => user.id === decoded.id) as User;
      const events = user.events;
      if(events === undefined) return res.status(400).send('You don\t have events.');
      return res.status(200).send(events);
    }
    if(decoded.role == 'center'){
      const center: Center = centers.find(center => center.id === decoded.id) as Center;
      const events = center.events;
      if(events === undefined) return res.status(400).send('You don\t have events.');
      return res.status(200).send(events);
    }
  }
);

module.exports = router;
