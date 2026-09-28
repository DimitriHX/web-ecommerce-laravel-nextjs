import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./Orders.module.css";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersApi } from "@/services/orderService";
import { Button } from "@/components/UI/Button/Button";

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return styles.statusCompleted;
    case "pending":
      return styles.statusPending;
    default:
      return styles.statusCancelled;
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersApi();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Historial de Compras</h1>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>Aún no has realizado ninguna compra</h2>
          <p style={{ color: "var(--text-secondary)", margin: "0.75rem 0 1.5rem" }}>
            Cuando realices una orden mediante nuestra plataforma, aparecerá listada aquí.
          </p>
          <Link href="/products">
            <Button variant="primary">Ir al Catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <article key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <div className={styles.orderId}>Orden #{order.id}</div>
                  <div className={styles.orderDate}>
                    {new Date(order.created_at || Date.now()).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                  {order.status === "completed" || order.status === "paid"
                    ? "Pagado"
                    : order.status === "pending"
                    ? "Pendiente"
                    : order.status}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className={styles.itemsList}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <span>
                        {item.product_name || `Producto #${item.product_id}`} × {item.quantity}
                      </span>
                      <span>${(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.orderFooter}>
                <span className={styles.totalLabel}>Total Pagado:</span>
                <span className={styles.totalAmount}>${Number(order.total).toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
