import { createOrder, getOrderById, listOrders } from '../services/orderService.js';
import { readJsonBody, sendJson } from '../utils/http.js';

export async function handleListOrders({ response, url }) {
  sendJson(response, 200, {
    orders: await listOrders(url.searchParams.get('email') ?? '')
  });
}

export async function handleGetOrderById({ response, params }) {
  const order = await getOrderById(params.id);

  if (!order) {
    sendJson(response, 404, { error: 'Order not found' });
    return;
  }

  sendJson(response, 200, { order });
}

export async function handleCreateOrder({ request, response }) {
  const body = await readJsonBody(request);
  const order = await createOrder(body);

  sendJson(response, 201, { order });
}
