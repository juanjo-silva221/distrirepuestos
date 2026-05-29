import { loginUser, registerUser } from '../services/authService.js';
import { readJsonBody, sendJson } from '../utils/http.js';

export async function handleRegister({ request, response }) {
  const body = await readJsonBody(request);
  const user = await registerUser(body);

  sendJson(response, 201, { user });
}

export async function handleLogin({ request, response }) {
  const body = await readJsonBody(request);
  const user = await loginUser(body);

  sendJson(response, 200, { user });
}
