import React from "react";
import styles from "./Checkout.module.css";
import { Skeleton } from "@/components/UI/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Skeleton height={40} width={250} />
      <div className={styles.checkoutLayout} style={{ marginTop: "2rem" }}>
        <div className={styles.sectionCard}>
          <Skeleton height={28} width={180} />
          <Skeleton height={60} />
          <Skeleton height={60} />
          <Skeleton height={45} width="100%" borderRadius="8px" />
        </div>
        <div className={styles.sectionCard}>
          <Skeleton height={28} width={150} />
          <Skeleton height={100} />
          <Skeleton height={40} />
        </div>
      </div>
    </div>
  );
}
