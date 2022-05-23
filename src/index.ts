import { Request, Response } from 'express';
const express = require('express');
const app = express();
app.use(express.json());

const center = require('../routes/center/center');
const centers = require('../routes/center/centers');
const dog = require('../routes/dog/dog');
const dogs = require('../routes/dog/dogs');
const user = require('../routes/user/user');
const users = require('../routes/user/users');
const event = require('../routes/event/event');
const auth = require('../routes/auth/auth');

app.use('/center', center);
app.use('/centers', centers);
app.use('/dog', dog);
app.use('/dogs', dogs);
app.use('/user', user);
app.use('/users', users);
app.use('/event', event);
app.use('/auth', auth);

app.listen(3000);
