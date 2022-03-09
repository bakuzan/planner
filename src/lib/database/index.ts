import Database from 'better-sqlite3';
import dotenv from 'dotenv';

import setupExecution from './tables';

dotenv.config();

const db = new Database(process.env.DATABASE_PATH, {});

db.exec(setupExecution);

export default db;
