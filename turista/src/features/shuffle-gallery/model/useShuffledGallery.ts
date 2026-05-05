import { useState, useEffect } from 'react';
import { getGallery } from '@/entities/media/api/mediaApi';
import { FALLBACK_DATA } from '@/shared/config/public-data';

type GalleryImage = {
  src: string;
  alt: string;
  description?: string;
  isVideo?: boolean;
};

/** Fisher-Yates shuffle */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Hook que obtiene fotos de la galería del backend,
 * las mezcla aleatoriamente y devuelve 4.
 * Si el backend falla, usa las fotos locales de fallback.
 */
export function useShuffledGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const TARGET = 4; // Siempre mostrar 4 fotos

    const fetchGallery = async () => {
      try {
        const res = await getGallery({ page: 1, limit: 100 });
        const items = res.data;

        if (items && items.length > 0) {
          // Convertir datos del backend al formato visual
          const mapped: GalleryImage[] = items.map((item) => ({
            src: item.urlMedia || '',
            alt: item.titulo || 'Cenote en Homún, Yucatán — Mochotours',
            description: item.descripcion || '',
            isVideo: item.tipo === 'video',
          }));
          const shuffled = shuffleArray(mapped);

          if (shuffled.length >= TARGET) {
            // Hay suficientes del backend
            setImages(shuffled.slice(0, TARGET));
          } else {
            // No alcanzan → completar con fotos locales
            const needed = TARGET - shuffled.length;
            const localPool = shuffleArray(
              FALLBACK_DATA.galeriaPreview.filter(
                (local) => !shuffled.some((s) => s.src === local.src)
              )
            );
            setImages([...shuffled, ...localPool.slice(0, needed)]);
          }

          setTotalCount(res.meta?.total || items.length);
        } else {
          // BD vacía → todo local
          applyFallback();
        }
      } catch {
        // Red caída → todo local
        applyFallback();
      } finally {
        setIsLoading(false);
      }
    };

    const applyFallback = () => {
      const shuffled = shuffleArray(FALLBACK_DATA.galeriaPreview);
      setImages(shuffled.slice(0, TARGET));
      setTotalCount(shuffled.length);
    };

    fetchGallery();
  }, []);

  return { images, totalCount, isLoading };
}
