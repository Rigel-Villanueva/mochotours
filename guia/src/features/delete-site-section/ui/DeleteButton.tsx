'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { deleteSection } from '@/entities/site-content';
import { Button } from '@/shared/ui/button';

type Props = {
  seccionId: string;
  onDeleted: (seccionId: string) => void;
};

export function DeleteButton({ seccionId, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSection(seccionId);
      toast.success('Sección eliminada correctamente.');
      onDeleted(seccionId);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar la sección. Intenta de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <span className="text-xs text-stone-600 whitespace-nowrap">¿Eliminar?</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-7 px-2.5 text-xs"
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Sí'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          className="h-7 px-2.5 text-xs"
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
      title="Eliminar sección"
    >
      {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
    </Button>
  );
}
