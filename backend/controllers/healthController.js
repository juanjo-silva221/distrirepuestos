import { getProductsCount } from '../services/productService.js';
import { sendJson } from '../utils/http.js';

export async function handleHealth({ response }) {
  const products = await getProductsCount();

  sendJson(response, 200, {
    status: 'ok',
    database: 'connected',
    products
  });
}
