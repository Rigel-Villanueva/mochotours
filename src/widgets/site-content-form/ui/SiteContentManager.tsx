'use client';

import { useEffect, useState } from 'react';
import { getSiteContent, SiteContent, SiteSection } from '@/entities/site-content';
import { SectionForm } from '@/features/edit-site-section';
import { DeleteButton } from '@/features/delete-site-section';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { PlusCircle, ImageIcon, Edit3, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Claves maestras
const BASE_SECTIONS = ['hero_banner', 'about_us', 'experience_mototaxi', 'location', 'footer'];

// Nombres amigables para las secciones
const SECTION_NAMES: Record<string, string> = {
  'hero_banner': '1. Banner Principal',
  'about_us': '2. Sobre el Guía',
  'experience_mototaxi': '3. Experiencia',
  'location': '4. Ubicación',
  'footer': '5. Pie de Página'
};

function StatusBadge({ type, hasContent }: { type: 'text' | 'image'; hasContent: boolean }) {
  if (hasContent) {
    return (
      <span className="text-xs text-green-700 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {type === 'text' ? 'Texto completo' : 'Imagen cargada'}
      </span>
    );
  }
  return (
    <span className="text-xs text-amber-600 flex items-center gap-1">
      <AlertTriangle className="w-3.5 h-3.5" />
      {type === 'text' ? 'Sin texto' : 'Sin imagen'}
    </span>
  );
}

export function SiteContentManager() {
  const [contentMap, setContentMap] = useState<SiteContent>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // seccion seleccionada para edición
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getSiteContent();
      setContentMap(data || {});
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un problema cargando los datos actuales del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSuccess = (updated: SiteSection) => {
    setContentMap((prev) => ({ ...prev, [updated.seccion]: updated }));
    setEditingKey(null);
    setIsCreatingNew(false);
    setNewSectionKey('');
  };

  const handleDeleteSuccess = (seccionKey: string) => {
    setContentMap((prev) => {
      const clone = { ...prev };
      delete clone[seccionKey];
      return clone;
    });
  };

  // Prepara una lista consolidada: Base sections + any custom sections from DB
  const dynamicKeys = Object.keys(contentMap).filter((k) => !BASE_SECTIONS.includes(k));
  const allSectionsToDisplay = [...BASE_SECTIONS, ...dynamicKeys];

  return (
    <div className="pb-10">
      
      {/* ── Grid de Tarjetas ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-5 flex flex-col gap-3">
               <Skeleton className="h-32 w-full rounded-lg mb-2" />
               <Skeleton className="h-4 w-3/4 rounded-full" />
               <Skeleton className="h-3 w-1/2 rounded-full" />
            </Card>
          ))
        ) : (
          <>
            {allSectionsToDisplay.map((secKey) => {
              const data = contentMap[secKey];
              const friendlyName = SECTION_NAMES[secKey] || secKey;
              
              return (
                <div 
                  key={secKey} 
                  onClick={() => { setEditingKey(secKey); setIsCreatingNew(false); }}
                  className="bg-white rounded-xl border border-stone-200 p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  {/* Thumbnail / Preview */}
                  <div className="aspect-video rounded-lg overflow-hidden bg-stone-100 mb-4 relative">
                    {data?.imagenUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.imagenUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-50">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h4 className="font-bold text-stone-800 text-lg leading-tight mb-0.5">
                      {friendlyName}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-mono mb-3 uppercase tracking-wider">
                      {secKey}
                    </p>
                    
                    {!data?.titulo && !data?.descripcion && !data?.imagenUrl ? (
                      <div className="mt-auto p-3 bg-amber-50 rounded-lg text-center border border-amber-100/50">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mx-auto mb-1.5" />
                        <p className="text-xs font-medium text-amber-800 mb-2">
                          Esta sección está vacía
                        </p>
                        <span className="text-xs font-semibold text-primary flex items-center justify-center gap-1">
                          Agregar contenido <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ) : (
                      <div className="mt-auto flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <StatusBadge type="text" hasContent={!!data?.descripcion || !!data?.titulo} />
                          <StatusBadge type="image" hasContent={!!data?.imagenUrl} />
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs rounded-lg transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar
                          </button>
                          
                          {data && !BASE_SECTIONS.includes(secKey) && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <DeleteButton seccionId={secKey} onDeleted={handleDeleteSuccess} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Tarjeta para Nueva Sección Custom */}
            {isCreatingNew ? (
              <div className="p-5 border-2 border-dashed border-primary rounded-xl bg-primary/5 text-center flex flex-col justify-center">
                 <p className="text-sm text-primary font-medium mb-3">Defina la clave (URL) de su bloque</p>
                 <input 
                   type="text" 
                   value={newSectionKey}
                   onChange={e => setNewSectionKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                   placeholder="ej_ seccion_extra"
                   className="w-full text-center p-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-3 bg-white text-sm"
                   autoFocus
                 />
                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsCreatingNew(false)}>Cancelar</Button>
                   <Button 
                     size="sm" 
                     className="flex-1"
                     disabled={newSectionKey.length < 3}
                     onClick={() => {
                       setEditingKey(newSectionKey);
                       setIsCreatingNew(false);
                     }}
                   >
                     Crear
                   </Button>
                 </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => { setIsCreatingNew(true); setEditingKey(null); }}
                className="w-full h-full min-h-[250px] text-stone-500 hover:text-primary hover:bg-primary/5 hover:border-primary border-2 border-dashed border-stone-200 bg-white rounded-xl flex flex-col items-center justify-center gap-2"
              >
                <PlusCircle className="h-8 w-8 mb-2 opacity-50" />
                <span className="font-medium text-sm">+ Agregar sección personalizada</span>
              </Button>
            )}
          </>
        )}
      </div>

      {/* ── Modal de Edición (Mobile Drawer / Desktop Centered) ── */}
      {editingKey && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-stone-900/60 backdrop-blur-sm sm:p-4">
          <div 
            className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-stone-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-800 font-fraunces leading-tight">
                  Editando {SECTION_NAMES[editingKey] || 'Sección'}
                </h3>
                <p className="text-stone-500 mt-1.5 text-xs">
                  ID: <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{editingKey}</span>
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50">
              <SectionForm 
                key={editingKey} 
                seccionId={editingKey} 
                seccionActual={contentMap[editingKey]} 
                onSuccess={handleUpdateSuccess}
                onCancel={() => {
                  setEditingKey(null);
                  setIsCreatingNew(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
