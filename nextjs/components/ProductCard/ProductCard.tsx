"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isAvailable = (product.stock ?? 1) > 0;

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            priority={false}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            📦
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
          <span
            className={`${styles.stockBadge} ${!isAvailable ? styles.outOfStock : ""}`}
          >
            {isAvailable ? "Disponible" : "Agotado"}
          </span>
        </div>

        <div className={styles.actions}>
          <Link href={`/products/${product.id}`} className={styles.viewBtn}>
            Ver detalle
          </Link>
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            {added ? "✓ Añadido" : "Añadir"}
          </button>
        </div>
      </div>
    </article>
  );
}
