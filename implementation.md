# Implementation Guide — E-commerce Frontend

## 1. Contexto del proyecto

Este proyecto corresponde al frontend de un sistema **E-commerce desarrollado con Next.js**, cuyo objetivo es consumir una API REST de e-commerce desarrollada previamente con **Laravel 12, Swagger y Stripe**.

El frontend debe implementar el flujo completo:

```text
Catálogo
   ↓
Detalle del producto
   ↓
Carrito
   ↓
Autenticación
   ↓
Checkout
   ↓
Creación de orden
   ↓
Pago con Stripe
   ↓
Confirmación
   ↓
Historial de compras
```

El proyecto debe mantener una arquitectura moderna basada en:

* Next.js 16+
* App Router
* TypeScript
* React Server Components
* Server Actions
* API REST
* Docker
* CSS Modules
* Cookies `httpOnly`
* Stripe
* Optimización mediante Web Vitals

---

# 2. Objetivo de implementación

El objetivo principal es **implementar y optimizar el frontend existente sin realizar cambios innecesarios en la arquitectura o funcionalidad ya desarrollada**.

El agente de código debe:

1. Analizar primero la estructura actual del proyecto.
2. Identificar las páginas, componentes y servicios existentes.
3. Reutilizar componentes cuando sea posible.
4. Evitar duplicación de código.
5. Realizar únicamente los cambios necesarios.
6. Mantener compatibilidad con la API Laravel existente.
7. No modificar contratos de API sin una razón explícita.
8. Mantener la arquitectura App Router.
9. Priorizar Server Components para lecturas.
10. Utilizar Server Actions para mutaciones.

---

# 3. Entorno de desarrollo

El proyecto se desarrolla utilizando **Docker**.

El entorno debe poder ejecutarse mediante Docker sin depender de instalaciones específicas del sistema operativo del desarrollador.

La estructura esperada puede seguir una organización similar a:

```text
project/
├── app/
├── components/
├── lib/
├── services/
├── public/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

El agente debe respetar la estructura existente si el proyecto ya posee una organización diferente.

No reorganizar carpetas únicamente por motivos estéticos.

---

# 4. Stack tecnológico

## Frontend

* Next.js 16+
* React
* TypeScript
* App Router

## Backend consumido

* Laravel 12
* API REST
* Swagger/OpenAPI

## Pagos

* Stripe

## Styling

Utilizar exclusivamente **CSS Modules** para los estilos nuevos o modificados.

Ejemplo:

```text
ProductCard.tsx
ProductCard.module.css
```

Evitar introducir Tailwind CSS si el proyecto actualmente utiliza CSS Modules.

No mezclar diferentes sistemas de styling sin necesidad.

---

# 5. Sistema visual

Se requiere realizar una mejora visual utilizando una identidad basada en:

* Colores cálidos.
* Tonalidades naranja.
* Blanco y tonos neutros como soporte.
* Contrastes adecuados.
* Fuente Arial.

## Tipografía

La fuente principal debe ser:

```css
font-family: Arial, Helvetica, sans-serif;
```

No introducir Google Fonts u otras fuentes externas salvo que sea estrictamente necesario.

La interfaz debe mantener una apariencia:

* Moderna.
* Limpia.
* Profesional.
* Comercial.
* Orientada a E-commerce.

---

# 6. Paleta visual

Utilizar una paleta cálida basada principalmente en naranja.

Valores de referencia:

```css
:root {
  --primary: #f97316;
  --primary-dark: #ea580c;
  --primary-light: #fb923c;

  --background: #fffaf5;
  --surface: #ffffff;

  --text-primary: #27272a;
  --text-secondary: #71717a;

  --border: #fed7aa;

  --success: #16a34a;
  --error: #dc2626;

  --shadow: rgba(0, 0, 0, 0.08);
}
```

Estos valores son una referencia visual.

El agente puede ajustar ligeramente los tonos para mejorar contraste, accesibilidad o coherencia visual, pero debe conservar la identidad:

```text
Naranja + blanco + neutros cálidos
```

---

# 7. CSS Modules

Todos los componentes nuevos deben utilizar CSS Modules.

Ejemplo:

```tsx
import styles from "./ProductCard.module.css";

export function ProductCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>
        Producto
      </h2>
    </article>
  );
}
```

CSS:

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px var(--shadow);
}

.title {
  color: var(--text-primary);
}
```

Evitar:

```tsx
style={{ color: "orange" }}
```

cuando el estilo pueda pertenecer al CSS Module.

---

# 8. Reglas de diseño

## Botones

Los botones principales deben utilizar la tonalidad naranja.

Ejemplo:

```css
.button {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 150ms ease;
}

.button:hover {
  background: var(--primary-dark);
}
```

Los estados `hover`, `focus`, `disabled` y `loading` deben estar contemplados.

---

# 9. Catálogo

La aplicación debe proporcionar:

```text
/products
```

para mostrar el catálogo público.

Cada producto debe mostrar, cuando la API lo permita:

* Imagen
* Nombre
* Precio
* Descripción resumida
* Disponibilidad
* Acción para ver detalle
* Acción para agregar al carrito

El catálogo debe priorizar Server Components.

Ejemplo conceptual:

```tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ProductList products={products} />
  );
}
```

No convertir toda la página en Client Component únicamente para manejar elementos visuales.

---

# 10. Detalle del producto

Cada producto debe disponer de una ruta similar a:

```text
/products/[id]
```

Debe mostrar:

* Imagen
* Nombre
* Precio
* Descripción
* Disponibilidad
* Cantidad
* Agregar al carrito

La lectura del producto debe realizarse preferentemente desde un Server Component.

---

# 11. Carrito

El carrito debe manejarse como estado local del frontend.

Debe permitir:

* Agregar productos.
* Incrementar cantidad.
* Reducir cantidad.
* Eliminar productos.
* Calcular subtotal.
* Mostrar total.

El estado interactivo del carrito puede utilizar Client Components.

No enviar una petición al backend por cada modificación local del carrito si no es necesario.

El backend debe intervenir cuando corresponda crear la orden.

---

# 12. Autenticación

Implementar:

```text
/register
/login
```

La autenticación debe consumir la API Laravel.

El token no debe almacenarse en:

```text
localStorage
sessionStorage
```

Utilizar cookies `httpOnly`.

La cookie debe configurarse considerando:

```text
httpOnly
secure
sameSite
path
```

según el entorno.

---

# 13. Server Actions

Las mutaciones deben utilizar Server Actions cuando corresponda.

Ejemplos:

```text
login
register
createOrder
processPayment
```

Conceptualmente:

```tsx
"use server";

export async function createOrder(data: OrderData) {
  // Validación
  // Obtener sesión
  // Consumir API
  // Revalidar información
}
```

Las credenciales y tokens no deben exponerse innecesariamente al cliente.

---

# 14. Checkout

Ruta esperada:

```text
/checkout
```

Debe permitir:

1. Revisar productos.
2. Confirmar cantidades.
3. Mostrar subtotal.
4. Mostrar total.
5. Confirmar creación de orden.
6. Ejecutar el flujo de pago.
7. Mostrar resultado.

El checkout debe tener estados visuales para:

```text
idle
loading
success
error
```

---

# 15. Stripe

El flujo de pago debe utilizar el endpoint correspondiente de la API Laravel.

No colocar secretos de Stripe en componentes cliente.

Las claves privadas deben permanecer en variables de entorno del servidor.

Nunca exponer:

```text
STRIPE_SECRET_KEY
```

al navegador.

---

# 16. Historial de compras

Ruta:

```text
/orders
```

Debe ser una ruta protegida.

Debe obtener las órdenes correspondientes al usuario autenticado.

La lectura debe realizarse preferentemente desde Server Components.

Debe contemplar:

* Loading.
* Error.
* Lista vacía.
* Lista con órdenes.
* Información básica de cada compra.

---

# 17. Loading UI

Implementar `loading.tsx` en rutas importantes.

Como mínimo:

```text
app/products/loading.tsx
app/checkout/loading.tsx
```

El loading debe utilizar skeletons o indicadores visuales coherentes con el diseño.

Ejemplo:

```tsx
export default function Loading() {
  return (
    <div>
      Cargando productos...
    </div>
  );
}
```

Preferiblemente utilizar skeleton UI cuando resulte apropiado.

---

# 18. Manejo de errores

Implementar `error.tsx` en segmentos importantes.

Ejemplo:

```text
app/products/error.tsx
app/checkout/error.tsx
```

El componente de error debe:

* Mostrar un mensaje entendible.
* Permitir reintentar cuando corresponda.
* Evitar mostrar información sensible.
* Mantener el diseño visual del sistema.

---

# 19. Suspense

Debe existir al menos una sección que utilice:

```tsx
<Suspense>
```

Una opción recomendada es el listado de productos.

Ejemplo conceptual:

```tsx
<Suspense fallback={<ProductSkeleton />}>
  <ProductList />
</Suspense>
```

También puede utilizarse en:

```text
Historial de compras
```

cuando resulte más apropiado.

---

# 20. Revalidación

Después de realizar mutaciones que modifiquen información del servidor, evitar mostrar información obsoleta.

Utilizar:

```tsx
revalidatePath()
```

o:

```tsx
revalidateTag()
```

según corresponda.

Ejemplo:

```tsx
revalidatePath("/orders");
```

Después de crear una orden, el historial debe poder mostrar la información actualizada.

---

# 21. Rendimiento

El proyecto debe priorizar Core Web Vitals.

Considerar especialmente:

* LCP
* CLS
* INP

Buenas prácticas:

* Optimizar imágenes.
* Utilizar `next/image`.
* Evitar JavaScript innecesario.
* Mantener Server Components cuando sea posible.
* Reducir Client Components.
* Evitar renderizados innecesarios.
* Utilizar Suspense.
* Implementar estados de carga.
* Evitar solicitudes duplicadas.
* Mantener bundles pequeños.

---

# 22. Imágenes

Utilizar:

```tsx
import Image from "next/image";
```

en lugar de `<img>` cuando sea apropiado.

Las imágenes de productos deben utilizar dimensiones adecuadas.

Evitar cargar imágenes excesivamente grandes.

---

# 23. API

La URL base de la API debe configurarse mediante variables de entorno.

Ejemplo:

```env
BASE_URL=http://localhost:8000/api
```

Debe existir:

```text
.env.example
```

Nunca incluir secretos reales en Git.

---

# 24. Seguridad

No colocar secretos en:

```text
NEXT_PUBLIC_*
```

salvo valores que realmente deban ser públicos.

No exponer:

* Tokens privados.
* Secretos de Stripe.
* Credenciales.
* Cookies.
* Variables sensibles.

Validar siempre los datos recibidos antes de enviarlos a la API.

---

# 25. Docker

El proyecto debe poder ejecutarse mediante Docker.

Ejemplo conceptual:

```bash
docker compose up --build
```

El agente debe revisar primero el `Dockerfile` y `docker-compose.yml` existentes antes de modificarlos.

No reemplazar la configuración Docker existente si ya funciona.

Cualquier modificación debe estar justificada por una necesidad real del proyecto.

---

# 26. Restricción importante para el agente

Antes de modificar código:

```text
1. Analizar el proyecto.
2. Identificar la arquitectura existente.
3. Identificar componentes reutilizables.
4. Identificar las rutas existentes.
5. Identificar cómo se consume actualmente la API.
6. Identificar cómo se maneja actualmente la autenticación.
7. Identificar el sistema de estilos existente.
8. Identificar la configuración Docker.
9. Implementar únicamente los cambios necesarios.
10. Verificar que no se rompa funcionalidad existente.
```

**No reconstruir el proyecto desde cero.**

**No reemplazar componentes funcionales sin necesidad.**

**No cambiar la API Laravel.**

**No cambiar contratos de endpoints existentes.**

---

# 27. Prioridad de cambios

Los cambios deben realizarse en este orden:

### Prioridad 1 — Funcionalidad

Garantizar:

```text
Catálogo
Detalle
Registro
Login
Carrito
Orden
Pago
Historial
```

### Prioridad 2 — Arquitectura Next.js

Garantizar:

```text
Server Components
Server Actions
Suspense
loading.tsx
error.tsx
revalidatePath / revalidateTag
```

### Prioridad 3 — Seguridad

Garantizar:

```text
httpOnly cookies
protección de secretos
validación
manejo seguro de errores
```

### Prioridad 4 — Rendimiento

Garantizar:

```text
Web Vitals
optimización de imágenes
reducción de JS
evitar requests innecesarios
```

### Prioridad 5 — UI

Aplicar:

```text
CSS Modules
Arial
paleta naranja
diseño consistente
responsive
```

---

# 28. Criterio de aceptación visual

La interfaz final debe sentirse como un E-commerce moderno.

Características esperadas:

```text
                    E-COMMERCE
┌─────────────────────────────────────────┐
│ Logo        Productos   🛒   Usuario    │
├─────────────────────────────────────────┤
│                                         │
│       Descubre nuestros productos       │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Imagen │ │ Imagen │ │ Imagen │      │
│  │        │ │        │ │        │      │
│  │ Nombre │ │ Nombre │ │ Nombre │      │
│  │ $XX.XX │ │ $XX.XX │ │ $XX.XX │      │
│  │ [Añadir]│ │[Añadir]│ │[Añadir]│     │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

La interfaz debe ser responsive para:

* Desktop
* Tablet
* Mobile

---

# 29. Lighthouse

Se debe poder ejecutar una evaluación mediante Lighthouse.

Evaluar como mínimo:

```text
Performance
Accessibility
Best Practices
SEO
```

La evidencia final debe incluir capturas o PDF del resultado.

El objetivo no es únicamente obtener una puntuación alta, sino identificar y corregir problemas reales de rendimiento.

---

# 30. Entregables

El proyecto final debe incluir:

```text
GitHub Repository
│
├── Código Next.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
└── documentación
```

El README debe documentar:

### Configuración

```env
BASE_URL=
```

### Instalación

```bash
docker compose up --build
```

### Rutas

```text
/products
/products/[id]
/login
/register
/cart
/checkout
/orders
```

### Evidencias

Incluir:

1. Endpoints utilizados desde Swagger.
2. Flujo completo de compra.
3. Confirmación del pago.
4. Historial de compras.
5. Reporte Lighthouse.

---

# 31. Regla general de implementación

El principio fundamental para cualquier cambio es:

> **Modificar lo necesario, reutilizar lo existente y evitar sobreingeniería.**

El agente debe priorizar:

```text
Funcionalidad
    ↓
Seguridad
    ↓
Arquitectura Next.js
    ↓
Rendimiento
    ↓
Experiencia visual
```

La implementación debe mantenerse simple, mantenible y preparada para evaluación académica y demostración técnica.
