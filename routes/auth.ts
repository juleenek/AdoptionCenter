import { Request, Response } from 'express';
import { readStorage } from '../service/service';

// Zrobiłam osobne 'auth', poniewaz nie tylko user będzie się logować, a schronisko równiez 

const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());

const storeUsersFile = '../AdoptionCenter/Data/storeUsers.json';
const storeCentersFile = '../AdoptionCenter/Data/storeCenters.json';

// Rejestrują się tylko i wyłącznie uzytkownicy
router.post('/register', async (req: Request, res: Response) => {

});

// Zalogować się mogą uzytkownicy oraz schronisko
router.post('/login', async (req: Request, res: Response) => {

});

module.exports = router;