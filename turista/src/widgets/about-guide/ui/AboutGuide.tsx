'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCachedSiteContent } from '@/shared/lib/resilientData';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import { Languages, Award, MapPin, ArrowRight, Users, Trees, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const ICON_MAP: Record<string, React.ElementType> = {
  languages: Languages,
  award: Award,
  'map-pin': MapPin,
  users: Users,
  trees: Trees,
  shield: ShieldCheck,
};

export function AboutGuide() {
  const { data: FALLBACK_DATA } = useTranslation();
  const [aboutData, setAboutData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

  // Intersection Observer para animaciones al entrar en viewport
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch datos del backend (silencioso)
    const fetchAbout = async () => {
      try {
        const res = await getCachedSiteContent();
        if (res?.about_us) {
          setAboutData(res.about_us);
        }
      } catch {
        // Silently fail → fallback local se mantiene
      }
    };
    fetchAbout();
  }, []);

  // Observer para activar animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Datos híbridos: servidor > fallback local
  const guide = FALLBACK_DATA.aboutGuide;
  const nombre = guide.nombre_completo;
  const historia = aboutData?.descripcion || guide.historia;
  const imagenUrl = aboutData?.imagenUrl || guide.imagenUrl;

  return (
    <div className="bg-stone-950">
      <section
        ref={sectionRef}
        className="relative bg-stone-50 pb-8 pt-20 lg:pb-16 lg:pt-32 overflow-hidden rounded-t-[2.5rem] z-20"
      >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          
          {/* ═══ TÍTULO MÓVIL (Arriba de la foto) ═══ */}
          <div 
            className={`w-full lg:hidden flex flex-col gap-3 order-1 transition-all duration-1000 ease-out text-left ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              Conoce a tu guía
            </span>
            <h2 className="font-fraunces text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
              Hola, soy <span className="text-primary">{guide.nombre_corto}</span>
            </h2>
          </div>

          {/* ═══ COLUMNA IZQUIERDA: FOTOGRAFÍA (Abajo en Móvil, Izquierda en Desktop) ═══ */}
          <div
            className={`w-full px-4 sm:px-0 lg:w-[45%] relative transition-all duration-1000 ease-out order-2 lg:order-1 lg:pl-4 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Contenedor Externo (Gestor de Sombra y Decoración Radial) */}
            <div className="relative aspect-[4/5] rounded-[2rem] bg-stone-200 shadow-xl lg:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-2xl transition-shadow duration-300 group ring-4 ring-primary/10">
              
              {/* Contenedor Interno (Gestor de Clip Máscara Fotográfica) */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden [transform:translateZ(0)] isolate ring-1 ring-stone-900/5">
                <Image
                src={imagenUrl}
                alt={`${nombre} — Guía local de cenotes en Homún, Yucatán`}
                fill
                unoptimized={true}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 rounded-[2rem]"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== guide.imagenUrl) {
                    target.src = guide.imagenUrl;
                  }
                }}
              />
                {/* Gradientes oscurecedores refinados en bordes para destacar foto de WhatsApp */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-b-[2rem]" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent opacity-60 rounded-t-[2rem]" />
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ═══ COLUMNA DERECHA: HISTORIA Y CHIPS (Abajo en Móvil, Derecha en Desktop) ═══ */}
          <div
            className={`w-full lg:w-[55%] flex flex-col gap-6 lg:gap-8 transition-all duration-1000 ease-out delay-150 order-3 lg:order-2 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Título Desktop (Oculto en móvil) */}
            <div className="hidden lg:flex flex-col gap-2">
              <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
                Conoce a tu guía
              </span>
              <h2 className="font-fraunces text-5xl font-bold text-stone-900 leading-tight">
                Hola, soy <span className="text-primary">{guide.nombre_corto}</span>
              </h2>
            </div>

            {/* Párrafo principal */}
            <p className="text-stone-600 w-full text-base sm:text-lg leading-relaxed font-light text-left self-start">
              {historia}
            </p>

            {/* Chips de información */}
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-2 py-1 sm:mt-0">
              {guide.chips.map((chip, index) => {
                const IconComponent = ICON_MAP[chip.icon] || Award;
                return (
                  <div
                    key={chip.label}
                    className={`flex items-center justify-center gap-1.5 bg-primary/10 rounded-xl px-2 py-2.5 sm:px-3.5 sm:py-2.5 transition-colors duration-300 hover:bg-primary/20 ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    <span className="text-[11px] sm:text-sm font-semibold text-stone-800 leading-tight">
                      {chip.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Botón hacia experiencia */}
            <div className="mt-2 flex justify-center sm:justify-start">
              <Link href="#experiencia" className="w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-auto rounded-full border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 group px-8 h-14"
                >
                  Conoce la experiencia
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
);
}
