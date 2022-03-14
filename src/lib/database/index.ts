import Database from 'better-sqlite3';
import dotenv from 'dotenv';

import setupExecution from './databaseSetup';

dotenv.config();

const db = new Database(process.env.DATABASE_PATH, {});
const scripts = setupExecution();
db.exec(scripts);

export default db;
