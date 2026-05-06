'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCachedSiteContent, getImageWithFallback } from '@/shared/lib/resilientData';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { ContactInfo } from '@/shared/api/getContactInfo';

interface ContactFooterProps {
  contactInfo?: ContactInfo;
}

export function ContactFooter({ contactInfo }: ContactFooterProps) {
  const { data: FALLBACK_DATA } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [footerData, setFooterData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

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



  // Fetch datos del backend (silencioso)
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await getCachedSiteContent();
        if (res?.footer) setFooterData(res.footer);
      } catch {
        // Silently fail → fallback local
      }
    };
    fetchFooter();
  }, []);

  // Datos de contenido (H2, Banner) de contenido_web
  const fallback = FALLBACK_DATA.footer;
  const titulo = fallback.titulo;
  const descripcion = fallback.descripcion;
  const imagenUrl = getImageWithFallback(footerData?.imagenUrl, fallback.imagenUrl);

  // Datos dinámicos de contacto provenientes de ISR (contact_info)
  const phone1 = contactInfo?.phonePrimary || FALLBACK_DATA.contacto.telefono_whatsapp_principal;
  const phone2 = contactInfo?.phoneSecondary || FALLBACK_DATA.contacto.telefono_whatsapp_secundario;
  let cleanPhone1 = phone1.replace(/\D/g, '');
  let cleanPhone2 = phone2.replace(/\D/g, '');
  if (cleanPhone1.length === 10 && !cleanPhone1.startsWith('52')) cleanPhone1 = '52' + cleanPhone1;
  if (cleanPhone2.length === 10 && !cleanPhone2.startsWith('52')) cleanPhone2 = '52' + cleanPhone2;
  const emailVal = contactInfo?.email || 'mochotours.homun@gmail.com';

  // SVG icons para redes (no existen en lucide-react)
  const FacebookIcon = ({ className = "h-6 w-6 text-white" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  );
  const InstagramIcon = ({ className = "h-6 w-6 text-white" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
  );
  const TikTokIcon = ({ className = "h-6 w-6 text-white" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.81.1v-3.5a6.37 6.37 0 00-.81-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.7 4.6 6.28 6.28 0 001.98-4.6V8.73A8.26 8.26 0 0019.59 10V6.69z"/></svg>
  );

  const redes = [
    { Icon: FacebookIcon, href: contactInfo?.facebookUrl || 'https://www.facebook.com/share/18C6QNCUUg/', label: 'Facebook' },
    { Icon: InstagramIcon, href: contactInfo?.instagramUrl || 'https://www.instagram.com/mochotours?igsh=cXByOTNmOWprcXlv', label: 'Instagram' },
    { Icon: TikTokIcon, href: contactInfo?.tiktokUrl || 'https://www.tiktok.com/@homun.yuc.mochoto?_r=1&_t=ZS-95i6sSsnp1l', label: 'TikTok' },
  ];

  const waMessage = 'Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tours%20de%20cenotes';

  return (
    <footer ref={sectionRef} className="relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Imagen de fondo — cubre todo el footer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imagenUrl})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido principal */}
      <div
        className="relative z-20 w-full text-center px-6 pt-24 pb-16 max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
      >        
        {/* Label */}
        <span
          className={`text-white/80 text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Contacto
        </span>

        {/* Título (mejorado para mobile) */}
        <h2
          className={`font-fraunces text-[40px] leading-[1.1] md:text-5xl lg:text-6xl font-bold text-white mt-4 text-balance transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {titulo}
        </h2>

        {/* Subtítulo */}
        <p
          className={`text-white/90 text-lg md:text-xl mt-4 font-medium transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {descripcion}
        </p>

        {/* Botón WhatsApp principal y micro-copy */}
        <div
          className={`mt-10 flex flex-col items-center transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a href={`https://wa.me/${cleanPhone1}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" aria-label="Reservar tour por WhatsApp">
            <Button
              size="lg"
              className="w-full h-14 rounded-xl !bg-[#25D366] hover:!bg-[#1DA851] text-white shadow-[0_4px_14px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all hover:-translate-y-0.5 text-base font-semibold"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Reservar por WhatsApp
            </Button>
          </a>
          <p className="text-white/80 text-sm mt-3 font-medium flex items-center gap-1.5">
            <span>⚡</span> Respondemos en menos de 10 minutos
          </p>
        </div>

        {/* Botones secundarios */}
        <div
          className={`flex flex-col items-center w-full mt-10 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            ¿PREFIERES OTRO MEDIO?
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-[600px]">
            <Link href={`tel:+${phone1}`} aria-label="Llamar al número principal" className="w-full">
              <Button variant="outline" className="w-full h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-stone-900 transition-all active:scale-95">
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </Button>
            </Link>
            <a href={`https://wa.me/${cleanPhone2}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar al número alterno" className="w-full">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-stone-800 bg-stone-900/50 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Número alterno
              </Button>
            </a>
            <Link href={`mailto:${emailVal}`} aria-label="Enviar correo electrónico" className="w-full col-span-2 md:col-span-1">
              <Button variant="outline" className="w-full h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-stone-900 transition-all active:scale-95">
                <Mail className="mr-2 h-4 w-4" />
                Correo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER MEJORADO ═══ */}
      <div className="relative z-20 w-full border-t border-white/20 bg-stone-900/60 backdrop-blur-md pt-12 pb-6 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-10 text-left">
          
          {/* Col 1: Marca y descripción */}
          <div className="flex flex-col items-center text-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo Mochotours"
              width={150}
              height={150}
              className="rounded-full w-auto h-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="text-white font-bold text-3xl tracking-wide mt-2">Mochotours</span>
            <p className="text-white/70 text-sm leading-relaxed max-w-[280px]">
              Tours guiados por los cenotes más impresionantes de Homún, Yucatán. Experiencia auténtica con guías locales.
            </p>
          </div>

          {/* Col 2: Secciones */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Explora</h4>
            <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm w-fit">Inicio</Link>
            <Link href="/#sobre-mi" className="text-white/60 hover:text-white transition-colors text-sm w-fit">Sobre Mí</Link>
            <Link href="/#experiencia" className="text-white/60 hover:text-white transition-colors text-sm w-fit">Experiencia</Link>
            <Link href="/galeria" className="text-white/60 hover:text-white transition-colors text-sm w-fit">Galería</Link>
          </div>

          {/* Col 3: NAP (Name, Address, Phone) */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Contacto</h4>
            <a href={`https://wa.me/${cleanPhone1}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 w-fit">
              <Phone className="h-4 w-4" /> +52 {phone1.replace('52', '')}
            </a>
            <a href={`https://wa.me/${cleanPhone2}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 w-fit">
              <Phone className="h-4 w-4" /> +52 {phone2.replace('52', '')}
            </a>
            <a href={`mailto:${emailVal}`} className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 w-fit">
              <Mail className="h-4 w-4" /> {emailVal}
            </a>
            <span className="text-white/60 text-sm flex items-start gap-2 mt-1">
              <span className="mt-0.5">📍</span>
              Calle 20 entre 5 y 5a, a 50 metros de la gasolinera Pemex, Homún, Yucatán, MX
            </span>
          </div>

          {/* Col 4: Horario y Redes */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Horario y Redes</h4>
            <span className="text-white/60 text-sm">
              🕐 Todos los días, 9am – 6pm
            </span>
            
            <div className="mt-4">
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider block mb-3">Síguenos en:</span>
              <div className="flex items-center gap-2.5">
                {redes.map((red) => {
                  const IconComp = red.Icon;
                  return (
                    <Link
                      key={red.label}
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visitar ${red.label}`}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all hover:-translate-y-1"
                    >
                      <IconComp className="h-5 w-5 text-white" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar: Copyright y Créditos */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Cenotes Aventura y Más · Homún, Yucatán. Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs">
            Sitio creado por{' '}
            <a 
              href="https://dual-code-solutions.serviciodualcodesolutions-devs.workers.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 font-medium hover:text-white transition-colors underline-offset-4 hover:underline"
              aria-label="Visitar sitio de Dual Code Solutions — Desarrollador del sitio"
            >
              Dual Code Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
