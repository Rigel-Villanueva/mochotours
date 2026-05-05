'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getCachedSiteContent } from '@/shared/lib/resilientData';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import {
  Clock, Trees, Bike, MapPin, Users, Languages,
  Backpack, Baby, Settings, UtensilsCrossed
} from 'lucide-react';

// Mapeo de strings a componentes Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  clock: Clock,
  trees: Trees,
  bike: Bike,
  'map-pin': MapPin,
  users: Users,
  languages: Languages,
  backpack: Backpack,
  baby: Baby,
  settings: Settings,
  utensils: UtensilsCrossed,
};

export function ExperienceInfo() {
  const { data: FALLBACK_DATA } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mototaxiData, setMototaxiData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

  // Intersection Observer para animaciones al scroll
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

  // Fetch datos del backend (silencioso, con fallback local)
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getCachedSiteContent();
        if (res?.experience_mototaxi) {
          setMototaxiData(res.experience_mototaxi);
        }
      } catch {
        // Silently fail → fallback local se mantiene
      }
    };
    fetchExperience();
  }, []);

  // Parallax del mototaxi
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerOffset, setBannerOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        setBannerOffset(progress * 60 - 30);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { tarjetas, mototaxi } = FALLBACK_DATA.experiencia;
  const mototaxiImagen = mototaxiData?.imagenUrl || mototaxi.imagenUrl;
  const mototaxiTitulo = mototaxiData?.titulo || mototaxi.titulo;
  const mototaxiDescripcion = mototaxiData?.descripcion || mototaxi.descripcion;

  return (
    <section ref={sectionRef} className="relative bg-white pt-32 lg:pt-40 pb-20 lg:pb-32 -mt-8 rounded-t-[2.5rem] z-30 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ═══ ENCABEZADO ═══ */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-3">
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              La Experiencia
            </span>
          </div>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
            Qué incluye tu aventura
          </h2>
          <p className="text-stone-600 mt-4 max-w-2xl mx-auto text-base lg:text-lg font-light text-left sm:text-center">
            Un tour de cenotes con Mochotours incluye visita a 3 o 4 cenotes,
            transporte en moto-taxi tradicional y guía local certificado
            en primeros auxilios. Opción de probar la auténtica comida
            típica al finalizar el tour. Duración: 4 a 5 horas.
            Grupos de 2 a 50 personas.
          </p>
        </div>

        {/* ═══ GRID DE 9 TARJETAS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {tarjetas.map((card, index) => {
            const IconComponent = ICON_MAP[card.icon] || Settings;
            return (
              <div
                key={card.titulo}
                className={`group p-4 lg:p-6 bg-white rounded-2xl lg:rounded-3xl border border-stone-100 shadow-md hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 active:scale-95 cursor-default flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 lg:gap-4 ${
                  index === tarjetas.length - 1 && tarjetas.length % 2 !== 0
                    ? 'col-span-2 lg:col-span-1'
                    : ''
                } ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-transform">
                  <IconComponent className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-fraunces text-sm lg:text-lg font-bold text-stone-900 leading-tight">
                    {card.titulo}
                  </h3>
                  <p className="text-xs lg:text-sm text-stone-600 mt-1 lg:mt-1.5 leading-relaxed">
                    {card.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ LOS CENOTES MÁS VISITADOS ═══ */}
        <div className={`mt-16 lg:mt-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ transitionDelay: '500ms' }}>

          {/* Título SEO */}
          <h3 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight text-center mb-4">
            Los Cenotes Más Visitados de Homún, Yucatán
          </h3>

          {/* Texto descriptivo */}
          <p className="text-stone-600 text-base lg:text-lg font-light leading-relaxed max-w-3xl mx-auto text-center mb-10 lg:mb-14">
            Pedro conoce más de <strong className="text-stone-800 font-medium">150 cenotes</strong> en la zona,
            de los cuales <strong className="text-stone-800 font-medium">32 están abiertos al público</strong>.
            La ruta se adapta según tus preferencias: cenotes familiares de fácil acceso,
            cenotes extremos para los aventureros, o grutas subterráneas para los exploradores.
          </p>

          {/* Grid de 5 tarjetas de cenotes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              {
                name: 'Tzajuncat',
                emoji: '🔥',
                bg: 'bg-amber-50',
                border: 'border-amber-200/60',
                accent: 'text-amber-700',
                hoverBg: 'hover:bg-amber-100/80',
              },
              {
                name: 'Holcozón',
                emoji: '👨‍👩‍👧‍👦',
                bg: 'bg-sky-50',
                border: 'border-sky-200/60',
                accent: 'text-sky-700',
                hoverBg: 'hover:bg-sky-100/80',
              },
              {
                name: 'Baalmil',
                emoji: '🦇',
                bg: 'bg-violet-50',
                border: 'border-violet-200/60',
                accent: 'text-violet-700',
                hoverBg: 'hover:bg-violet-100/80',
              },
              {
                name: 'Yaxbacaltún',
                emoji: '🌿',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200/60',
                accent: 'text-emerald-700',
                hoverBg: 'hover:bg-emerald-100/80',
              },
              {
                name: 'Santa Rosa',
                emoji: '💧',
                bg: 'bg-cyan-50',
                border: 'border-cyan-200/60',
                accent: 'text-cyan-700',
                hoverBg: 'hover:bg-cyan-100/80',
              },
            ].map((cenote, i) => (
              <div
                key={cenote.name}
                className={`${cenote.bg} ${cenote.border} ${cenote.hoverBg} border rounded-2xl p-4 sm:p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default ${
                  i === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <span className="text-2xl sm:text-3xl block mb-2">{cenote.emoji}</span>
                <h4 className={`font-fraunces text-base sm:text-lg font-bold ${cenote.accent}`}>
                  {cenote.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ═══ BANNER MOTOTAXI DESTACADO ═══ */}
      <div
        ref={bannerRef}
        className="relative w-full h-[400px] md:h-[450px] mt-16 md:mt-24 overflow-hidden"
      >
        {/* Imagen con parallax */}
        <div
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ transform: `translateY(${bannerOffset}px)` }}
        >
          <Image
            src={mototaxiImagen}
            alt="Familia viajando en moto-taxi tradicional en Homún, Yucatán"
            fill
            unoptimized={true}
            sizes="100vw"
            className="object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== mototaxi.imagenUrl) {
                target.src = mototaxi.imagenUrl;
              }
            }}
          />
        </div>

        {/* Overlay gradiente desde abajo (móviles) y desde la izquierda (desktop) */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900/95 via-stone-900/70 md:via-stone-900/50 to-transparent z-10" />

        {/* Texto encima */}
        <div className="relative z-20 h-full flex flex-col justify-end md:justify-center px-6 pr-24 md:px-16 lg:px-24 pb-8 md:pb-0 max-w-2xl">
          <h3 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
            {mototaxiTitulo}
          </h3>
          <p className="text-white/95 mt-3 md:mt-4 text-sm md:text-lg leading-relaxed font-light drop-shadow-lg">
            {mototaxiDescripcion}
          </p>
        </div>
      </div>
    </section>
  );
}
