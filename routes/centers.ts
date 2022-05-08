import { Request, Response } from 'express'
import Center from '../models/Center'
import { readStorage } from '../service/service'
const express = require('express');
const router = express.Router();
const app = express()
app.use(express.json())

//PATHS
const CenterPath = 'Data/storeCenters.json';

//GET SHOW CENTER LIST
router.get('', async (req: Request, res: Response) =>{
    const centers = await readStorage(CenterPath);
    if(centers == undefined)
    {
        res.status(404).send("There are no centers.");
    }
    else
    {
        res.status(200).send(centers);
    }
})
module.exports = router;