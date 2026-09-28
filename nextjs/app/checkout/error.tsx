"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./Checkout.module.css";
import { Button } from "@/components/UI/Button/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en checkout:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.sectionCard} style={{ textAlign: "center", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.5rem", color: "var(--error)", marginBottom: "0.5rem" }}>
          No se pudo completar el proceso de Checkout
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Ocurrió un problema procesando tu orden o conectando con los servicios de pago.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button variant="secondary" onClick={() => reset()}>
            Reintentar
          </Button>
          <Link href="/cart">
            <Button variant="primary">Volver al Carrito</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
