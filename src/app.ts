import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { Connection } from './data-source';
import morgan from 'morgan';
import logger from './logger';
import router from './routers/index';
import dotenv from 'dotenv';
import cors from 'cors';
import globalErrorHandling from './api-errors/api-error.controller';
import path from 'path';
const FILE_LOCATION = process.env.FILE_LOCATION || '';

dotenv.config();

const app:express.Application = express();

app.use(cors());

/**
 * connecting to the database using typeorm
 */
Connection.initialize().then(() => {
  logger.info('Data Source has been initialized!');
}).catch((error) => {
  logger.error('Error:  ', error);
});
/**
 * using middleware
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), '/public')));
app.use('/public', express.static('./src/public'));
app.use('/uploads', express.static(path.join(FILE_LOCATION, 'public')));
app.use(express.urlencoded({ extended: true })); // URL parser
app.use('/api', router);

//Global error handling  middleware
app.use(globalErrorHandling);
/**
 * sample route for test server
 */
app.get('/', (req:Request, res:Response) => {
  res.status(200).send('Welcome to Express JS');
});


/**
 *  Error response for unknown route
 */
app.all('*', (req: Request, res: Response) => {
  return res.status(404).json({ status: 404, message: `Can't find ${req.originalUrl} on the server!` });
});


export default app;
