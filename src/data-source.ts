import { DataSource } from 'typeorm';
import 'dotenv/config'; // Load environment variables from .env file
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3000;

export const Connection = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['./src/models/*.ts'],
});
