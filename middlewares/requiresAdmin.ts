import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { JwtPayload } from 'jsonwebtoken';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export const requiresAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const user: User = jwt.decode(token) as JwtPayload as User;
    
    if (user.role === 'admin') {
      return next();
    }
    return res.status(403).send('Admin role is required.');
  } catch (err) {
    console.log(err);
    res.status(403).send('Admin role is required.');
  }
};
