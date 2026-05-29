import { getInsertedId } from '../models/database.js';
import { findContactMessages, insertContactMessage } from '../models/contactMessageModel.js';
import { ensureRequiredFields, safeTrim } from '../utils/domain.js';

function mapMessage(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    createdAt: row.created_at
  };
}

export async function listContactMessages() {
  const rows = await findContactMessages();
  return rows.map(mapMessage);
}

export async function createContactMessage(payload) {
  const requestPayload = payload ?? {};
  ensureRequiredFields(['nombre', 'telefono', 'correo', 'observaciones'], requestPayload);

  const createdAt = new Date().toISOString();
  const result = await insertContactMessage({
    name: safeTrim(requestPayload.nombre),
    phone: safeTrim(requestPayload.telefono),
    email: safeTrim(requestPayload.correo).toLowerCase(),
    message: safeTrim(requestPayload.observaciones),
    created_at: createdAt
  });

  return mapMessage({
    id: getInsertedId(result),
    name: safeTrim(requestPayload.nombre),
    phone: safeTrim(requestPayload.telefono),
    email: safeTrim(requestPayload.correo).toLowerCase(),
    message: safeTrim(requestPayload.observaciones),
    created_at: createdAt
  });
}
