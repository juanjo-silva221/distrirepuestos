import { buildTrackingSteps, ensureRequiredFields, parseNumber, safeTrim } from '../utils/domain.js';
import { findOrderById, findOrders, insertOrder } from '../models/orderModel.js';

function mapOrder(row) {
  const items = JSON.parse(row.items_json || '[]');

  return {
    id: row.id,
    date: row.created_at,
    total: row.total,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.shipping_address,
      city: row.city,
      paymentMethod: row.payment_method
    },
    items,
    trackingSteps: buildTrackingSteps(row.created_at, row.status)
  };
}

export async function listOrders(email = '') {
  const rows = await findOrders(email);
  return rows.map(mapOrder);
}

export async function getOrderById(id) {
  const row = await findOrderById(id);
  return row ? mapOrder(row) : null;
}

export async function createOrder(payload) {
  const requestPayload = payload ?? {};
  const customer = requestPayload.customer ?? {};
  const items = Array.isArray(requestPayload.items) ? requestPayload.items : [];

  ensureRequiredFields(['nombre', 'email', 'telefono', 'direccion', 'ciudad'], customer);

  if (items.length === 0) {
    const error = new Error('Order must contain at least one item');
    error.statusCode = 400;
    throw error;
  }

  const normalizedItems = items.map((item) => ({
    name: safeTrim(item.name ?? item.title),
    quantity: Math.max(1, parseNumber(item.quantity, 1)),
    price: Math.max(0, parseNumber(item.price, 0))
  }));

  const total = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const id = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();

  await insertOrder({
    id,
    customer_name: safeTrim(customer.nombre),
    customer_email: safeTrim(customer.email).toLowerCase(),
    customer_phone: safeTrim(customer.telefono),
    shipping_address: safeTrim(customer.direccion),
    city: safeTrim(customer.ciudad),
    payment_method: safeTrim(customer.metodoPago) || 'efectivo',
    total,
    status: 'En preparacion',
    items_json: JSON.stringify(normalizedItems),
    created_at: createdAt
  });

  return getOrderById(id);
}
