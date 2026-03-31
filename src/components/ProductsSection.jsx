/* ═══════════════════════════════════════════
   BUECON — Products Section
   Server Component — no 'use client' needed
   ProductCard handles all client interactivity
   ═══════════════════════════════════════════ */

import ProductCard from './ProductCard';
import products from "../data/products";
import styles from './ProductsSection.module.css';

export default function ProductsSection() {
  return (
    <section id="products" className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>Collections</span>
          <h2 className={styles.title}>
            Four <em>Series</em>,<br />
            One Standard of Excellence
          </h2>
          <div className={styles.divider} />
          <p className={styles.sub}>
            Each BUECON collection is built around a distinct design philosophy —
            united by an unwavering commitment to quality and detail.
          </p>
        </div>

        {/* Product Grid — map() renders one card per product */}
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
