import { getDatabase } from './database.js';

export async function findOrders(email = '') {
  const db = getDatabase();
  let query = 'SELECT * FROM orders';
  const params = {};

  if (email) {
    query += ' WHERE customer_email = :email';
    params.email = String(email).trim().toLowerCase();
  }

  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(params);
}

export async function findOrderById(id) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM orders WHERE id = :id LIMIT 1').get({ id });
}

export async function insertOrder(orderRecord) {
  const db = getDatabase();
  return db.prepare(`
    INSERT INTO orders (
      id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      payment_method,
      total,
      status,
      items_json,
      created_at
    ) VALUES (
      :id,
      :customer_name,
      :customer_email,
      :customer_phone,
      :shipping_address,
      :city,
      :payment_method,
      :total,
      :status,
      :items_json,
      :created_at
    )
  `).run(orderRecord);
}
