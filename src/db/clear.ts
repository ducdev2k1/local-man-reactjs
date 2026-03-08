import { db } from './database';

async function clearDB() {
  await db.delete();
  console.log('Database deleted successfully');
}

clearDB();
