'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { updateSection, SiteSection } from '@/entities/site-content';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

// Tipado del Formulario Interno
type SectionFormData = {
  titulo: string;
  descripcion: string;
  file: FileList;
};

type Props = {
  seccionId: string;
  seccionActual?: SiteSection;
  onSuccess: (updatedSection: SiteSection) => void;
  onCancel?: () => void;
};

export function SectionForm({ seccionId, seccionActual, onSuccess, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(seccionActual?.imagenUrl || null);

  const { register, handleSubmit } = useForm<SectionFormData>({
    defaultValues: {
      titulo: seccionActual?.titulo || '',
      descripcion: seccionActual?.descripcion || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // Muestra preview instantanea del archivo local
    }
  };

  const onSubmit = async (data: SectionFormData) => {
    try {
      setIsSubmitting(true);
      
      const form = new FormData();
      form.append('seccion', seccionId); // Requisito del backend
      
      if (data.titulo) form.append('titulo', data.titulo);
      if (data.descripcion) form.append('descripcion', data.descripcion);
      if (data.file && data.file.length > 0) {
        form.append('file', data.file[0]);
      }

      const updated = await updateSection(form);
      toast.success('Sección actualizada con éxito');
      onSuccess(updated);
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al guardar la sección.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24 md:pb-0">
      
      <div>
        <Label htmlFor="titulo">Título de la sección</Label>
        <Input 
          id="titulo" 
          placeholder="Escriba el título público..." 
          {...register('titulo')} 
        />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea 
          id="descripcion" 
          className="flex min-h-[120px] w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-dark shadow-sm placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Texto que aparecerá debajo del título..."
          {...register('descripcion')}
        />
      </div>

      {/* Upload visual */}
      <div>
        <Label>Imagen Representativa</Label>
        <div className="mt-2 flex items-center gap-6">
          <div className="relative flex h-32 w-48 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-300 bg-stone-50">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-stone-400">
                <ImageIcon className="h-8 w-8 mb-2" />
                <span className="text-xs">Sin imagen</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Label 
              htmlFor="file-upload" 
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 hover:text-stone-900 transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
              Sustituir fotografía
            </Label>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              className="hidden"
              {...register('file')}
              onChange={(e) => {
                register('file').onChange(e); // Propagar a RHF
                handleImageChange(e);
              }}
            />
            <p className="text-xs text-stone-500">
              Usa fotos en formato JPG o PNG. Optimizaremos la carga automáticamente.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 md:relative md:border-0 z-50 md:p-0 md:pt-4 md:bg-transparent">
        <div className="flex gap-3 md:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 md:flex-none">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none md:min-w-[200px]">
            {isSubmitting ? (
               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando</>
            ) : (
               'Guardar Cambios'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
