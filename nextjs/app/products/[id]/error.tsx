"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./ProductDetail.module.css";
import { Button } from "@/components/UI/Button/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al cargar producto:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 4px 12px var(--shadow)",
          maxWidth: "600px",
          margin: "2rem auto",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h2 style={{ fontSize: "1.5rem", color: "var(--error)", marginBottom: "0.5rem" }}>
          No pudimos encontrar el producto
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          El producto solicitado no existe o hubo un fallo de conexión.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button variant="secondary" onClick={() => reset()}>
            Reintentar
          </Button>
          <Link href="/products">
            <Button variant="primary">Volver al Catálogo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
