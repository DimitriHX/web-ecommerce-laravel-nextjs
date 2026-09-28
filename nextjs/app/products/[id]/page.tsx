import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./ProductDetail.module.css";
import { getProductById } from "@/services/productService";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isAvailable = (product.stock ?? 1) > 0;

  return (
    <div className={styles.container}>
      <Link href="/products" className={styles.backLink}>
        ← Volver al catálogo
      </Link>

      <div className={styles.card}>
        <div className={styles.imageSection}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 500px"
            />
          ) : (
            <div className={styles.placeholder}>📦</div>
          )}
        </div>

        <div className={styles.infoSection}>
          {product.category && (
            <span className={styles.category}>{product.category}</span>
          )}
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>${Number(product.price).toFixed(2)}</div>

          <div className={styles.meta}>
            <span
              className={`${styles.stockBadge} ${!isAvailable ? styles.outOfStock : ""}`}
            >
              {isAvailable
                ? `En stock (${product.stock ?? "disponible"})`
                : "Agotado"}
            </span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
