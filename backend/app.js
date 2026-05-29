import { createServer } from 'node:http';
import { getDatabaseConfig, initializeDatabase } from './models/database.js';
import { seedProductsIntoDatabase } from './models/productModel.js';
import { handleHealth } from './controllers/healthController.js';
import { handleListCategories, handleGetProductById, handleListProducts } from './controllers/productController.js';
import { handleCreateOrder, handleGetOrderById, handleListOrders } from './controllers/orderController.js';
import { handleCreateContactMessage, handleListContactMessages } from './controllers/contactController.js';
import { handleLogin, handleRegister } from './controllers/authController.js';
import { sendJson, sendNoContent } from './utils/http.js';

async function dispatch(handler, context) {
  try {
    await handler(context);
  } catch (error) {
    sendJson(context.response, error.statusCode ?? 500, {
      error: error.message ?? 'Internal server error'
    });
  }
}

function matchPath(pathname, pattern) {
  const match = pathname.match(pattern);
  return match ? match.groups ?? {} : null;
}

export async function startServer() {
  await initializeDatabase();
  await seedProductsIntoDatabase();

  const port = Number(process.env.PORT ?? 3000);

  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const { pathname } = url;
    const method = request.method ?? 'GET';

    if (method === 'OPTIONS') {
      sendNoContent(response);
      return;
    }

    if (pathname === '/api/health' && method === 'GET') {
      await dispatch(handleHealth, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/categories' && method === 'GET') {
      await dispatch(handleListCategories, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/products' && method === 'GET') {
      await dispatch(handleListProducts, { request, response, url, params: {} });
      return;
    }

    const productMatch = matchPath(pathname, /^\/api\/products\/(?<id>[^/]+)$/);
    if (productMatch && method === 'GET') {
      await dispatch(handleGetProductById, { request, response, url, params: productMatch });
      return;
    }

    if (pathname === '/api/orders' && method === 'GET') {
      await dispatch(handleListOrders, { request, response, url, params: {} });
      return;
    }

    const orderMatch = matchPath(pathname, /^\/api\/orders\/(?<id>[^/]+)$/);
    if (orderMatch && method === 'GET') {
      await dispatch(handleGetOrderById, { request, response, url, params: orderMatch });
      return;
    }

    if (pathname === '/api/orders' && method === 'POST') {
      await dispatch(handleCreateOrder, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/contact-messages' && method === 'GET') {
      await dispatch(handleListContactMessages, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/contact-messages' && method === 'POST') {
      await dispatch(handleCreateContactMessage, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      await dispatch(handleRegister, { request, response, url, params: {} });
      return;
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      await dispatch(handleLogin, { request, response, url, params: {} });
      return;
    }

    sendJson(response, 404, { error: 'Route not found' });
  });

  server.listen(port, () => {
    console.log(`MotoRepuestos API running on http://localhost:${port}`);

    const databaseConfig = getDatabaseConfig();
    if (databaseConfig.client === 'mysql') {
      console.log(`Database: MySQL ${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`);
      return;
    }

    console.log(`Database file: ${databaseConfig.path}`);
  });

  return server;
}
