import { NextFunction, Request, Response } from 'express';
import Center from '../models/Center';
import User from '../models/User';
import { JwtPayload } from 'jsonwebtoken';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export const requiresUserCenter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token) as JwtPayload as Center | User;
    if (decoded.role === 'center' || decoded.role === 'user') return next();
    return res.status(403).send('User or Center role is required.');
  } catch (err) {
    console.log(err);
    res.status(403).send('User or Center role is required.');
  }
};
