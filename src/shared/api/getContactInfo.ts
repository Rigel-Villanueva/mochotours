import staticContactInfo from '@/data/contact-info.json';

export interface ContactInfo {
  phonePrimary?: string;
  phoneSecondary?: string;
  email?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

/**
 * Función ISR (Incremental Static Regeneration)
 * Se ejecuta en el servidor (durante SSR o SSG via ISR).
 * 
 * Estrategia:
 * 1. Intenta traer de la BD (API backend). Usa ISR con revalidate = 300 segundos (5 min).
 * 2. Si el servidor está caído o hay error de red, cae al CATCH.
 * 3. En el CATCH devuelve el JSON estático (fallback de oro).
 */
export async function getContactInfoISR(): Promise<ContactInfo> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  try {
    const res = await fetch(`${backendUrl}/api/contact-info`, {
      next: { revalidate: 300 }, // ISR: regenera máximo cada 5 minutos
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const json = await res.json();
    
    // Si la BD responde success pero está vacía ({}), unimos los datos vacíos al fallback estático
    // para asegurar que siempre haya info (por ej. si borran algo por error)
    if (json.success && json.data) {
       // Merge con fallback para prevenir campos vacíos si apenas se creó la tabla
       return { ...staticContactInfo, ...json.data };
    }

    throw new Error('Formato de respuesta inválido');
  } catch (err) {
    console.warn('⚠️ Usando fallback local para contact_info debido a fallo en API:', err);
    return staticContactInfo;
  }
}
