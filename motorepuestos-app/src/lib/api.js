const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload.error ?? payload.message ?? 'Request failed';

    throw new Error(message);
  }

  return payload;
}

export async function getProducts() {
  const data = await request('/products');
  return data.products ?? [];
}

export async function getOrders(email) {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  const data = await request(`/orders${query}`);
  return data.orders ?? [];
}

export async function createOrder(orderPayload) {
  const data = await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload)
  });

  return data.order;
}

export async function createContactMessage(messagePayload) {
  const data = await request('/contact-messages', {
    method: 'POST',
    body: JSON.stringify(messagePayload)
  });

  return data.message;
}

export async function registerUser(payload) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return data.user;
}

export async function loginUser(payload) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return data.user;
}
