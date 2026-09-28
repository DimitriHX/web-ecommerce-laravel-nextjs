import React from "react";
import styles from "./ProductDetail.module.css";
import { Skeleton } from "@/components/UI/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "2rem" }}>
        <Skeleton height={20} width={150} />
      </div>
      <div className={styles.card}>
        <Skeleton height={400} borderRadius="10px" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Skeleton height={20} width={100} />
          <Skeleton height={36} width="80%" />
          <Skeleton height={40} width="40%" />
          <Skeleton height={80} width="100%" />
          <Skeleton height={45} width="100%" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
}
