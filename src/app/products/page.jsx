/* ═══════════════════════════════════════════
   BUECON — /products page
   Route: yoursite.com/products
   ═══════════════════════════════════════════ */

import ProductsSection from '@/components/ProductsSection';

export const metadata = {
  title: 'Products — BUECON Bathroom Hardware',
  description: 'Explore the Salt, Super, Spirit and 400 series.',
};

export default function ProductsPage() {
  return (
    <main style={{ background: '#060F18', minHeight: '100vh' }}>
      <ProductsSection />
    </main>
  );
}
