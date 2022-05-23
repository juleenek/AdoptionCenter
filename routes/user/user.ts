import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readStorage, updateStorage } from '../../services/service';
import { authentication } from '../../middlewares/authentication';
import { requiresUserAdmin } from '../../middlewares/requiresUserAdmin';
import { registerUserValidation } from '../../helpers/validation';
import User from '../../models/User';

const express = require('express');
const router = express.Router();
const app = express();

const jwt = require('jsonwebtoken');
const _ = require('lodash');
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';

// User data can be viewed by admin or the user who wants to view his data
router.get(
  '/:id',
  authentication,
  requiresUserAdmin,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decodedUser: User = jwt.decode(token) as JwtPayload as User;

    if (decodedUser.role === 'admin' || decodedUser.id === req.params.id) {
      const users = await readStorage(storeUsersFile);
      const id = req.params.id;
      const user = users.find((user) => user.id === id);
      if (user == undefined) {
        res.status(404).send("This user doesn't exist.");
      } else {
        res.status(200).send(user);
      }
    } else {
      res.status(400).send("You can't see details of this user.");
    }
  }
);

router.put(
  '/:id',
  authentication,
  requiresUserAdmin,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decodedUser: User = jwt.decode(token) as JwtPayload as User;

    const users: User[] = await readStorage(storeUsersFile);

    // If there is a user with the given ID
    if (users.some((user) => user.id === req.params.id)) {
      let oldUser = users.find((user) => user.id === req.params.id) as User;
      const newUser: User = req.body;

      const { error } = registerUserValidation(newUser);
      if (error) return res.status(400).send('Invalid data, try again.');

      newUser.id = req.params.id;
      newUser.role = oldUser.role;

      // If data has not been changed
      if (_.isEqual(oldUser, newUser))
        return res.status(400).send('The data is the same as before.');

      // If logged in user is admin
      if (decodedUser.role == 'admin') {
        oldUser = Object.assign(oldUser, newUser);
        updateStorage(storeUsersFile, users);
        res.status(201).send(newUser);
      }
      if (decodedUser.role == 'user') {
        // If logged in user changes his own data
        if (decodedUser.id == newUser.id) {
          oldUser = Object.assign(oldUser, newUser);
          updateStorage(storeUsersFile, users);
          res.status(201).send(newUser);
        } else {
          return res
            .status(400)
            .send("You can't change data that isn't yours.");
        }
      }
    } else {
      return res.status(400).send("User with that id doesn't exist.");
    }
  }
);

router.delete(
  '/:id',
  authentication,
  requiresUserAdmin,
  async (req: Request, res: Response) => {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decodedUser: User = jwt.decode(token) as JwtPayload as User;

    const users: User[] = await readStorage(storeUsersFile);

    if (users.some((user) => user.id === req.params.id)) {
      let userToDelete = users.find(
        (user) => user.id === req.params.id
      ) as User;
      userToDelete.id = req.params.id;

      if (decodedUser.role == 'admin') {
        users.splice(users.findIndex((user) => user.id === req.params.id));
        updateStorage(storeUsersFile, users);
        res.status(201).send('User deleted.');
      }
      if (decodedUser.role == 'user') {
        if (decodedUser.id == userToDelete.id) {
          users.splice(users.findIndex((user) => user.id === req.params.id));
          updateStorage(storeUsersFile, users);
          res.status(201).send('User deleted.');
        } else {
          return res.status(400).send("You can't delete someone's account.");
        }
      }
    } else {
      return res.status(400).send("User with that id doesn't exist.");
    }
  }
);

module.exports = router;
