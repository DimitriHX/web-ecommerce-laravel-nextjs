import React, { Suspense } from "react";
import styles from "./Products.module.css";
import { getProducts } from "@/services/productService";
import { ProductList } from "@/components/ProductList/ProductList";
import { ProductsGridSkeleton } from "./loading";

async function ProductsContent() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

export default function ProductsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Descubre nuestros productos</h1>
        <p className={styles.heroSubtitle}>
          Encuentra los mejores artículos al mejor precio con envíos garantizados y pagos seguros.
        </p>
      </header>

      <section>
        <div className={styles.catalogHeader}>
          <h2 className={styles.catalogTitle}>Catálogo de Artículos</h2>
        </div>

        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsContent />
        </Suspense>
      </section>
    </div>
  );
}
