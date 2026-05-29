# Integración React + Spring Boot + MySQL

Este proyecto quedó dividido en dos servicios:

- `motorepuestos-app`: frontend React/Vite.
- `motorepuestos-backend`: API REST Spring Boot conectada a MySQL.

## 1. Crear base de datos

En MySQL ejecuta:

```sql
CREATE DATABASE distrirepuestos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Configurar backend

Edita `motorepuestos-backend/src/main/resources/application.properties` o usa variables de entorno:

```powershell
$env:DB_USER="root"
$env:DB_PASSWORD="tu_password"
```

Por defecto el backend usa:

```text
jdbc:mysql://localhost:3306/distrirepuestos
```

## 3. Ejecutar backend

Instala Maven si no lo tienes y ejecuta:

```powershell
cd motorepuestos-backend
mvn spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080/api
```

Al iniciar por primera vez, Spring Boot crea las tablas y carga los productos iniciales.

## 4. Ejecutar frontend

```powershell
cd motorepuestos-app
npm install
npm run dev
```

La app React queda en:

```text
http://localhost:5173
```

## Endpoints principales

- `GET /api/products`: catálogo de productos.
- `POST /api/auth/register`: crear usuario.
- `POST /api/auth/login`: iniciar sesión.
- `POST /api/orders`: crear pedido.
- `GET /api/orders?email=cliente@correo.com`: consultar pedidos.
- `POST /api/contact`: guardar mensaje de contacto.

## Nota de seguridad

La autenticación conserva el flujo simple del proyecto original. Para producción conviene agregar Spring Security, contraseñas cifradas con BCrypt y tokens JWT.
