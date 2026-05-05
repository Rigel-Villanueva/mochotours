import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe o fue movida.',
};

/**
 * Página 404 personalizada.
 * Ref: framework_y_seo.txt → CHECKLIST SEO → Página 404 personalizada
 */
export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">
      <h1 className="text-8xl lg:text-9xl font-bold text-primary/20 mb-4">
        404
      </h1>

      <h2 className="text-2xl lg:text-3xl font-semibold text-stone-dark mb-3">
        Página no encontrada
      </h2>

      <p className="text-stone-text max-w-md mb-8">
        La página que buscas no existe, fue movida o el enlace está roto.
        Pero no te preocupes, los cenotes siguen esperándote.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
      >
        ← Volver al inicio
      </Link>
    </main>
  );
}
