import React from "react";
import styles from "./Orders.module.css";
import { Skeleton } from "@/components/UI/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Skeleton height={36} width={250} />
      <div className={styles.ordersList} style={{ marginTop: "2rem" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.orderCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton height={24} width={120} />
              <Skeleton height={24} width={80} borderRadius="999px" />
            </div>
            <Skeleton height={18} width="60%" />
            <Skeleton height={18} width="40%" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <Skeleton height={20} width={80} />
              <Skeleton height={24} width={100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
