import { NextFunction, Request, Response } from 'express';
import Center from '../models/Center';
import { JwtPayload } from 'jsonwebtoken';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export const requiresCenter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const center: Center = jwt.decode(token) as JwtPayload as Center;
    return next();
  } catch (err) {
    console.log(err);
    res.status(403).send('Center role is required.');
  }
};
