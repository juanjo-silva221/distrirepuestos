import { getDatabase } from './database.js';

export async function findUserByEmail(email) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM users WHERE email = :email LIMIT 1').get({ email });
}

export async function insertUser(userRecord) {
  const db = getDatabase();
  return db.prepare(`
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (:name, :email, :password_hash, :created_at)
  `).run(userRecord);
}
