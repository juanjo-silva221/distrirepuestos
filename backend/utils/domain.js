import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function safeTrim(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash).split(':');

  if (!salt || !hash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, 64).toString('hex');
  const expected = Buffer.from(hash, 'hex');
  const actual = Buffer.from(derivedHash, 'hex');

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function ensureRequiredFields(fields, data) {
  const record = data ?? {};

  for (const field of fields) {
    if (!safeTrim(record[field])) {
      const error = new Error(`Missing required field: ${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

export function buildTrackingSteps(createdAt, status) {
  const confirmedTime = new Date(createdAt).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isDelivered = status === 'Entregado';
  const steps = [
    'Pedido confirmado',
    'Preparado en bodega',
    'En transito',
    'En reparto',
    'Entregado'
  ];

  return steps.map((label, index) => ({
    label,
    date: index === 0 ? confirmedTime : 'Pendiente',
    completed: isDelivered ? true : index === 0
  }));
}
