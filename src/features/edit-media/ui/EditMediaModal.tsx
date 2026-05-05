'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { UploadCloud, FileVideo, ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateMedia, Media } from '@/entities/media';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const MAX_SIZE_MB = 100;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm'];

type EditMediaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetMedia: Media;
  onSuccess: (updatedMedia: Media) => void;
};

export function EditMediaModal({ isOpen, onClose, targetMedia, onSuccess }: EditMediaModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(targetMedia.urlMedia || null);
  const [dragActive, setDragActive] = useState(false);
  
  const [titulo, setTitulo] = useState(targetMedia.titulo || '');
  const [descripcion, setDescripcion] = useState(targetMedia.descripcion || '');
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0); 

  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar states si el usuario cierra y abre el modal agresivamente con otra foto
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitulo(targetMedia.titulo || '');
      setDescripcion(targetMedia.descripcion || '');
      setPreview(targetMedia.urlMedia || null);
      setFile(null);
    }
  }, [isOpen, targetMedia]);

  if (!isOpen) return null;

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_BYTES) {
      toast.error(`Tamaño denegado. El límite operativo es ${MAX_SIZE_MB}MB.`);
      return;
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error('Formato inválido. Use MP4/WEBM u extensiones fotográficas.');
      return;
    }
    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
       setPreview(URL.createObjectURL(selectedFile));
    } else {
       setPreview(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    try {
      setIsUploading(true);
      setProgress(30);
      
      const formData = new FormData();
      // Solo anexamos textos si sufrieron cambios o están rellenados
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);

      // Si adjuntó un archivo nuevo (Quiso reemplazar foto original)
      if (file) {
        formData.append('file', file);
        formData.append('tipo', file.type.startsWith('video/') ? 'video' : 'imagen');
      }

      const interval = setInterval(() => setProgress(p => (p < 90 ? p + 10 : p)), 400);

      const result = await updateMedia(targetMedia.id, formData);
      
      clearInterval(interval);
      setProgress(100);
      
      toast.success('Metadatos y Archivo actualizados correctamente.');
      onSuccess(result);
      
      setTimeout(() => {
         onClose();
         setIsUploading(false);
         setProgress(0);
         setFile(null);
      }, 600);

    } catch (err) {
      console.error(err);
      toast.error('Fallo la comunción al motor de edición. Reintentar.');
      setIsUploading(false);
      setProgress(0);
    }
  };

  // Preview original visual recovery check
  const isVideo = !file ? targetMedia.tipo === 'video' : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => !isUploading && onClose()} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-stone-200">
        
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <h3 className="text-xl font-bold font-fraunces text-stone-dark flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary" /> Editando Galería</h3>
          <button onClick={() => !isUploading && onClose()} disabled={isUploading} className="text-stone-400 hover:text-red-500 disabled:opacity-50 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full px-6 py-6 pb-24">
          <div className="space-y-6">
             
             {/* 1. Zona opcional de Reemplazo Físico */}
             <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0">
                  <Label>Vista del Archivo</Label> 
                  <div className="mt-2 h-32 w-32 md:h-40 md:w-40 bg-stone-200 rounded-xl overflow-hidden border border-stone-300 relative shadow-inner">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Media preview" className="w-full h-full object-cover" />
                    ) : isVideo ? (
                      <video src={`${targetMedia.urlMedia || ''}#t=1`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400"><FileVideo className="h-8 w-8" /></div>
                    )}
                    {file && <span className="absolute bottom-1 right-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">NUEVO</span>}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                   <Label>Reemplazar Documento (Opcional)</Label>
                   <p className="text-xs text-stone-500 mb-3 mt-1 leading-relaxed">
                     Úselo *sólo* si desea desechar la fotografía/video actual y sobreescribirla en la misma posición visual. 
                     De lo contrario déjelo blanco y solo edite sus textos al estilo Instagram.
                   </p>
                   <div 
                     onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                     onClick={() => inputRef.current?.click()}
                     className={`flex-1 min-h-[80px] border-2 border-dashed rounded-xl flex items-center justify-center p-4 cursor-pointer text-sm transition-all
                                ${dragActive ? 'border-primary bg-primary/5 text-primary' : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-500'}`}
                   >
                     {file ? (
                       <span className="font-semibold text-primary block truncate max-w-xs">{file.name} (Lista para Acoplar)</span>
                     ) : (
                       <span className="flex items-center gap-2"><UploadCloud className="h-5 w-5" /> Arrastra reemplazo aquí</span>
                     )}
                   </div>
                   <input ref={inputRef} type="file" className="hidden" accept={ALLOWED_TYPES.join(',')} onChange={handleChange} />
                </div>
             </div>

             <div className="w-full h-px bg-stone-100" />

             {/* 2. Formularios Dinámicos */}
             <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-titulo">Título de Presentación</Label>
                  <Input id="edit-titulo" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej: Explorando aguas turquesas" disabled={isUploading} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="edit-desc">Contenido Histórico / Descriptivo</Label>
                  <textarea 
                    id="edit-desc" 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                    disabled={isUploading}
                    className="mt-1 flex min-h-[100px] w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-dark shadow-sm placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50 resize-none"
                  />
                </div>
             </div>

             {/* Progress Bar (Visible solo si subiendo/actualizando) */}
             {isUploading && (
               <div className="w-full">
                  <div className="flex justify-between text-xs font-semibold text-primary mb-1">
                    <span>Inyectando Modificaciones de Base de Datos...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-white flex justify-end gap-3 absolute bottom-0 left-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <Button variant="outline" onClick={onClose} disabled={isUploading}>Descartar</Button>
           <Button onClick={onSubmit} disabled={isUploading} className="min-w-[140px]">
             {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Procesando...</> : 'Confirmar Edición'}
           </Button>
        </div>

      </div>
    </div>
  );
}
