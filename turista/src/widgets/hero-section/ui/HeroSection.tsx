'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCachedSiteContent } from '@/shared/lib/resilientData';
import { SiteSection } from '@/entities/site-content';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import { ChevronDown, MessageCircle, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export function HeroSection() {
  const { data: FALLBACK_DATA } = useTranslation();
  const [data, setData] = useState<SiteSection | null>(null);
  
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await getCachedSiteContent();
        if (res?.hero_banner) {
          setData(res.hero_banner);
        }
      } catch {
        // 3 capas: backend → cache → fallback local (FALLBACK_DATA)
      }
    };
    fetchHeroData();
  }, []);

  // Preferimos Datos Servidor, Caemos Graciosamente a Datos Locales
  const titulo = data?.titulo || FALLBACK_DATA.heroBanner.titulo;
  const descripcion = data?.descripcion || FALLBACK_DATA.heroBanner.descripcion;
  const imagenUrl = data?.imagenUrl || FALLBACK_DATA.heroBanner.imagenUrl;
  const washappNumber = FALLBACK_DATA.contacto.telefono_whatsapp_principal;

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden bg-stone-900">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image 
          src={imagenUrl}
          alt="Vista inmersiva de los hermosos cenotes en Yucatán"
          fill
          priority={imagenUrl !== '/cenote-aventura-homun.png'}
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== FALLBACK_DATA.heroBanner.imagenUrl) {
              target.src = FALLBACK_DATA.heroBanner.imagenUrl;
            }
          }}
        />
      </div>

      {/* GRADIENTE SUPERPUESTO */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* CONTENEDOR CENTRAL */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center mt-12">
        
        {/* Subtitulillo Anunciador */}
        <span className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter text-sm md:text-base tracking-[0.25em] text-white/80 uppercase font-medium mb-6">
           MOCHOTOURS | Homún, Yucatán
        </span>

        {/* Título Monumental */}
        <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards font-fraunces text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight drop-shadow-2xl">
          {titulo}
        </h1>

        {/* Descripción Larga */}
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards font-inter text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mt-6 font-light leading-relaxed drop-shadow-lg text-balance">
          {descripcion}
        </p>

        {/* CALL TO ACTIONS */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-backwards flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-28 sm:mb-0 w-full lg:w-auto">
          
          <a href={`https://wa.me/${washappNumber.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
             <Button size="lg" className="h-14 py-4 px-8 rounded-full !bg-[#25D366] hover:!bg-[#1DA851] text-white text-base font-semibold shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all hover:scale-105 w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Reservar por WhatsApp
             </Button>
          </a>

          <Link href="#galeria" className="w-full sm:w-auto">
             <Button variant="outline" size="lg" className="h-14 py-4 px-8 rounded-full border border-white/80 text-white/90 bg-transparent hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all w-full sm:w-auto">
                <ImageIcon className="mr-2 h-5 w-5" />
                Ver la Galería
             </Button>
          </Link>
          
        </div>

      </div>

      {/* SCROLL INDICATOR ANIMADO */}
      <div className="absolute z-20 bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
         <span className="text-white/60 text-xs tracking-widest uppercase mb-2 animate-pulse">Explorar</span>
         <div className="animate-bounce">
            <ChevronDown className="text-white/80 h-6 w-6" />
         </div>
      </div>

    </section>
  );
}
