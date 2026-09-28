import React from "react";
import styles from "./Products.module.css";
import { Skeleton } from "@/components/UI/Skeleton/Skeleton";

export function ProductsGridSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton height={200} borderRadius="12px" />
          <Skeleton height={24} width="70%" />
          <Skeleton height={16} width="95%" />
          <Skeleton height={16} width="85%" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <Skeleton height={28} width="35%" />
            <Skeleton height={24} width="25%" />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <Skeleton height={38} width="50%" borderRadius="8px" />
            <Skeleton height={38} width="50%" borderRadius="8px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Skeleton height={42} width="50%" className="mx-auto" />
        <div style={{ marginTop: "1rem" }}>
          <Skeleton height={20} width="35%" />
        </div>
      </div>
      <div className={styles.catalogHeader}>
        <Skeleton height={32} width={200} />
      </div>
      <ProductsGridSkeleton />
    </div>
  );
}
