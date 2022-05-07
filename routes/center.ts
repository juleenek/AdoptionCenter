import { Request, Response } from 'express'
import Center from '../models/Center'
import Dog from '../models/Dog'
import Event from '../models/Event'
import { updateStorage, readStorage } from '../service/service'
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
    const center = centers.find((center) => center.id === id); 
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
    const centers: any = await readStorage(CenterPath);
    const center: Center = req.body;

    const name = (center.centerName = center.centerName.toLowerCase());
    const findSameName = centers.find(((x: any) => x.centerName == name))

    const { error } = registerCenterValidation(center);
    if (error) return res.status(400).send('Invalid data, try again.');

    if(findSameName){
    return res.status(400).send("This center already exists.");
    }
    else{
    center.id = uniqid();
    await updateStorage(CenterPath, [...centers, center]);
    return res.status(201).send(center);
    }
})

//PUT UPDATE CENTER DATA(ADMIN)
router.put('/:id', async(req: Request, res: Response) =>{
    const centers: any = await readStorage(CenterPath);
    const newCenter: Center = req.body;
    const oldCenter = centers.find((center: any) => center.id === req.params.id)

    const name = (newCenter.centerName = newCenter.centerName.toLowerCase());
    const findSameName = centers.find(((x: any) => x.centerName == name))

    const centerIndex: number = centers.findIndex((n: any) => n.id === req.params.id)
    const { error } = registerCenterValidation(newCenter);

    if (error) return res.status(400).send('Invalid data, try again.');
    if(oldCenter == undefined){
    return res.status(404).send("This center doesn't exist.");
    }

    if(findSameName && req.params.id != oldCenter.id){
        console.log(centerIndex);
        res.status(404).send("This center doesn't exist.");
    }
    else{
        console.log(centerIndex);
        await updateStorage(CenterPath, [...centers, centers[centerIndex] = newCenter]);
        return res.status(201).send(newCenter);
    }
})
module.exports = router;