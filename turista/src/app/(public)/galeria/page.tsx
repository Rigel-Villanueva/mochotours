'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/shared/api/apiClient';
import { ALBUMS } from '@/shared/config/api-endpoints';
import { FolderOpen, Loader2, Home, ChevronRight } from 'lucide-react';
import { FALLBACK_DATA } from '@/shared/config/public-data';

// ── Types ───────────────────────────────────────────────────────────

type Album = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  coverUrl: string | null;
  destacado: boolean;
  totalItems: number;
  photosCount: number;
  videosCount: number;
};

type GlobalStats = {
  totalAlbums: number;
  totalPhotos: number;
  totalVideos: number;
};

function formatStats(photos: number, videos: number) {
  const parts = [];
  if (photos > 0) parts.push(`${photos} ${photos === 1 ? 'foto' : 'fotos'}`);
  if (videos > 0) parts.push(`${videos} ${videos === 1 ? 'video' : 'videos'}`);
  return parts.join(' · ') || '0 items';
}

// ── Component ───────────────────────────────────────────────────────

export default function GaleriaPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [stats, setStats] = useState<GlobalStats>({ totalAlbums: 0, totalPhotos: 0, totalVideos: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get<{ success: true; data: Album[] }>(
          ALBUMS, { includeStats: 'true', limit: 50 }
        );
        const albumsData = res.data;
        setAlbums(albumsData);

        setStats({
          totalAlbums: albumsData.length,
          totalPhotos: albumsData.reduce((sum, a) => sum + a.photosCount, 0),
          totalVideos: albumsData.reduce((sum, a) => sum + a.videosCount, 0),
        });
      } catch {
        // Fallback local robusto: Si la API se cae, mostramos el contenido local duro
        const fallbackPhotos = FALLBACK_DATA.galeriaPreview.length;
        const fallbackVideos = 0; // galeriaPreview no tiene videos hardcodeados actualmente
        
        const fallbackAlbum: Album = {
          id: 'fallback-general',
          titulo: 'Galería General',
          slug: 'general',
          descripcion: 'Colección destacada de nuestros cenotes en Homún.',
          coverUrl: FALLBACK_DATA.galeriaPreview[0]?.src || '',
          destacado: true,
          totalItems: FALLBACK_DATA.galeriaPreview.length,
          photosCount: fallbackPhotos,
          videosCount: fallbackVideos,
        };

        setAlbums([fallbackAlbum]);
        setStats({
          totalAlbums: 1,
          totalPhotos: fallbackPhotos,
          totalVideos: fallbackVideos,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">

        {/* ═══ HEADER ═══ */}
        <div className="mb-12">
          {/* ═══ PREMIUM BREADCRUMB ═══ */}
          <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-500 mb-8 font-medium overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/#galeria" className="hover:text-green-700 transition-colors flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200/60 shadow-sm">
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <span className="text-green-800 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 shadow-sm truncate">
              Galería
            </span>
          </nav>

          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
            Galería
          </h1>
          <p className="text-stone-500 mt-4 text-lg font-light max-w-2xl leading-relaxed">
            Explora nuestras colecciones de fotos y videos reales de los cenotes en Homún, Yucatán.
          </p>
          
          {/* Stats Globales */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-green-600/40" />
            <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-green-700">
              {stats.totalAlbums} ÁLBUM{stats.totalAlbums !== 1 ? 'ES' : ''} · {stats.totalPhotos} FOTOS · {stats.totalVideos} VIDEO{stats.totalVideos !== 1 ? 'S' : ''}
            </p>
            <div className="h-[1px] w-8 bg-green-600/40" />
          </div>
        </div>

        {/* ═══ LOADING ═══ */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="h-16 w-16 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500 text-lg">Próximamente nuevas colecciones.</p>
          </div>
        ) : (
          /* ═══ GRID DE ÁLBUMES ═══ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/galeria/${album.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-[12px] overflow-hidden border border-stone-200/80 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 relative">
                  
                  {/* Badge destacado */}
                  {album.destacado && (
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] tracking-widest uppercase text-green-800 font-medium shadow-sm">
                      Destacado
                    </div>
                  )}

                  {/* Cover */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    {album.coverUrl ? (
                      album.coverUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video
                          src={album.coverUrl}
                          muted
                          playsInline
                          loop
                          autoPlay
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <Image
                          src={album.coverUrl}
                          alt={album.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FolderOpen className="h-12 w-12 text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 bg-white">
                    <p className="text-[10px] tracking-widest uppercase text-green-700 font-semibold mb-2">
                      Homún · Yucatán
                    </p>
                    <h3 className="font-fraunces text-xl font-medium text-stone-900 group-hover:text-green-800 transition-colors capitalize">
                      {album.titulo.toLowerCase()}
                    </h3>
                    {album.descripcion && (
                      <p className="text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {album.descripcion}
                      </p>
                    )}
                    <p className="text-stone-400 text-xs mt-4 font-medium">
                      {formatStats(album.photosCount, album.videosCount)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
