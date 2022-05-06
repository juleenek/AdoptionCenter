import { Request, Response } from 'express'
<<<<<<< HEAD
import Dog from '../models/Dog'
import Event from '../models/Event'

=======
import Center from '../Models/Center'
import Dog from '../Models/Dog'
import Event from '../Models/Event'
import { centers, dogs, events } from '../Service/service'
const uniqid = require('uniqid');
>>>>>>> 799039768bec98eb8131023e5b0571d41236560b
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

//GET SHOW CENTER BY ID
router.get('/:id', (req: Request, res: Response) =>{
    const id = req.params.id;
    const center = centers.find(center => center.Id === id);
    if(center == undefined)
    {
        res.status(404).send("This center doesn't exist.");
    }
    else
    {
        res.status(200).send(center);
    }
})

//POST ADD NEW CENTER(ADMIN)
router.post('', (req: Request, res: Response) =>{
    const center: Center = req.body;
    center.Id = uniqid();
    
}) 
module.exports = router;