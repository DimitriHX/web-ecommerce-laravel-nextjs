"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import styles from "./Auth.module.css";
import { loginAction, ActionResult } from "@/app/actions/authActions";
import { Button } from "@/components/UI/Button/Button";

const initialState: ActionResult = {
  success: false,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillDemo = () => {
    setEmail("demo@tienda.com");
    setPassword("password123");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>
            Ingresa a tu cuenta para continuar con tus compras
          </p>
        </div>

        {/* Banner de credenciales demo */}
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>Usuario demo:</strong> demo@tienda.com<br />
            <strong>Contraseña:</strong> password123
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.3rem 0.6rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Autocompletar
          </button>
        </div>

        {state?.error && <div className={styles.errorBanner}>{state.error}</div>}

        <form action={formAction} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isPending ? "Iniciando sesión..." : "Entrar a mi cuenta"}
          </Button>
        </form>

        <div className={styles.footer}>
          ¿No tienes una cuenta aún?
          <Link href="/register" className={styles.footerLink}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
