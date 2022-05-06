import { Request, Response } from 'express'

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

router.get('/:id', (req: Request, res: Response) =>{

});

module.exports = router;