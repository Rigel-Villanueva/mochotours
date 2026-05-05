import { Header } from '@/widgets/header';
import { ReactNode } from 'react';

export const revalidate = 300; // ISR: 5 minutes

/**
 * Envolvente Base para páginas Públicas del sistema de NextJS.
 * Garantiza que el `<Header />` de navegación nunca reenderice completo
 * entre clicks internos, actuando como esqueleto común.
 */
export default async function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-stone-50 font-inter text-stone-900 selection:bg-primary/20 overflow-x-hidden w-full">
      <Header />
      
      <main className="flex-1 w-full flex flex-col">
          {children}
      </main>
    </div>
  );
}
