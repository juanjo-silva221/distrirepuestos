import { createContactMessage, listContactMessages } from '../services/contactService.js';
import { readJsonBody, sendJson } from '../utils/http.js';

export async function handleListContactMessages({ response }) {
  sendJson(response, 200, {
    messages: await listContactMessages()
  });
}

export async function handleCreateContactMessage({ request, response }) {
  const body = await readJsonBody(request);
  const message = await createContactMessage(body);

  sendJson(response, 201, { message });
}
