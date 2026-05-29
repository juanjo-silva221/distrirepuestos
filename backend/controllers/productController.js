import { listCategories, listProducts, getProductById } from '../services/productService.js';
import { sendJson } from '../utils/http.js';

export async function handleListCategories({ response }) {
  sendJson(response, 200, {
    categories: listCategories()
  });
}

export async function handleListProducts({ response, url }) {
  const products = await listProducts({
    search: url.searchParams.get('search') ?? '',
    category: url.searchParams.get('category') ?? ''
  });

  sendJson(response, 200, {
    products,
    total: products.length
  });
}

export async function handleGetProductById({ response, params }) {
  const productId = Number(params.id);
  const product = Number.isFinite(productId) ? await getProductById(productId) : null;

  if (!product) {
    sendJson(response, 404, { error: 'Product not found' });
    return;
  }

  sendJson(response, 200, { product });
}
