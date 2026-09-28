"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { useCart } from "@/lib/cart-context";
import { User } from "@/lib/types";
import { logoutAction } from "@/app/actions/authActions";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/products" className={styles.brand}>
          <span>Tienda</span>
          <span className={styles.brandBadge}>STORE</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/products" className={styles.link}>
            Catálogo
          </Link>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            title="Consola interactiva Swagger"
          >
            Swagger API ↗
          </a>

          <Link href="/cart" className={styles.cartLink} aria-label="Carrito de compras">
            <span>🛒</span>
            <span>Carrito</span>
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>

          {user ? (
            <div className={styles.userSection}>
              <Link href="/orders" className={styles.link}>
                Mis Órdenes
              </Link>
              <span className={styles.userGreeting}>Hola, {user.name}</span>
              <form action={logoutAction}>
                <button type="submit" className={styles.logoutBtn}>
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.userSection}>
              <Link href="/login" className={styles.link}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className={styles.link}>
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
