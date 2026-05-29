import { products as seedProducts } from '../../motorepuestos-app/src/data.js';
import { getDatabase, isMysqlMode } from './database.js';
import { slugify } from '../utils/domain.js';

export async function seedProductsIntoDatabase() {
  const db = getDatabase();
  const statement = isMysqlMode()
    ? `
      INSERT INTO products (id, brand, title, specs, price, stock, category, category_slug, image)
      VALUES (:id, :brand, :title, :specs, :price, :stock, :category, :category_slug, :image)
      ON DUPLICATE KEY UPDATE
        brand = VALUES(brand),
        title = VALUES(title),
        specs = VALUES(specs),
        price = VALUES(price),
        stock = VALUES(stock),
        category = VALUES(category),
        category_slug = VALUES(category_slug),
        image = VALUES(image)
    `
    : `
      INSERT INTO products (id, brand, title, specs, price, stock, category, category_slug, image)
      VALUES (:id, :brand, :title, :specs, :price, :stock, :category, :category_slug, :image)
      ON CONFLICT(id) DO UPDATE SET
        brand = excluded.brand,
        title = excluded.title,
        specs = excluded.specs,
        price = excluded.price,
        stock = excluded.stock,
        category = excluded.category,
        category_slug = excluded.category_slug,
        image = excluded.image
    `;

  const preparedStatement = db.prepare(statement);

  for (const product of seedProducts) {
    await preparedStatement.run({
      ...product,
      category_slug: slugify(product.category)
    });
  }
}

export async function findProducts({ search, category }) {
  const db = getDatabase();
  let query = 'SELECT * FROM products WHERE 1 = 1';
  const params = {};

  if (search) {
    query += ' AND (LOWER(title) LIKE :search OR LOWER(brand) LIKE :search OR LOWER(specs) LIKE :search)';
    params.search = `%${String(search).trim().toLowerCase()}%`;
  }

  if (category && category !== 'todos') {
    query += ' AND category_slug = :category';
    params.category = slugify(category);
  }

  query += ' ORDER BY id ASC';

  return db.prepare(query).all(params);
}

export async function findProductById(id) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM products WHERE id = :id LIMIT 1').get({ id });
}

export async function countProducts() {
  const db = getDatabase();
  const result = await db.prepare('SELECT COUNT(*) AS count FROM products').get();
  return Number(result?.count ?? 0);
}
