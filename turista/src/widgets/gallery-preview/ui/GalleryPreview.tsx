'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShuffledGallery } from '@/features/shuffle-gallery/model/useShuffledGallery';
import { Button } from '@/shared/ui/button';
import { ImageIcon, Loader2 } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

const VideoPreview = ({ src, className, paused, onTogglePause }: { src: string, className?: string, paused?: boolean, onTogglePause?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => observer.disconnect();
  }, [paused]);

  // Pausar/reanudar cuando cambia paused
  useEffect(() => {
    if (paused) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play().catch(() => {});
    }
  }, [paused]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      onClick={(e) => {
        e.stopPropagation();
        onTogglePause?.();
      }}
      className={`w-full h-full object-cover ${className || ''}`}
    />
  );
};

export function GalleryPreview() {
  const { images, totalCount, isLoading } = useShuffledGallery();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prevent scroll jump on close
  const scrollPos = useRef(0);
  useEffect(() => {
    if (lightboxOpen) {
      scrollPos.current = window.scrollY;
    } else if (scrollPos.current > 0) {
      window.scrollTo({ top: scrollPos.current, behavior: 'instant' });
    }
  }, [lightboxOpen]);

  // Intersection Observer para stagger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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

  const lightboxSlides = images.map((item) => {
    if (item.isVideo) {
      return {
        type: 'video' as const,
        sources: [{ src: item.src, type: 'video/mp4' }],
        title: undefined,
        description: undefined,
      };
    }
    const isPlaceholder = item.alt === 'Cenote en Homún, Yucatán — Mochotours';
    return {
      src: item.src,
      alt: item.alt,
      title: isPlaceholder ? undefined : 'Homún · Yucatán',
      description: isPlaceholder ? undefined : item.alt,
    };
  });

  // Configuración del Bento Grid Asimétrico (60% Hero, 40% Secondary)
  // Usamos aspect-ratio para que las imágenes mantengan proporciones naturales
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return 'lg:col-span-3 lg:row-span-2 aspect-[4/5] lg:aspect-auto lg:min-h-[500px]';
      case 1:
        return 'lg:col-span-2 lg:row-span-1 aspect-[4/3] lg:aspect-auto lg:min-h-[240px]';
      case 2:
        return 'lg:col-span-1 lg:row-span-1 aspect-square lg:aspect-auto lg:min-h-0';
      case 3:
        return 'lg:col-span-1 lg:row-span-1 aspect-square lg:aspect-auto lg:min-h-0';
      default:
        return 'aspect-[4/3] lg:aspect-auto lg:min-h-[240px]';
    }
  };

  return (
    <>
      <section ref={sectionRef} className="bg-[#FAF8F4] py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* ═══ ENCABEZADO ═══ */}
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              GALERÍA · FOTOS Y VIDEOS
            </span>
            <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-stone-900 mt-3">
              Vive los cenotes de Homún en imágenes
            </h2>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-base lg:text-lg font-light leading-relaxed">
              Fotos y videos reales de los cenotes de Homún, Yucatán: aguas turquesas cristalinas, cavernas milenarias, cenotes tipo gruta y cenotes abiertos. Imágenes tomadas durante tours reales con turistas de todo el mundo.
            </p>
          </div>

          {/* ═══ GRID MASONRY ═══ */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-5 lg:auto-rows-[minmax(200px,1fr)] lg:grid-rows-2 gap-5 lg:gap-3">
              {images.map((img, index) => {
                const isPlaceholder = img.alt === 'Cenote en Homún, Yucatán — Mochotours';
                return (
                <div
                  key={img.src + index}
                  className={`relative ${getBentoClasses(index)} rounded-2xl overflow-hidden shadow-[0px_12px_32px_-16px_rgba(0,0,0,0.18)] hover:shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.28)] hover:scale-[1.015] cursor-zoom-in group transition-all duration-500 w-full ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  onClick={() => openLightbox(index)}
                >
                  {img.isVideo ? (
                    <VideoPreview 
                      src={img.src} 
                      paused={lightboxOpen || videoPaused} 
                      onTogglePause={() => setVideoPaused(p => !p)}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iMTEwIj48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgZmlsbD0iI2U1ZTVlNSIvPjwvc3ZnPg=="
                      unoptimized={true}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Badge de VIDEO y Lupa de ZOOM */}
                  {img.isVideo ? (
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">
                      <span className="text-[10px] font-bold tracking-widest text-white/90">VIDEO</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 z-20 lg:hidden w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-white text-[10px]">🔍</span>
                    </div>
                  )}

                  {/* Overlay cinemático con título del Cenote (Oculto en placeholders) */}
                  {!isPlaceholder && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end items-start text-left p-6">
                      <span className="text-white/90 text-[11px] font-semibold tracking-[0.1em] uppercase mb-1 drop-shadow-md translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        HOMÚN · YUCATÁN
                      </span>
                      <p className="text-white font-medium text-[15px] tracking-wide translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                        {img.alt}
                      </p>
                      {img.description && (
                        <p className="text-white/80 text-sm mt-1 line-clamp-2 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md delay-100">
                          {img.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Firma / Borde de la marca */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-primary/60 group-hover:ring-inset transition-all duration-300 z-20 pointer-events-none" />
                </div>
              )})}
            </div>
          )}

          {/* ═══ BOTÓN INFERIOR ═══ */}
          <div className="flex justify-center mt-12 lg:mt-16">
            <Link href="/galeria">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 group h-14"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Ver galería completa{totalCount > 0 ? ` (${totalCount === 1 ? '1 foto' : `${totalCount} fotos`})` : ''}
              </Button>
            </Link>
          </div>

        </div>
      </section>

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
    </>
  );
}
