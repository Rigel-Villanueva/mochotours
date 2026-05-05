'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCachedSiteContent } from '@/shared/lib/resilientData';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import { MapPin, Clock, Phone, Navigation, Star, MessageCircle, Car, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';

import type { ContactInfo } from '@/shared/api/getContactInfo';

interface LocationMapProps {
  contactInfo?: ContactInfo;
}

export function LocationMap({ contactInfo }: LocationMapProps) {
  const { data: FALLBACK_DATA } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [locationData, setLocationData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

  // Intersection Observer para animaciones staggered
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
    const fetchLocation = async () => {
      try {
        const res = await getCachedSiteContent();
        if (res?.location) {
          setLocationData(res.location);
        }
      } catch {
        // Silently fail → fallback local se mantiene
      }
    };
    fetchLocation();
  }, []);

  const loc = FALLBACK_DATA.ubicacion;
  const imagenUrl = locationData?.imagenUrl || loc.imagenUrl;
  const titulo = loc.titulo;
  const descripcion = 'Mochotours se encuentra en Calle 20 entre 5 y 5a, a 50 metros de la gasolinera Pemex en Homún, Yucatán. A solo 1 hora de Mérida por carretera. Abierto todos los días del año de 9am a 6pm. Estacionamiento gratuito. Reserva con 1 día de anticipación por WhatsApp.';
  
  // Utilizar ContactInfo (dinámico) o fallback si algo falla severamente
  const phone1 = contactInfo?.phonePrimary || FALLBACK_DATA.contacto.telefono_whatsapp_principal;
  const phone2 = contactInfo?.phoneSecondary || FALLBACK_DATA.contacto.telefono_whatsapp_secundario;
  const cleanPhone1 = phone1.replace(/\D/g, '');
  const cleanPhone2 = phone2.replace(/\D/g, '');
  const googleMapsUrl = contactInfo?.googleMapsUrl || loc.google_maps_url;



  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Ubicación y Contacto - Mochotours",
    "description": "Información de contacto, ubicación y reservas de Mochotours en Homún, Yucatán.",
    "url": "https://cenotesmochotours.com/#contacto",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Cenotes Aventura y Más Homún",
      "telephone": `+${phone1}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": loc.direccion,
        "addressLocality": "Homún",
        "addressRegion": "Yucatán",
        "addressCountry": "MX"
      }
    }
  };

  return (
    <section ref={sectionRef} className="bg-white py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ═══ ENCABEZADO CON SOCIAL PROOF ═══ */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            Ubicación y Contacto
          </span>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-stone-900 mt-3">
            {titulo}
          </h2>

          {/* Subtítulo SEO descriptivo */}
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-base lg:text-lg font-light leading-relaxed">
            {descripcion}
          </p>

          {/* Social Proof — Rating de Google Prominente */}
          <Link
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver reseñas en Google Maps"
            className={`inline-flex items-center gap-3 mt-6 px-5 py-2.5 bg-white rounded-full border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-500 ease-out delay-100 group cursor-pointer ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Pequeño logo simulado de Google */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-stone-800 mr-0.5">4.6</span>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/50 text-amber-400/50'}`}
                />
              ))}
            </div>
            
            <span className="text-xs text-stone-500 font-medium group-hover:text-stone-800 transition-colors">
              (11 reseñas)
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ═══ COLUMNA IZQUIERDA: MAPA ═══ */}
          <div
            className={`flex flex-col gap-6 transition-all duration-700 ease-out delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)] border border-stone-200 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] transition-shadow duration-300 relative group/map bg-stone-100">
              <iframe
                src={loc.google_maps_embed}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Cenotes Aventura y Más en Homún, Yucatán"
                className="w-full aspect-square sm:aspect-video lg:h-[480px] max-h-[50vh]"
              />
              <div className="absolute inset-0 bg-stone-900/5 group-hover/map:bg-transparent transition-colors pointer-events-none hidden lg:block" />
            </div>

            {/* Foto decorativa extra debajo del mapa (Oculta en móvil) */}
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)] border border-stone-200 relative w-full aspect-[16/9] xl:aspect-[4/3] group cursor-pointer">
              <Image
                src="/tour-cenotes-homun-yucatan-aventura.jpeg"
                alt="Turistas disfrutando de un tour guiado en los cenotes de Homún, Yucatán con Mochotours"
                fill
                unoptimized={true}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                <span className="text-white/90 text-[10px] tracking-widest uppercase font-bold mb-1 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">Tours en Yucatán</span>
                <p className="text-white font-medium text-lg drop-shadow-md translate-y-0 transition-transform duration-500">¡Tu aventura en los cenotes de Homún te espera!</p>
              </div>
            </div>
          </div>

          {/* ═══ COLUMNA DERECHA: FOTO + INFO ═══ */}
          <div className="flex flex-col gap-6">

            {/* Foto con lightbox, hover zoom y caption responsive */}
            <div
              className={`group relative aspect-video overflow-hidden shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.3)] transition-all duration-400 cursor-zoom-in -mx-6 sm:mx-0 sm:rounded-2xl rounded-none delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Image
                src={imagenUrl}
                alt="Vista aérea del cenote en Homún, Yucatán — punto de encuentro para tours con Mochotours"
                fill
                unoptimized={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.015]"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== loc.imagenUrl) {
                    target.src = loc.imagenUrl;
                  }
                }}
              />
              {/* Caption editorial (Hardcoded) — Responsive visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 lg:p-6 pointer-events-none">
                <span className="text-white/80 text-[11px] tracking-[0.1em] uppercase font-semibold">
                  Bienvenido
                </span>
                <span className="text-white text-base font-medium mt-1">
                  Tu próxima aventura en Yucatán
                </span>
              </div>
            </div>

            {/* Grid 2x2 de información en desktop, stack en mobile */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Dirección */}
              <Link
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 hover:shadow-sm transition-all duration-200 group/card"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover/card:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Dirección</h3>
                  <p className="text-stone-600 text-xs mt-0.5 leading-relaxed">{loc.direccion}</p>
                </div>
              </Link>

              {/* Horarios */}
              <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Horarios</h3>
                  <p className="text-stone-600 text-xs mt-0.5">Todos los días de 9:00 am a 6:00 pm</p>
                </div>
              </div>

              {/* Reservación Principal */}
              <a
                href={`https://wa.me/${cleanPhone1}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tours%20de%20cenotes`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reservar por WhatsApp al número principal"
                className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group/card"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover/card:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                    Reservaciones
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Principal</span>
                  </h3>
                  <span className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1">
                    +52 999 120 02 05
                    <svg className="h-3 w-3 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.644-1.467A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.17 0-4.18-.592-5.924-1.617l-.425-.253-2.756.87.883-2.685-.278-.442A9.776 9.776 0 012.182 12 9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z"/></svg>
                  </span>
                </div>
              </a>

              {/* Contacto Secundario */}
              <a
                href={`https://wa.me/${cleanPhone2}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tours%20de%20cenotes`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar al número alterno"
                className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 hover:shadow-sm transition-all duration-200 group/card"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-200/60 flex items-center justify-center group-hover/card:bg-stone-300/60 transition-colors">
                  <Phone className="h-4 w-4 text-stone-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                    Otro número
                    <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-bold tracking-wide">Secundario</span>
                  </h3>
                  <span className="text-stone-600 text-xs hover:text-primary mt-1 inline-flex items-center gap-1">
                    +52 999 416 64 37
                    <svg className="h-3 w-3 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.644-1.467A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.17 0-4.18-.592-5.924-1.617l-.425-.253-2.756.87.883-2.685-.278-.442A9.776 9.776 0 012.182 12 9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z"/></svg>
                  </span>
                </div>
              </a>

              {/* Estacionamiento */}
              <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-200/60 flex items-center justify-center">
                  <Car className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Estacionamiento</h3>
                  <p className="text-stone-600 text-xs mt-0.5">Totalmente gratuito</p>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-200/60 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Métodos de pago</h3>
                  <p className="text-stone-600 text-xs mt-0.5">Efectivo y transferencia</p>
                </div>
              </div>

              {/* Operador y Seguridad */}
              <div className="sm:col-span-2 flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-stone-200/60 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Seguridad y Confianza</h3>
                  <p className="text-stone-600 text-xs mt-0.5">Operador con +10 años de experiencia. Seguridad incluida.</p>
                </div>
              </div>
            </div>

            {/* ═══ DOS CTAs LADO A LADO ═══ */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ease-out delay-[400ms] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* CTA Secundario — Cómo llegar */}
              <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir mapa para ver cómo llegar" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 h-13 text-sm font-semibold transition-all duration-300 group"
                >
                  <Navigation className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Cómo llegar
                </Button>
              </Link>

              {/* CTA Principal — Reservar WhatsApp */}
              <a
                href={`https://wa.me/${cleanPhone1}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tours%20de%20cenotes`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reservar tour por WhatsApp"
                className="flex-1"
              >
                <Button
                  size="lg"
                  className="w-full rounded-xl !bg-[#25D366] hover:!bg-[#1DA851] text-white h-13 text-sm font-semibold shadow-[0_0_12px_rgba(37,211,102,0.3)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Reservar por WhatsApp
                </Button>
              </a>
            </div>

          </div>
        </div>
      </div>


    </section>
  );
}
