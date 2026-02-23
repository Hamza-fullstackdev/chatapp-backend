import { readFileSync } from 'node:fs';
import { Pool } from 'pg';
import { config } from '../config/env.config.js';

const runSQL = async () => {
  const adminPool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  });

  try {
    await adminPool.query(`CREATE DATABASE "${config.DB_DATABASE}"`);
    console.log(`Database "${config.DB_DATABASE}" created.`);
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`Database "${config.DB_DATABASE}" already exists, skipping creation.`);
    } else {
      console.error('Error creating database:', error);
      await adminPool.end();
      return;
    }
  } finally {
    await adminPool.end();
  }

  const appPool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
  });

  try {
    const sql = readFileSync('src/database/chatapp.sql', 'utf8');
    await appPool.query(sql);
    console.log('SQL file executed successfully.');
  } catch (error: any) {
    console.error('Error executing SQL:', error);
  } finally {
    await appPool.end();
  }
};

runSQL();
