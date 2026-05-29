import { getInsertedId } from '../models/database.js';
import { findUserByEmail, insertUser } from '../models/userModel.js';
import { ensureRequiredFields, hashPassword, safeTrim, verifyPassword } from '../utils/domain.js';

export async function registerUser(payload) {
  const requestPayload = payload ?? {};
  ensureRequiredFields(['name', 'email', 'password'], requestPayload);

  const name = safeTrim(requestPayload.name);
  const email = safeTrim(requestPayload.email).toLowerCase();
  const password = String(requestPayload.password);

  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const createdAt = new Date().toISOString();
  const result = await insertUser({
    name,
    email,
    password_hash: hashPassword(password),
    created_at: createdAt
  });

  return {
    id: getInsertedId(result),
    name,
    email
  };
}

export async function loginUser(payload) {
  const requestPayload = payload ?? {};
  ensureRequiredFields(['email', 'password'], requestPayload);

  const email = safeTrim(requestPayload.email).toLowerCase();
  const password = String(requestPayload.password);

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
