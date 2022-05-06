import {Request, Response} from 'express'
const express = require('express')  
const app = express()
const centers = require('../routing/CenterRouting');
app.use(express.json())

app.use('/center', centers);

app.listen(3000)
