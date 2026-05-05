'use client';

import { useState } from 'react';
import { MediaUploader } from '@/widgets/media-uploader';
import { MediaList } from '@/widgets/media-list';

export default function AdminGaleriaPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMediaUploaded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-fraunces text-stone-900">
          Gestión de Galería
        </h1>
        <p className="text-stone-500 mt-2">
          Sube, edita y organiza las fotos y videos que se mostrarán en la galería pública.
        </p>
      </div>

      <div className="mb-12">
        <MediaUploader onMediaUploaded={handleMediaUploaded} />
      </div>
      
      <div>
        <MediaList refreshTrigger={refreshKey} />
      </div>
    </div>
  );
}
