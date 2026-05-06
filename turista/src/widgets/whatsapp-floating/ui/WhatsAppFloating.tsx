'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import type { ContactInfo } from '@/shared/api/getContactInfo';

interface WhatsAppFloatingProps {
  contactInfo?: ContactInfo;
}

export function WhatsAppFloating({ contactInfo }: WhatsAppFloatingProps) {
  const [show, setShow] = useState(false);
  const phone = contactInfo?.phonePrimary || FALLBACK_DATA.contacto.telefono_whatsapp_principal;
  
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('52')) {
    cleanPhone = '52' + cleanPhone;
  }

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=Hola%2C%20me%20interesa%20reservar%20un%20tour%20de%20cenotes`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contáctanos por WhatsApp"
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-16 h-16 rounded-full bg-[#25D366] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <MessageCircle className="h-8 w-8 text-white" />

      {/* Pulso de atención */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
    </a>
  );
}
