"use client";

import React, { useEffect } from "react";
import styles from "./Products.module.css";
import { Button } from "@/components/UI/Button/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en catálogo de productos:", error);
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
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.5rem", color: "var(--error)", marginBottom: "0.5rem" }}>
          No pudimos cargar los productos
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Ocurrió un error inesperado al conectar con el catálogo. Puedes intentar nuevamente.
        </p>
        <Button variant="primary" onClick={() => reset()}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
