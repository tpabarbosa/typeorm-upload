/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import AppError from './errors/AppError';

import createConnection from './database';

createConnection();
const app = express();

function logRequests(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { method, url } = request;
  const now = new Date(Date.now());
  const logLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} [${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

app.use(express.json());
app.use(logRequests);
app.use(cors());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
