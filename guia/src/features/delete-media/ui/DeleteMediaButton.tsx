'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { deleteMedia } from '@/entities/media';

type Props = {
  mediaId: string;
  onDeleted: (mediaId: string) => void;
};

/**
 * Botón destructivo con confirmación inline profesional (sin window.confirm).
 */
export function DeleteMediaButton({ mediaId, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMedia(mediaId);
      toast.success('Archivo eliminado correctamente de la galería.');
      onDeleted(mediaId);
    } catch (err) {
      console.error(err);
      toast.error('No se pudo eliminar el archivo. Intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[10px] text-white font-medium whitespace-nowrap">¿Eliminar?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Sí'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-widest
        transition-all duration-200 backdrop-blur-sm
        ${isDeleting
           ? 'bg-red-500/50 text-white/50 cursor-not-allowed'
           : 'bg-red-500/80 hover:bg-red-600 text-white shadow-lg'
        }
      `}
      title="Eliminar permanentemente"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Eliminar
    </button>
  );
}
