import {Request, Response} from 'express'
const express = require('express')  
const app = express()
app.use(express.json())

const center = require('../routes/center');
const centers = require('../routes/centers');
const dog = require('../routes/dog');
const dogs = require('../routes/dogs');
const user = require('../routes/user');
const auth = require('../routes/auth');

app.use('/center', center);
app.use('/centers', centers);
app.use('/dog', dog);
app.use('/dogs', dogs);
app.use('/user', user);
app.use('/auth', auth);

app.listen(3000)
