import { Pool } from 'pg';
import { config } from './env.config.js';

const db = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
});

export default db;
