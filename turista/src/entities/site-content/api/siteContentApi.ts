import { apiClient } from '@/shared/api/apiClient';
import { SITE_CONTENT, SITE_CONTENT_BY_SECTION } from '@/shared/config/api-endpoints';
import { ApiResponse } from '@/shared/api/types';
import { SiteContent, SiteSection } from '../model/types';

/**
 * 1. Obtiene TODOS los contenidos registrados de la Base de Datos.
 * (Acceso público).
 */
export async function getSiteContent(): Promise<SiteContent> {
  const response = await apiClient.get<ApiResponse<SiteContent>>(SITE_CONTENT);
  return response.data;
}

/**
 * 2. Actualiza o inserta texto e imagen en una sección.
 * Se envía como FormData (multipart/form-data) porque contiene la foto binaria.
 */
export async function updateSection(formData: FormData): Promise<SiteSection> {
  const response = await apiClient.postFormData<ApiResponse<SiteSection>>(SITE_CONTENT, formData);
  return response.data; // El controlador backend devuelve la capa actualizada en la firma data.
}

/**
 * 3. Restaura/elimina una sección.
 */
export async function deleteSection(seccion: string): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(SITE_CONTENT_BY_SECTION(seccion));
}
