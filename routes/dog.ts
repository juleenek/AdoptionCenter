import { Request, Response } from 'express'
import Dog from '../models/Dog'
import { updateStorage, readStorage } from '../services/service'
const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();
const app = express()
app.use(express.json())

//PATHS
const DogPath = 'Data/storeDogs.json';

//GET SHOW CENTER BY ID
router.get('/:id', async (req: Request, res: Response) =>{
    const dogs = await readStorage(DogPath);
    const id = req.params.id;
    const dog = dogs.find((dog) => dog.id === id); 
    if(dog == undefined)
    {
        res.status(404).send("This dog doesn't exist.");
    }
    else
    {
        res.status(200).send(dog);
    }
})
module.exports = router;