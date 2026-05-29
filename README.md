# MotoRepuestos

Proyecto full stack para catálogo de repuestos de moto, con frontend React/Vite y API en Node.

## Ejecutar en local

1. Instala dependencias del frontend desde `motorepuestos-app`:
```bash
cd motorepuestos-app
npm install
```
2. Si vas a usar phpMyAdmin/XAMPP, instala también las dependencias del backend:
```bash
cd backend
npm install
```
3. Ajusta `.env` para el modo que quieras usar.
4. Levanta el frontend:
```bash
cd motorepuestos-app
npm run dev
```
5. En otra terminal, inicia la API:
```bash
cd ..
node backend/server.js
```

## Base de datos

Por defecto el backend usa SQLite para no depender de servicios externos. Si quieres que los usuarios, pedidos y mensajes también aparezcan en phpMyAdmin, crea una base llamada `motorepuestos` en XAMPP y usa estas variables:

```bash
DB_CLIENT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=motorepuestos
```

Con esa configuración, el backend crea o actualiza estas tablas en MySQL:

- `products`
- `users`
- `orders`
- `contact_messages`

## Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api`

## Endpoints

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders?email=correo@ejemplo.com`
- `POST /api/contact-messages`
- `POST /api/auth/register`
- `POST /api/auth/login`

## Postman

Usa `http://localhost:3000/api` como base URL.

- Productos: `GET /products`
- Pedido: `POST /orders`
- Contacto: `POST /contact-messages`
- Registro: `POST /auth/register`
- Login: `POST /auth/login`
