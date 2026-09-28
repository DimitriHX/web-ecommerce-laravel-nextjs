"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Cart.module.css";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/UI/Button/Button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Tu Carrito</h1>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p style={{ color: "var(--text-secondary)", margin: "0.75rem 0 1.5rem" }}>
            Explora nuestro catálogo y añade los artículos que desees comprar.
          </p>
          <Link href="/products">
            <Button variant="primary">Ir al Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className={styles.title}>Tu Carrito ({totalItems} productos)</h1>
        <button
          type="button"
          onClick={clearCart}
          className={styles.removeBtn}
          style={{ marginBottom: "1.5rem" }}
        >
          Vaciar carrito
        </button>
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.itemsList}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className={styles.itemCard}>
              <div className={styles.itemImage}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="90px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>📦</span>
                )}
              </div>

              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{product.name}</h3>
                <div className={styles.itemPrice}>
                  ${Number(product.price).toFixed(2)} c/u
                </div>
              </div>

              <div className={styles.itemControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>

                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeItem(product.id)}
                  aria-label="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envío estimado</span>
            <span style={{ color: "var(--success)", fontWeight: 600 }}>Gratis</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <Link href="/checkout" style={{ width: "100%", marginTop: "0.5rem" }}>
            <Button variant="primary" style={{ width: "100%" }}>
              Proceder al Checkout →
            </Button>
          </Link>

          <Link href="/products" style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
