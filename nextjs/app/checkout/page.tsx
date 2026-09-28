"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Checkout.module.css";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/UI/Button/Button";
import { createOrderAction, processPaymentAction } from "@/app/actions/orderActions";

type CheckoutState = "idle" | "loading" | "success" | "error";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [state, setState] = useState<CheckoutState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | number | null>(null);

  if (state === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h1>¡Pago completado con éxito!</h1>
          <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0" }}>
            Tu orden ha sido generada y el pago mediante Stripe fue confirmado.
          </p>
          <div className={styles.orderIdBadge}>Orden #{completedOrderId}</div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/orders">
              <Button variant="primary">Ver Mis Órdenes</Button>
            </Link>
            <Link href="/products">
              <Button variant="secondary">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && state === "idle") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Finalizar Compra</h1>
        <div className={styles.sectionCard} style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <h2>No tienes productos para comprar</h2>
          <p style={{ color: "var(--text-secondary)", margin: "1rem 0 2rem" }}>
            Añade productos a tu carrito antes de realizar el checkout.
          </p>
          <Link href="/products">
            <Button variant="primary">Ver Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMessage(null);

    try {
      // 1. Crear Orden en backend
      const orderPayload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: Number(i.product.price),
        })),
        shipping_address: address,
      };

      const orderResult = await createOrderAction(orderPayload);

      if (!orderResult.success || !orderResult.orderId) {
        throw new Error(orderResult.error || "No se pudo crear la orden.");
      }

      // 2. Procesar Pago seguro con Stripe a través de la API
      const paymentResult = await processPaymentAction({
        order_id: orderResult.orderId,
        payment_method_id: "pm_card_visa", // Token seguro / demo
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Error al procesar el pago con Stripe.");
      }

      // 3. Estado Exitoso y limpieza de carrito
      setCompletedOrderId(orderResult.orderId);
      clearCart();
      setState("success");
    } catch (err: unknown) {
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado durante el pago."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Finalizar Compra</h1>

      {errorMessage && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "var(--error)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleCheckout} className={styles.checkoutLayout}>
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>1. Información de Envío</h2>

          <div className={styles.formField}>
            <label htmlFor="address" className={styles.label}>
              Dirección de Entrega
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Principal 123, Depto 4"
              className={styles.input}
            />
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: "1rem" }}>
            2. Método de Pago (Stripe)
          </h2>

          <div className={styles.paymentNotice}>
            <span>🔒</span>
            <span>
              Procesamiento cifrado a través de Stripe. No se almacenan datos sensibles en el navegador.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={state === "loading"}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {state === "loading"
              ? "Procesando orden y pago..."
              : `Pagar $${subtotal.toFixed(2)}`}
          </Button>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Resumen de la Orden</h2>

          <div className={styles.itemList}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className={styles.itemRow}>
                <div>
                  <div className={styles.itemName}>{product.name}</div>
                  <div className={styles.itemQty}>Cant: {quantity}</div>
                </div>
                <div className={styles.itemPrice}>
                  ${(Number(product.price) * quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalRow}>
            <span>Total a Pagar</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
