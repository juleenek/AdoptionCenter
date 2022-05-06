import { Request, Response } from 'express'
import uniqid from 'uniqid'
import Center from '../Models/Center'
import Dog from '../Models/Dog'
import Event from '../Models/Event'
import { Service } from '../Service/service'
const express = require('express');
const router = express.Router();
const app = express()
app.use(express.json())

const service = new Service();
//PATHS
const CenterPath = 'Data/storeCenters.json';

//GET SHOW CENTER BY ID
router.get('/:id', async (req: Request, res: Response) =>{
    const centers = await service.readStorage(CenterPath);
    const id = req.params.id;
    //const center = centers.find((center) => center.Id === id); 
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