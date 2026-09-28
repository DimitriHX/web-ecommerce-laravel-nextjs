# E-Commerce Frontend — Next.js 16+

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)

Frontend para plataforma de comercio electronico conectado a una API REST en Laravel 12 con procesamiento de pagos mediante Stripe.

---

## Arquitectura y Tecnologias

- **Framework**: Next.js 16+ (App Router)
- **Lenguaje**: TypeScript
- **Renderizado**: React Server Components (RSC) para lecturas de datos
- **Mutaciones**: Server Actions (`"use server"`)
- **Estilos**: Exclusivamente CSS Modules (`.module.css`) con sistema de diseno calido en tonos naranja (`#f97316`) y tipografia Arial
- **Manejo de Sesion**: Cookies `httpOnly` para almacenamiento seguro del token
- **Contenedores**: Docker y Docker Compose

---

## Estructura del Proyecto

```text
nextjs/
├── app/
│   ├── actions/          # Server Actions (auth, orders)
│   ├── cart/             # Carrito de compras (Client Component)
│   ├── checkout/         # Proceso de compra y pago con Stripe
│   ├── login/            # Inicio de sesion
│   ├── orders/           # Historial de compras (Protegido por cookie)
│   ├── products/         # Catalogo (/products) y detalle (/products/[id])
│   ├── globals.css       # Variables de diseno y estilos base
│   └── layout.tsx        # Layout raiz con Navbar y CartProvider
├── components/
│   ├── Navbar/           # Barra de navegacion con carrito reactivo
│   ├── ProductCard/      # Tarjeta de producto con CSS Modules y Next Image
│   ├── ProductList/      # Cuadricula responsiva de productos
│   └── UI/               # Botones y Skeletons de carga
├── lib/
│   ├── api.ts            # Cliente HTTP centralizado para API Laravel
│   ├── auth.ts           # Gestion de sesion con cookies httpOnly
│   ├── cart-context.tsx  # Contexto de estado local del carrito
│   └── types.ts          # Interfaces de TypeScript
├── services/
│   ├── authService.ts    # Servicios de autenticacion
│   ├── orderService.ts   # Servicios de ordenes y pagos
│   └── productService.ts # Servicios del catalogo
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Configuracion e Instalacion

### 1. Variables de Entorno

Copia el archivo de variables de entorno de ejemplo:

```bash
cp .env.example .env.local
```

Variables principales:
```env
BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sample
STRIPE_SECRET_KEY=sk_test_sample
```

### 2. Ejecucion con Docker (Recomendado)

Desde la raiz del repositorio (`webEcommerce/`):

```bash
docker compose up -d --build
```

Esto iniciara:
- **Next.js**: http://localhost:3000
- **API Laravel (Nginx)**: http://localhost:8000
- **PostgreSQL**: Puerto 5432

### 3. Ejecucion Local (Desarrollo directo)

```bash
npm install
npm run dev
```

---

## Rutas de la Aplicacion

| Ruta | Descripcion | Tipo |
|---|---|---|
| `/products` | Catalogo de productos con Suspense y Skeleton | Server Component |
| `/products/[id]` | Ficha tecnica y detalle del producto | Server Component |
| `/cart` | Carrito interactivo con control de cantidades | Client Component |
| `/login` | Formulario de inicio de sesion | Client / Server Action |
| `/register` | Formulario de registro de cuenta | Client / Server Action |
| `/checkout` | Creacion de orden y pago seguro con Stripe | Client / Server Action |
| `/orders` | Historial de ordenes de compra del usuario | Server Component (Protegida) |
