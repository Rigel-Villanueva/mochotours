import { Metadata } from 'next';
import { SiteContentManager } from '@/widgets/site-content-form/ui/SiteContentManager';

export const metadata: Metadata = {
  title: 'Contenido del Sitio | Admin Mochotours',
};

export default function AdminContenidoPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-fraunces text-stone-900">
          Contenido del Sitio
        </h1>
        <p className="text-stone-500 mt-2">
          Gestiona los textos principales, títulos y configuraciones de las secciones del sitio web.
        </p>
      </div>

      <SiteContentManager />
    </div>
  );
}
