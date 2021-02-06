import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';

import uploadConfig from './config/upload';

import './database';
import AppError from './errors/AppError';

const server = express();

server.use('/files', express.static(uploadConfig.directory));
server.use(express.json());
server.use(cors({}));
server.use(routes);

// Exception Global Handling;
server.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

server.listen(3333);
