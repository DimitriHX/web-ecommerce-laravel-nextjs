import React from "react";
import styles from "./ProductList.module.css";
import { Product } from "@/lib/types";
import { ProductCard } from "../ProductCard/ProductCard";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛍️</div>
        <h3 className={styles.emptyTitle}>No hay productos disponibles</h3>
        <p>Vuelve a consultar más tarde o revisa el catálogo.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
