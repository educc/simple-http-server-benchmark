import Database from 'better-sqlite3';

const DB_FILE = process.env.DB_FILE || 'data.db';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    db = new Database(DB_FILE);
  }
  return db;
}

export function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

// Types for the database rows
export interface Person5 {
  id: number;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export interface Person30 {
  id: number;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  field9: string;
  field10: string;
  field11: string;
  field12: string;
  field13: string;
  field14: string;
  field15: string;
  field16: string;
  field17: string;
  field18: string;
  field19: string;
  field20: string;
  field21: string;
  field22: string;
  field23: string;
  field24: string;
  field25: string;
  field26: string;
  field27: string;
  field28: string;
  field29: string;
  field30: string;
}
