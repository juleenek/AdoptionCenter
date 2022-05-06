import { Request, Response } from 'express'
import Center from '../models/Center'
import Dog from '../models/Dog'
import Event from '../models/Event'
import { updateStorage, readStorage } from '../Service/service'
import { checkRequired } from '../Service/checks';
const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();
const app = express()
app.use(express.json())

//PATHS
const CenterPath = 'Data/storeCenters.json';

//GET SHOW CENTER BY ID
router.get('/:id', async (req: Request, res: Response) =>{
    const centers = await readStorage(CenterPath);
    const id = req.params.id;
    const center = centers.find((center) => center.Id === id); 
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
router.post('', async (req: Request, res: Response) =>{
    const centers = await readStorage(CenterPath);
    const center: Center = req.body;

    checkRequired(center.CenterName, res, 'Please enter a center name.', 400);
    checkRequired(center.City, res, 'Please enter a center city.', 400);
    checkRequired(center.Address, res, 'Please enter a center address.', 400);
    checkRequired(center.Phone, res, 'Please enter a center phone number.', 400);
    checkRequired(center.Password, res, 'Please enter a center password.', 400);

    //const name = (center.CenterName = center.CenterName.toLowerCase());
    center.Id = uniqid();
    await updateStorage(CenterPath, [...centers, center]);
    res.status(201).send(center);
}) 
module.exports = router;