'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/shared/api/apiClient';
import { ALBUM_BY_SLUG, GALLERY } from '@/shared/config/api-endpoints';
import { Play, Loader2, ImageIcon, Home, ChevronRight } from 'lucide-react';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

// ── Types ───────────────────────────────────────────────────────────

type Album = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

type GaleriaItem = {
  id: string;
  urlMedia: string;
  tipo: 'imagen' | 'video';
  titulo: string | null;
  descripcion: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type FilterType = 'todo' | 'imagen' | 'video';

type DisplayImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
  tipo: 'imagen' | 'video';
  width: number | null;
  height: number | null;
};

// ── Masonry breakpoints ─────────────────────────────────────────────

const masonryBreakpoints = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 2,
};

// ── Component ───────────────────────────────────────────────────────

export default function AlbumPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [items, setItems] = useState<DisplayImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [filter, setFilter] = useState<FilterType>('todo');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const gridEndRef = useRef<HTMLDivElement>(null);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mapItems = (data: GaleriaItem[]): DisplayImage[] =>
    data.map((item) => ({
      src: item.urlMedia || '',
      alt: item.altText || item.titulo || 'Homún · Yucatán',
      title: item.titulo || '',
      description: item.descripcion || '',
      tipo: item.tipo,
      width: item.width,
      height: item.height,
    }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch album info
        const albumRes = await apiClient.get<{ success: true; data: Album }>(
          ALBUM_BY_SLUG(slug)
        );
        setAlbum(albumRes.data);

        // Fetch album items
        const galRes = await apiClient.get<{ success: true; data: GaleriaItem[]; meta: { hasNext: boolean } }>(
          GALLERY, { albumId: albumRes.data.id, limit: 20, page: 1 }
        );
        setItems(mapItems(galRes.data));
        setHasMore(galRes.meta?.hasNext ?? false);
      } catch {
        // Fallback local robusto para el álbum general
        if (slug === 'general') {
          setAlbum({
            id: 'fallback-general',
            titulo: 'Galería General',
            slug: 'general',
            descripcion: 'Colección destacada de nuestros cenotes en Homún.',
            metaTitle: null,
            metaDescription: null,
          });
          setItems(FALLBACK_DATA.galeriaPreview.map((i) => ({
            src: i.src,
            alt: i.alt,
            title: 'Homún · Yucatán',
            description: i.alt,
            tipo: 'imagen',
            width: null,
            height: null,
          })));
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // 10.3 — Inyectar title, meta description y canonical dinámicos para SEO
  useEffect(() => {
    if (!album) return;

    const albumTitle = album.metaTitle || `${album.titulo} — Cenotes de Homún`;
    const albumDesc = album.metaDescription || `Fotos y videos de ${album.titulo} en Homún, Yucatán. ${album.descripcion || 'Descubre las aguas turquesas y cavernas milenarias.'}`;
    const canonicalUrl = `https://cenotesmochotours.com/galeria/${slug}`;

    // Title
    document.title = `${albumTitle} | Mochotours — Cenotes en Homún`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', albumDesc);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [album, slug]);

  // Manejo global de videos (pausar al salir de la pestaña y tap para play/pausa en móvil)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.querySelectorAll('video').forEach(vid => {
          if (!vid.paused) vid.pause();
        });
      }
    };

    const handleVideoTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'VIDEO') {
        const vid = target as HTMLVideoElement;
        
        // En móviles (touch), el navegador no pausa al tocar el centro (solo muestra controles).
        // Aplicamos el toggle manual solo para touch, evitando la zona inferior de controles (60px).
        if (vid.hasAttribute('controls') || target.closest('.yarl__slide_video')) {
          const rect = vid.getBoundingClientRect();
          const touchY = e.changedTouches[0].clientY - rect.top;
          const isControlsArea = (rect.height - touchY) <= 60;

          if (!isControlsArea) {
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
            if (vid.paused) {
              vid.play();
            } else {
              vid.pause();
            }
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchend', handleVideoTouchEnd as EventListener, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchend', handleVideoTouchEnd as EventListener, true);
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (!album || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await apiClient.get<{ success: true; data: GaleriaItem[]; meta: { hasNext: boolean } }>(
        GALLERY, { albumId: album.id, limit: 20, page: nextPage }
      );
      setItems(prev => [...prev, ...mapItems(res.data)]);
      setHasMore(res.meta?.hasNext ?? false);
      setPage(nextPage);
      setTimeout(() => {
        gridEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  }, [album, loadingMore, hasMore, page]);

  // Filtering
  const filteredItems = filter === 'todo' ? items : items.filter(i => i.tipo === filter);
  const photosCount = items.filter(i => i.tipo === 'imagen').length;
  const videosCount = items.filter(i => i.tipo === 'video').length;

  // Lightbox slides
  const lightboxSlides = filteredItems.map((item) => {
    const slideTitle = item.title || item.alt || 'Homún · Yucatán';
    const slideDesc = item.description || undefined;
    if (item.tipo === 'video') {
      return {
        type: 'video' as const,
        sources: [{ src: item.src, type: 'video/mp4' }],
        // Los videos no muestran título/descripción para no tapar contenido visual
        title: undefined,
        description: undefined,
      };
    }
    return {
      src: item.src,
      alt: item.alt,
      title: slideTitle,
      description: slideDesc,
    };
  });

  // Filters config
  const filters: { key: FilterType; label: string }[] = [
    { key: 'todo', label: 'Todo' },
    { key: 'imagen', label: 'Fotos' },
    { key: 'video', label: 'Videos' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (notFound || !album) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500 text-lg">Álbum no encontrado</p>
        <Link href="/galeria" className="text-green-700 hover:text-green-800 text-sm underline">
          Volver a la galería
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">

        {/* ═══ PREMIUM BREADCRUMB ═══ */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-500 mb-8 font-medium overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/#galeria" className="hover:text-green-700 transition-colors flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200/60 shadow-sm">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          <Link href="/galeria" className="hover:text-green-700 transition-colors bg-white px-3 py-1.5 rounded-full border border-stone-200/60 shadow-sm">
            Galería
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
          <span className="text-green-800 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 shadow-sm truncate">
            {album.titulo}
          </span>
        </nav>

        {/* ═══ HEADER ═══ */}
        <div className="mb-6">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
            {album.titulo}
          </h1>
          {album.descripcion && (
            <p className="text-stone-500 mt-4 text-lg font-light max-w-2xl leading-relaxed">
              {album.descripcion}
            </p>
          )}
        </div>

        {/* ═══ STATS EDITORIAL ═══ */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] w-8 bg-green-600/40" />
          <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-green-700">
            {photosCount} FOTOS · {videosCount} VIDEO{videosCount !== 1 ? 'S' : ''}
          </p>
          <div className="h-[1px] w-8 bg-green-600/40" />
        </div>

        {/* ═══ FILTROS ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 mb-12">
          <div className="flex gap-8 sm:gap-10">
            {filters.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`pb-3 text-[15px] transition-all relative ${
                    isActive
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400 font-normal hover:text-gray-700'
                  }`}
                >
                  {f.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-[0.5px] bg-gray-200 -mt-12 mb-12" />

        {/* ═══ MASONRY GRID ═══ */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="h-12 w-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">No hay elementos en esta categoría.</p>
          </div>
        ) : (
          <>
            <Masonry
              breakpointCols={masonryBreakpoints}
              className="flex gap-4 sm:gap-6"
              columnClassName="flex flex-col gap-4 sm:gap-6"
            >
              {filteredItems.map((item, i) => (
                <div
                  key={`${item.src}-${i}`}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  {item.tipo === 'video' ? (
                    <div className="relative aspect-video bg-stone-900 rounded-xl overflow-hidden">
                      <video
                        src={item.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      {/* Glassmorphism Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-7 w-7 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={item.width || 800}
                        height={item.height || 600}
                        className="w-full h-auto rounded-xl group-hover:brightness-95 transition-all"
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Hover Caption */}
                  {(item.title || item.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity sm:block hidden">
                      {item.title && (
                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      )}
                      {item.description && (
                        <p className="text-white/70 text-xs truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                  )}

                  {/* Mobile always-visible caption */}
                  {(item.title || item.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent sm:hidden block">
                      {item.title && (
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                      )}
                    </div>
                  )}

                  {/* Tipo badge */}
                  {item.tipo === 'video' ? null : (
                    <span className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="h-3 w-3 inline mr-1" />
                      Foto
                    </span>
                  )}
                </div>
              ))}
            </Masonry>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  Cargar más
                </button>
              </div>
            )}

            <div ref={gridEndRef} />
          </>
        )}
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Captions, Video]}
        carousel={{ finite: true }}
        captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 3 }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />

      {/* ═══ JSON-LD Schema ═══ */}
      {album && (
        <>
          <link rel="canonical" href={`https://cenotesmochotours.com/galeria/${album.slug}`} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ImageGallery',
                name: album.metaTitle || album.titulo,
                description: album.metaDescription || album.descripcion || `Galería de fotos: ${album.titulo}`,
                url: `https://cenotesmochotours.com/galeria/${album.slug}`,
                numberOfItems: items.length,
              }),
            }}
          />
        </>
      )}
    </div>
  );
}
