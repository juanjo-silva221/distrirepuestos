import { getDatabase } from './database.js';

export async function findContactMessages() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
}

export async function insertContactMessage(messageRecord) {
  const db = getDatabase();
  return db.prepare(`
    INSERT INTO contact_messages (name, phone, email, message, created_at)
    VALUES (:name, :phone, :email, :message, :created_at)
  `).run(messageRecord);
}
