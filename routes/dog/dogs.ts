import { Request, Response } from 'express';
import Dog from '../../models/Dog';
import { readStorage } from '../../services/service';
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

//PATHS
const DogPath = 'Data/storeDogs.json';

//GET SHOW CENTER LIST
router.get('', async (req: Request, res: Response) => {
  const dogs = await readStorage(DogPath);
  if (dogs == undefined) {
    res.status(404).send('There are no centers.');
  } else {
    res.status(200).send(dogs);
  }
});

module.exports = router;
