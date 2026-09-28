"use client";

import React, { useState } from "react";
import styles from "./ProductDetail.module.css";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/UI/Button/Button";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const isAvailable = (product.stock ?? 1) > 0;

  const handleIncrement = () => {
    if (quantity < (product.stock ?? 99)) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles.cartControls}>
      {isAvailable && (
        <div className={styles.quantitySelector}>
          <label>Cantidad:</label>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleIncrement}
            disabled={quantity >= (product.stock ?? 99)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleAddToCart}
        disabled={!isAvailable}
      >
        {added ? "✓ ¡Añadido al carrito!" : "Agregar al Carrito"}
      </Button>
    </div>
  );
}
