# E-Commerce Fullstack Platform

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Laravel](https://img.shields.io/badge/Laravel-12-red?style=flat-square&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.3-indigo?style=flat-square&logo=php)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Nginx](https://img.shields.io/badge/Nginx-Alpine-009639?style=flat-square&logo=nginx)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=flat-square&logo=swagger)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)

Plataforma de comercio electronico fullstack construida con una arquitectura de microservicios contenerizada en Docker. El frontend esta desarrollado en Next.js 16+ con App Router y Server Components, consumiendo una API REST en Laravel/PHP con base de datos PostgreSQL, procesamiento de pagos con Stripe y documentacion interactiva en Swagger UI.

---

## Arquitectura del Sistema

El entorno completo se orquesta a traves de Docker Compose bajo una red puente privada (`ecommerce_network`):

- **ecommerce_nextjs_prod**: Frontend Next.js 16+ con React 19 y TypeScript, optimizado para produccion en Node 22 Alpine (puerto 3000).
- **ecommerce_laravel_nginx**: Servidor web Nginx Alpine que actua como punto de entrada de la API (puerto 8000).
- **ecommerce_laravel_app**: Entorno de ejecucion PHP 8.3-FPM con extensiones PDO PostgreSQL y Composer (puerto 9000 interno).
- **ecommerce_laravel_db**: Motor de base de datos relacional PostgreSQL 15 Alpine (puerto 5432).

---

## Instrucciones para Montar el Proyecto

### Requisitos Previos

- Docker Engine version 24 o superior.
- Docker Compose v2.

### 1. Clonar o acceder al repositorio

```bash
cd /home/dimitri/develop/webEcommerce
```

### 2. Variables de entorno

Copia el archivo de variables de entorno base:

```bash
cp .env.example .env
```

Configuracion por defecto:

```env
DB_DATABASE=laravel
DB_USERNAME=postgres
DB_PASSWORD=local_password
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BASE_URL=http://nginx/api
```

### 3. Levantar los contenedores

Ejecuta el siguiente comando para construir las imagenes e iniciar todos los servicios en segundo plano:

```bash
docker compose up -d --build
```

Docker descargara las dependencias, inicializara la base de datos PostgreSQL, ejecutara el seeder de productos y compilara la aplicacion frontend.

### 4. Verificar el estado de los servicios

```bash
docker compose ps
```

Todos los contenedores deben mostrar el estado `Up`:

```text
NAME                      IMAGE                STATUS         PORTS
ecommerce_laravel_app     php:8.3-fpm          Up             9000/tcp
ecommerce_laravel_db      postgres:15-alpine   Up             0.0.0.0:5432->5432/tcp
ecommerce_laravel_nginx   nginx:alpine         Up             0.0.0.0:8000->80/tcp
ecommerce_nextjs_prod     node:22-alpine       Up             0.0.0.0:3000->3000/tcp
```

### 5. Detener el entorno

Para pausar y remover los contenedores sin perder los datos de la base de datos:

```bash
docker compose down
```

---

## Puntos de Acceso y Servicios

### Aplicacion Web (Frontend Next.js)

| Seccion | URL | Descripcion |
|---|---|---|
| Catalogo de Productos | http://localhost:3000/products | Listado de electrodomesticos con fotos, precios y stock |
| Detalle de Producto | http://localhost:3000/products/1 | Ficha tecnica con selector interactivo de cantidad |
| Carrito de Compras | http://localhost:3000/cart | Estado reactivo local con calculo de subtotal y envio |
| Inicio de Sesion | http://localhost:3000/login | Formulario con Server Action y cookies httpOnly seguras |
| Registro de Cuenta | http://localhost:3000/register | Formulario de alta para nuevos compradores |
| Checkout | http://localhost:3000/checkout | Formulario de entrega, orden y pago con Stripe |
| Historial de Compras | http://localhost:3000/orders | Ruta protegida con el desglose de ordenes pagadas |

### Documentacion Interactiva de la API (Swagger UI)

| Recurso | URL | Descripcion |
|---|---|---|
| Consola Swagger UI | http://localhost:8000/docs | Interfaz web interactiva para probar los endpoints |
| Especificacion OpenAPI | http://localhost:8000/api/docs.json | Esquema OpenAPI 3.0.0 en formato JSON |

---

## Credenciales de Acceso para Pruebas

El sistema incluye una cuenta demo inicial en la base de datos:

- **Correo electronico**: `demo@tienda.com`
- **Contrasena**: `password123`

En la pagina de login (`/login`) se dispone ademas de un boton de autocompletado directo. Tambien es posible registrar nuevos usuarios desde `/register`.

---

## Referencia de la API REST

| Metodo | Endpoint | Descripcion | Autenticacion |
|---|---|---|---|
| GET | `/api/products` | Obtiene el catalogo de productos | Publico |
| GET | `/api/products/{id}` | Obtiene el detalle de un producto por ID | Publico |
| POST | `/api/register` | Registra un nuevo usuario y retorna token | Publico |
| POST | `/api/login` | Autentica credenciales y retorna token | Publico |
| POST | `/api/logout` | Cierra la sesion activa | Bearer Token |
| GET | `/api/orders` | Lista el historial de ordenes del usuario | Bearer Token |
| POST | `/api/orders` | Genera una nueva orden de compra | Bearer Token |
| POST | `/api/payments/process` | Procesa el pago de la orden con Stripe | Publico / Bearer |

---

## Estructura del Repositorio

```text
webEcommerce/
├── docker-compose.yml       Configuracion unificada de contenedores
├── .env.example             Variables de entorno de ejemplo
├── .gitignore               Reglas de exclusion para Git
├── nginx/
│   └── default.conf         Configuracion de Nginx para Laravel y PHP-FPM
├── laravel/
│   └── public/
│       └── index.php        API REST en PHP/Laravel, Swagger UI y conexion PostgreSQL
└── nextjs/
    ├── app/                 Rutas App Router (products, cart, checkout, login, orders)
    ├── components/          Componentes reutilizables estilizados con CSS Modules
    ├── lib/                 Cliente API, gestion de cookies httpOnly y contexto de carrito
    ├── services/            Servicios para productos, autenticacion y ordenes
    ├── Dockerfile           Definicion de imagen para el frontend
    └── package.json         Dependencias y scripts de Next.js
```
