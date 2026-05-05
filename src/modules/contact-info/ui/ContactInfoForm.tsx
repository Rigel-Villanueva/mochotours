'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ContactInfo } from '../domain/entities/ContactInfo';
import { Phone, Mail, MapPin, ExternalLink, Map, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

interface ContactInfoFormProps {
  initialData?: ContactInfo | null;
  onSubmit: (data: ContactInfo) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function ContactInfoForm({ initialData, onSubmit, isLoading, isEditing, onCancel }: ContactInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>({
    phonePrimary: initialData?.phonePrimary || '',
    phoneSecondary: initialData?.phoneSecondary || '',
    email: initialData?.email || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
  });

  const initialStr = JSON.stringify({
    phonePrimary: initialData?.phonePrimary || '',
    phoneSecondary: initialData?.phoneSecondary || '',
    email: initialData?.email || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
  });
  const currentStr = JSON.stringify(formData);
  const isDirty = currentStr !== initialStr;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    if (initialData) {
      setFormData({
        phonePrimary: initialData.phonePrimary || '',
        phoneSecondary: initialData.phoneSecondary || '',
        email: initialData.email || '',
        googleMapsUrl: initialData.googleMapsUrl || '',
        instagramUrl: initialData.instagramUrl || '',
        facebookUrl: initialData.facebookUrl || '',
        tiktokUrl: initialData.tiktokUrl || '',
      });
    }
    onCancel();
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const extractHandle = (url: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      return parts.length > 0 ? `@${parts[parts.length - 1]}` : url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Contacto directo (Teal) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-medium text-stone-900">Contacto directo</h3>
            <p className="text-xs text-stone-500">Teléfonos y correo electrónico principal</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label htmlFor="phonePrimary" className="text-[13px] font-medium text-stone-700">Teléfono principal</label>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                <FaWhatsapp className="w-3 h-3" />
                WhatsApp
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-stone-400" />
              </div>
              <input 
                id="phonePrimary" name="phonePrimary" value={formData.phonePrimary} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "Ej: 9991200205" : "No establecido"} 
              />
            </div>
            {formData.phonePrimary && (
              <a href={`https://wa.me/52${formData.phonePrimary.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 mt-1 text-[12px] font-medium ${isEditing ? 'text-teal-600 hover:text-teal-700' : 'text-stone-400 hover:text-stone-600'}`}>
                Probar en WhatsApp <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phoneSecondary" className="text-[13px] font-medium text-stone-700 block">Teléfono secundario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-stone-400" />
              </div>
              <input 
                id="phoneSecondary" name="phoneSecondary" value={formData.phoneSecondary} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "Opcional" : "No establecido"} 
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="email" className="text-[13px] font-medium text-stone-700 block">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-stone-400" />
              </div>
              <input 
                id="email" name="email" type="email" value={formData.email} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "contacto@mochotours.com" : "No establecido"} 
              />
            </div>
            {formData.email && (
              <a href={`mailto:${formData.email}`} className={`inline-flex items-center gap-1 mt-1 text-[12px] font-medium ${isEditing ? 'text-teal-600 hover:text-teal-700' : 'text-stone-400 hover:text-stone-600'}`}>
                Enviar correo de prueba <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Ubicación (Ámbar) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-medium text-stone-900">Ubicación y reseñas</h3>
            <p className="text-xs text-stone-500">Enlace a tu ficha de Google Maps</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-1.5">
            <label htmlFor="googleMapsUrl" className="text-[13px] font-medium text-stone-700 block">URL de Google Maps</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map className="h-4 w-4 text-stone-400" />
              </div>
              <input 
                id="googleMapsUrl" name="googleMapsUrl" type="url" value={formData.googleMapsUrl} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "https://maps.app.goo.gl/..." : "No establecido"} 
              />
            </div>
            
            {formData.googleMapsUrl && (
              <div className="mt-4 p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-stone-200 shrink-0 flex items-center justify-center overflow-hidden relative">
                  <Image src="https://maps.gstatic.com/tactile/pane/default_geocode-2x.png" alt="Map Preview" fill className="object-cover opacity-70" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">MochoTours Cenotes</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium text-stone-700">5.0</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                    </div>
                    <span className="text-[11px] text-stone-500">(Ver en Maps)</span>
                  </div>
                </div>
                <a href={formData.googleMapsUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-200 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Redes Sociales (Rosa) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
            <FaInstagram className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-medium text-stone-900">Redes sociales</h3>
            <p className="text-xs text-stone-500">Enlaces a perfiles oficiales</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="facebookUrl" className="text-[13px] font-medium text-stone-700 block">Facebook</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFacebook className="h-4 w-4 text-blue-600" />
              </div>
              <input 
                id="facebookUrl" name="facebookUrl" type="url" value={formData.facebookUrl} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "https://facebook.com/mochotours" : "No establecido"} 
              />
            </div>
            {formData.facebookUrl && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${isEditing ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-stone-50 text-stone-500 border-stone-200/60'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Conectado como {extractHandle(formData.facebookUrl)}
                </span>
                <a href={formData.facebookUrl} target="_blank" rel="noreferrer" className={`text-[11px] font-medium inline-flex items-center gap-1 ${isEditing ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                  Abrir perfil <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="instagramUrl" className="text-[13px] font-medium text-stone-700 block">Instagram</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaInstagram className="h-4 w-4 text-pink-600" />
              </div>
              <input 
                id="instagramUrl" name="instagramUrl" type="url" value={formData.instagramUrl} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "https://instagram.com/mochotours" : "No establecido"} 
              />
            </div>
            {formData.instagramUrl && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${isEditing ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-stone-50 text-stone-500 border-stone-200/60'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Conectado como {extractHandle(formData.instagramUrl)}
                </span>
                <a href={formData.instagramUrl} target="_blank" rel="noreferrer" className={`text-[11px] font-medium inline-flex items-center gap-1 ${isEditing ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                  Abrir perfil <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tiktokUrl" className="text-[13px] font-medium text-stone-700 block">TikTok</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTiktok className="h-4 w-4 text-black" />
              </div>
              <input 
                id="tiktokUrl" name="tiktokUrl" type="url" value={formData.tiktokUrl} onChange={handleChange} 
                disabled={!isEditing}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all ${isEditing ? 'bg-white border border-stone-200 text-stone-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500' : 'bg-transparent border-transparent text-stone-700 font-medium'}`} 
                placeholder={isEditing ? "https://tiktok.com/@mochotours" : "No establecido"} 
              />
            </div>
            {formData.tiktokUrl && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${isEditing ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-stone-50 text-stone-500 border-stone-200/60'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Conectado como {extractHandle(formData.tiktokUrl)}
                </span>
                <a href={formData.tiktokUrl} target="_blank" rel="noreferrer" className={`text-[11px] font-medium inline-flex items-center gap-1 ${isEditing ? 'text-stone-500 hover:text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}>
                  Abrir perfil <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {isEditing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 w-full max-w-2xl px-4 lg:ml-32">
          <div className="bg-teal-800 text-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-900">
            <div className="flex items-center gap-3">
              {isDirty ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <p className="text-sm font-medium">Tienes cambios sin guardar</p>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium">Modo edición</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={handleDiscard}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading || !isDirty}
                className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium bg-white text-teal-900 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin text-teal-600" /> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 text-teal-600" /> Guardar cambios</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
