'use client';

import { useState } from 'react';
import { UploadForm } from '@/features/upload-media';
import { Media } from '@/entities/media';
import { Button } from '@/shared/ui/button';
import { CloudUpload } from 'lucide-react';

type Props = {
  onMediaUploaded: (newMedia: Media) => void;
};

/**
 * Entidad agrupadora que expone el Botón de carga global y oculta el Modal de Drag and Drop
 */
export function MediaUploader({ onMediaUploaded }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
       <Button 
         onClick={() => setIsModalOpen(true)}
         size="lg"
         className="bg-primary hover:bg-primary/90 text-white shadow-lg w-full sm:w-auto h-12 px-6"
       >
         <CloudUpload className="mr-2 h-5 w-5" />
         Subir Fotografía o Video
       </Button>

       <UploadForm 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSuccess={onMediaUploaded}
       />
    </>
  );
}
