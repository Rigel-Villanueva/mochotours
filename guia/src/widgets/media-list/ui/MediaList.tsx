'use client';

import { useState, useEffect } from 'react';
import { getGallery, Media, Meta } from '@/entities/media';
import { MediaCard } from '@/entities/media';
import { DeleteMediaButton } from '@/features/delete-media';
import { EditMediaModal } from '@/features/edit-media';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { RefreshCcw, Loader2, Info, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  refreshTrigger: number; // forzaremos un refetching si la página cambia la id
  onTotalAssigned?: (totalElements: number) => void;
};

export function MediaList({ refreshTrigger, onTotalAssigned }: Props) {
  const [items, setItems] = useState<Media[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ref para el Modal de Edición
  const [editingItem, setEditingItem] = useState<Media | null>(null);

  const handleItemUpdated = (updatedMedia: Media) => {
     setItems(prev => prev.map(media => media.id === updatedMedia.id ? updatedMedia : media));
  };

  const fetchInitial = async () => {
    try {
      setIsLoading(true);
      const res = await getGallery({ page: 1, limit: 12 });
      if (res && res.data) {
         setItems(res.data);
         setMeta(res.meta);
         if (onTotalAssigned) onTotalAssigned(res.meta.total);
      }
    } catch (err) {
      console.error(err);
      toast.error('No se pudo establecer conexión con la base de datos de fotografías.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const loadMore = async () => {
    if (!meta || !meta.hasNext) return;
    
    try {
      setIsLoadingMore(true);
      const res = await getGallery({ page: meta.page + 1, limit: 12 });
      if (res && res.data) {
         setItems(prev => [...prev, ...res.data]);
         setMeta(res.meta);
         if (onTotalAssigned) onTotalAssigned(res.meta.total);
      }
    } catch {
      toast.error('Hubo un error recuperando subsecuentes fotos.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleItemDeleted = (deletedId: string) => {
     setItems(prev => prev.filter(media => media.id !== deletedId));
     // Alentamos al usuario actualizando el contador base restando 1 inteligentemente
     if (meta && onTotalAssigned) onTotalAssigned(meta.total - 1);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-6 border-2 border-dashed border-stone-200 rounded-2xl bg-white text-center">
        <div className="h-16 w-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4 shadow-inner">
          <Info className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold font-fraunces text-stone-400">Galería Vacía</h3>
        <p className="mt-2 text-stone-500 max-w-sm">No existen tesoros visuales guardados aquí. Arrastra una foto en el botón verde de &quot;Subir&quot; para empezar tu colección pública.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      {/* Grid Responsivo de 4 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
         {items.map((mediaItem) => (
           <MediaCard 
              key={mediaItem.id} 
              media={mediaItem} 
              actions={
                <div className="flex items-center gap-2">
                   <Button 
                     onClick={() => setEditingItem(mediaItem)} 
                     size="sm" 
                     className="bg-white/90 hover:bg-white text-stone-800 shadow-xl backdrop-blur-md rounded-md h-8 px-3 text-xs"
                   >
                     <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Editar
                   </Button>
                   <DeleteMediaButton mediaId={mediaItem.id} onDeleted={handleItemDeleted} />
                </div>
              }
           />
         ))}
      </div>
      
      {/* Paginación Inferior Visual */}
      {meta?.hasNext && (
        <div className="flex justify-center pt-8 pb-12">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={loadMore} 
            disabled={isLoadingMore}
            className="rounded-full shadow-sm hover:shadow-md transition-shadow px-8 text-stone-600 hover:text-stone-900 border-stone-300"
          >
            {isLoadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            {isLoadingMore ? 'Cargando más tesoros...' : 'Cargar Más Visuales'}
          </Button>
        </div>
      )}

      {/* Editor Remoto */}
      {editingItem && (
        <EditMediaModal 
           isOpen={!!editingItem} 
           onClose={() => setEditingItem(null)} 
           targetMedia={editingItem} 
           onSuccess={handleItemUpdated} 
        />
      )}
    </div>
  );
}
