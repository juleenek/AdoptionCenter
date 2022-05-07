import { Request, Response } from 'express';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export const authenticateToken = (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw Error('Authorization header not found');
    const token: string = authHeader && authHeader.split(' ')[1];
    if (token === null || token === undefined) res.sendStatus(401);
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    res.sendStatus(400).send('Invalid Token');
  }
};
