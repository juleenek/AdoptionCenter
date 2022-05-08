import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET)
    return next()
}
catch (err) {
    res.sendStatus(401)
}
}
