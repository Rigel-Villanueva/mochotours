import type { NextConfig } from 'next';

/**
 * Configuración de Next.js para MochoTours.
 *
 * Ref: framework_y_seo.txt →
 *   - MANEJO ÓPTIMO DE IMÁGENES → #3 CONFIGURACIÓN DE DOMINIOS
 *   - OPTIMIZACIÓN AUTOMÁTICA DE IMÁGENES
 */
const nextConfig: NextConfig = {
  // ── Optimización de imágenes ───────────────────────────────────────
  // Permite al componente <Image> de Next.js procesar imágenes
  // remotas desde Supabase Storage y generar formatos WebP/AVIF
  // automáticamente con múltiples tamaños.
  images: {
    // Desactivamos la optimización para ahorrar RAM en el servidor de Hostinger
    // y evitar errores de resolución de IP privada (localhost) en desarrollo.
    unoptimized: true,
    // Lista de calidades permitidas para que el componente <Image> no marque warnings
    qualities: [75, 85, 100],
  },
};

export default nextConfig;
