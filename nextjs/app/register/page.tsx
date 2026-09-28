"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import styles from "../login/Auth.module.css";
import { registerAction, ActionResult } from "@/app/actions/authActions";
import { Button } from "@/components/UI/Button/Button";

const initialState: ActionResult = {
  success: false,
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>
            Regístrate para gestionar tus compras y pedidos
          </p>
        </div>

        {state?.error && <div className={styles.errorBanner}>{state.error}</div>}

        <form action={formAction} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Juan Pérez"
              className={styles.input}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@correo.com"
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password_confirmation" className={styles.label}>
              Confirmar Contraseña
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              placeholder="••••••••"
              className={styles.input}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isPending ? "Creando cuenta..." : "Completar Registro"}
          </Button>
        </form>

        <div className={styles.footer}>
          ¿Ya tienes una cuenta?
          <Link href="/login" className={styles.footerLink}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
