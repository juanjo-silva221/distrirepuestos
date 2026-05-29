import { categories } from '../../motorepuestos-app/src/data.js';
import { countProducts, findProductById, findProducts } from '../models/productModel.js';
import { slugify } from '../utils/domain.js';

function mapProduct(row) {
  return {
    id: row.id,
    brand: row.brand,
    title: row.title,
    specs: row.specs,
    price: row.price,
    stock: row.stock,
    category: row.category,
    categorySlug: row.category_slug,
    image: row.image
  };
}

export async function listProducts(filters = {}) {
  const rows = await findProducts(filters);
  return rows.map(mapProduct);
}

export async function getProductById(id) {
  const row = await findProductById(id);
  return row ? mapProduct(row) : null;
}

export function listCategories() {
  return categories.map((category) => ({
    ...category,
    slug: slugify(category.id === 'todos' ? 'todos' : category.label)
  }));
}

export async function getProductsCount() {
  return countProducts();
}
