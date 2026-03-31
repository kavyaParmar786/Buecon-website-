'use client';

/* ═══════════════════════════════════════════
   BUECON — ProductCard Component
   
   Key decisions:
   - 'use client' needed for useState + Canvas
   - ModelViewer is dynamically imported so the
     Three.js bundle only loads when user clicks
     "View 3D" — not on initial page load
   ═══════════════════════════════════════════ */

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './ProductCard.module.css';

/* Dynamic import = Three.js only loads when 3D is requested */
const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,  /* Three.js can't run on server */
  loading: () => (
    <div className={styles.modelLoading}>
      <span className={styles.loadingDot}></span>
      Loading 3D…
    </div>
  ),
});

export default function ProductCard({ product }) {
  /* false = image view, true = 3D view */
  const [show3D, setShow3D] = useState(false);
  /* Track if 3D has ever been opened (keeps model in DOM after first load) */
  const [has3DLoaded, setHas3DLoaded] = useState(false);

  function handleToggle3D() {
    if (!has3DLoaded) setHas3DLoaded(true);
    setShow3D(true);
  }

  return (
    <article className={styles.card}>

      {/* AI insight badge */}
      <div className={styles.badge}>✨ {product.style[0]} collection</div>

      {/* ── Media Area ── */}
      <div className={styles.media}>

        {/* Image — hidden when 3D is active */}
        <div className={`${styles.imageWrap} ${show3D ? styles.hidden : styles.visible}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority={false}
          />
        </div>

        {/* 3D Viewer — only rendered after first click, then kept mounted */}
        {has3DLoaded && (
          <div className={`${styles.viewerWrap} ${show3D ? styles.visible : styles.hidden}`}>
            <ModelViewer modelPath={product.model} />
          </div>
        )}

      </div>

      {/* ── Toggle Buttons ── */}
      <div className={styles.toggle}>
        <button
          className={`${styles.toggleBtn} ${!show3D ? styles.active : ''}`}
          onClick={() => setShow3D(false)}
        >
          ◫ Image
        </button>
        <button
          className={`${styles.toggleBtn} ${show3D ? styles.active : ''}`}
          onClick={handleToggle3D}
        >
          ◈ View in 3D
        </button>
      </div>

      {/* ── Product Info ── */}
      <div className={styles.info}>
        <span className={styles.seriesTag}>{product.name}</span>
        <h3 className={styles.title}>{product.subtitle}</h3>
        <ul className={styles.features}>
          {product.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <div className={styles.footer}>
          <span className={styles.explore}>Explore →</span>
        </div>
      </div>

    </article>
  );
}
