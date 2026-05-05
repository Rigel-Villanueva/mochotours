'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { Media } from '../model/types';
import { ReactNode } from 'react';

type Props = {
  media: Media;
  actions?: ReactNode; // Inyección de botones (Eliminar, Ver)
};

/**
 * Entidad Visual que renderiza un elemento fotográfico o de video en formato cuadrícula.
 */
export function MediaCard({ media, actions }: Props) {
  const isVideo = media.tipo === 'video';
  // Si el backend envía la URL construida en `urlMedia`, la usamos, si no componemos una aproximado
  // suponiendo supabase public bucket como fallback rápido si urlMedia no viene formateado.
  const sourceUrl = media.urlMedia || `https://nsbjrbpfclxyvgvzqpdt.supabase.co/storage/v1/object/public/${media.bucket}/${media.storage_path}`;

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center transition-all hover:scale-[1.02]">
      
      {/* Contenido Base */}
      {isVideo ? (
         <video 
           src={`${sourceUrl}#t=0.5`} // forzamos un frame poster automático para videos mp4
           className="h-full w-full object-cover" 
           preload="metadata"
           muted
         />
      ) : (
         <Image 
           src={sourceUrl}
           alt={media.titulo || 'Cenote aventura gallery media'}
           fill
           sizes="(max-width: 768px) 50vw, 33vw"
           className="object-cover"
         />
      )}

      {/* Badge Superior Izquierdo */}
      <span className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase">
        {media.tipo}
      </span>

      {/* Icono de Reproducción superpuesto suave para videos */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Play fill="white" className="h-10 w-10 text-white/80 drop-shadow-lg" />
        </div>
      )}

      {/* Overlay con Título y Acciones (Siempre visible en Móvil, Hover en PCs) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 z-20 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
        
        <div className="flex-1 flex items-center justify-center transform transition-all delay-75 duration-300 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100">
           {actions}
        </div>

        {media.titulo && (
          <h5 className="text-white text-sm font-medium truncate drop-shadow-md">
            {media.titulo}
          </h5>
        )}
      </div>

    </div>
  );
}
