"use client";

import React, { useEffect } from "react";
import styles from "./Orders.module.css";
import { Button } from "@/components/UI/Button/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al cargar historial de órdenes:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2>No se pudieron cargar tus órdenes</h2>
        <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 1.5rem" }}>
          Hubo un problema consultando la lista de compras del servidor.
        </p>
        <Button variant="primary" onClick={() => reset()}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
