import { apiClient } from '@/shared/api/apiClient';
import { GALLERY, GALLERY_BY_ID } from '@/shared/config/api-endpoints';
import { ApiResponse } from '@/shared/api/types';
import { Media, PaginatedGalleryResponse } from '../model/types';

/**
 * 1. Obtiene las fotos y videos de forma paginada.
 */
export async function getGallery({ page = 1, limit = 20 }): Promise<PaginatedGalleryResponse> {
  const url = `${GALLERY}?page=${page}&limit=${limit}`;
  const response = await apiClient.get<ApiResponse<PaginatedGalleryResponse>>(url);
  // El backend retorna: { success: true, data: [...], meta: {...} }
  // Ojo: apiClient siempre retorna el objeto completo de respuesta debido a su tipado base, 
  // pero ya viene encapsulado si mapeamos propiamente.
  
  // Realmente el backend manda { success, data, meta } a nivel raíz. Nuestro apiClient mapeará la 'T' al Response.
  // Así que vamos a forzar type casting confiable.
  const res = response as unknown as PaginatedGalleryResponse;
  return res; 
}

/**
 * 2. Sube un media audiovisual (con hasta 100mb de limitante backend).
 */
export async function uploadMedia(formData: FormData): Promise<Media> {
  const response = await apiClient.postFormData<ApiResponse<Media>>(GALLERY, formData);
  return response.data;
}

/**
 * 3. Actualiza metadatos y/o sustituye el binario visual de un item.
 */
export async function updateMedia(id: string, formData: FormData): Promise<Media> {
  const response = await apiClient.putFormData<ApiResponse<Media>>(GALLERY_BY_ID(id), formData);
  return response.data;
}

/**
 * 4. Elimina definitivamente un media.
 */
export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(GALLERY_BY_ID(id));
}
