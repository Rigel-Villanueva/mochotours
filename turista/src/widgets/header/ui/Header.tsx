'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MessageCircle } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { Button } from '@/shared/ui/button';
import { useTranslation } from '@/shared/lib/TranslationProvider';
import { LanguageToggle } from '@/shared/ui/language-toggle';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const pathname = usePathname();
  const { links: PUBLIC_LINKS, data: FALLBACK_DATA } = useTranslation();

  // Si estamos en una sub-página (no homepage), forzar estilo scrolled
  const isSubPage = pathname !== '/';

  // Escucha del Scroll inteligente para mutar transparencias y detectar sección activa
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    
    handleScroll(); 
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer para rastrear la sección visible actualmente (solo en homepage)
  useEffect(() => {
    if (isSubPage) return; // No rastrear secciones en sub-páginas

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    const sections = document.querySelectorAll('div[id="inicio"], section[id], div[id="contacto"]');
    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, [isSubPage]);

  // Bloqueo de scroll cuando Sidebar tactil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  /** Cierra el Menú móvil automáticamente si hacen clic en un enlace SEO ancla */
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /** Maneja el clic en los enlaces para hacer un scroll suave manual y preciso */
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isSubPage || !href.startsWith('#')) return; // Deja que Next.js maneje la navegación a otras páginas
    
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Calculamos la posición considerando el header fijo
      const headerOffset = window.innerWidth >= 768 ? 80 : 64; // h-20 md o h-16 mobile
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Actualizamos la URL (opcional pero bueno para SEO)
      window.history.pushState(null, '', href);
      setActiveSection(targetId);
      closeMobileMenu();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full transition-all duration-300 ${
          isMobileMenuOpen ? 'z-30' : 'z-50'
        } ${
          (isScrolled || isSubPage)
            ? 'bg-white backdrop-blur-md text-stone-900 shadow-md h-16 md:h-20' 
            : 'bg-transparent text-white h-20 md:h-[110px]'
        }`}
      >
        <div className="h-full px-6 lg:px-12 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* 1. Logotipo Corporativo */}
          <Link href="/" className="flex items-center gap-3 relative z-50 transition-transform duration-300 hover:scale-105">
             <div className={`relative flex items-center transition-all ${(isScrolled || isSubPage) ? 'h-14' : 'h-20 md:h-24'}`}>
              <Image 
                src="/logo.png"
                alt="MochoTours Logo de Cenotes"
                width={256}
                height={128}
                className="w-auto h-full object-contain object-left"
                style={{ width: 'auto', height: '100%' }}
                priority
              />
            </div>
          </Link>

          {/* 2. Navegación Principal en Laptops/Escritorio */}
          <nav className="hidden md:flex items-center gap-8">
            {PUBLIC_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const linkHref = isSubPage ? `/${link.href}` : link.href;
              const isActive = isSubPage
                ? (pathname === '/' + sectionId || pathname.startsWith('/' + sectionId))
                : activeSection === sectionId;

              return (
                <Link 
                  key={link.href} 
                  href={linkHref}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`pb-1 font-medium tracking-wide text-[15px] relative group overflow-hidden transition-colors ${
                    isActive 
                      ? ((isScrolled || isSubPage) ? 'text-primary font-bold' : 'text-white font-bold')
                      : ((isScrolled || isSubPage) ? 'text-stone-700 hover:text-primary' : 'text-white/80 hover:text-white')
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-[2.5px] transform transition-transform duration-300 ease-out ${
                    isActive 
                      ? ((isScrolled || isSubPage) ? 'bg-primary translate-x-0' : 'bg-[#99F6E4] translate-x-0')
                      : ((isScrolled || isSubPage) ? 'bg-primary -translate-x-full group-hover:translate-x-0' : 'bg-white -translate-x-full group-hover:translate-x-0')
                  }`} />
                </Link>
              );
            })}
            <LanguageToggle />
          </nav>

          {/* 3. Botón Táctil (Hamburguesa Móvil) */}
          <button 
            className="md:hidden p-2 -mr-2 relative z-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
             {isMobileMenuOpen ? (
               <X className="text-stone-900 h-8 w-8" />
             ) : (
               <Menu className={`${(isScrolled || isSubPage) ? 'text-stone-900' : 'text-white'} h-8 w-8 transition-colors`} />
             )}
          </button>
        </div>
      </header>

      {/* 4. Cortina Semi Oscura y Drawer (Menú Lateral Móvil) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />
      
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-[340px] bg-white text-stone-900 z-50 flex flex-col px-5 py-5 overflow-x-hidden overflow-y-hidden transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
         {/* HEADER DRAWER */}
         <div className="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
           <div className="relative h-12 flex gap-4 items-center">
             <Image src="/logo.png" alt="MochoTours Logo" width={128} height={64} className="w-auto h-full object-contain object-left" style={{ width: 'auto', height: '100%' }} priority />
             <LanguageToggle />
           </div>
           <button onClick={closeMobileMenu} className="p-2 -mr-2 text-stone-700 hover:text-stone-900 transition-colors" aria-label="Cerrar menú">
             <X className="h-7 w-7" />
           </button>
         </div>

         {/* ENLACES MÓVIL */}
         <div className="flex-1 flex flex-col justify-center space-y-1">
            {PUBLIC_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const linkHref = isSubPage ? `/${link.href}` : link.href;
              const isActive = isSubPage
                ? (pathname === '/' + sectionId || pathname.startsWith('/' + sectionId))
                : activeSection === sectionId;
              return (
                <Link 
                  key={link.href} 
                  href={linkHref}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`flex items-center text-lg font-bold tracking-tight transition-all border-l-4 py-2 px-4 rounded-r-lg active:bg-stone-100 active:scale-[0.98] ${
                    isActive ? 'text-primary border-primary bg-primary/5' : 'text-stone-600 border-transparent hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
         </div>

         {/* MINI INFO */}
         <div className="shrink-0 mx-1 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10 mb-3">
           <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-1">Homún, Yucatán</p>
           <p className="text-sm text-stone-600 leading-relaxed">10 años de experiencia · Tours por los cenotes más impresionantes.</p>
         </div>

         {/* FOOTER DRAWER */}
         <div className="shrink-0 pt-3 border-t border-stone-200 flex flex-col gap-3">
             <Link href={`https://wa.me/${FALLBACK_DATA.contacto.telefono_whatsapp_principal.replace(/\D/g, '')}`} target="_blank" className="w-full" onClick={closeMobileMenu}>
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl shadow-md font-semibold text-base transition-all active:scale-[0.97]">
                   <MessageCircle className="mr-2 h-5 w-5" /> Reservar por WhatsApp
                </Button>
             </Link>

             <div className="flex justify-center gap-5 pb-4">
               <Link href="https://www.facebook.com/share/18C6QNCUUg/" target="_blank" className="p-2.5 rounded-full bg-stone-100 hover:bg-[#1877F2]/15 transition-colors active:scale-95">
                 <FaFacebook className="h-5 w-5 text-[#1877F2]" />
               </Link>
               <Link href="https://www.instagram.com/mochotours?igsh=cXByOTNmOWprcXlv" target="_blank" className="p-2.5 rounded-full bg-stone-100 hover:bg-[#E4405F]/15 transition-colors active:scale-95">
                 <FaInstagram className="h-5 w-5 text-[#E4405F]" />
               </Link>
               <Link href="https://www.tiktok.com/@homun.yuc.mochoto?_r=1&_t=ZS-95i6sSsnp1l" target="_blank" className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors active:scale-95">
                 <FaTiktok className="h-5 w-5 text-stone-900" />
               </Link>
             </div>
         </div>
      </div>
    </>
  );
}
