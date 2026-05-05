export type MediaType = 'imagen' | 'video';

export type Media = {
  id: string;
  storage_path: string;
  bucket: string;
  mime_type: string;
  size_bytes: number;
  tipo: MediaType;
  width: number | null;
  height: number | null;
  duration_seg: number | null;
  titulo: string | null;
  descripcion: string | null;
  is_active: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  urlMedia?: string; // inyectaremos esta variable en crudo para lectura directa
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginatedGalleryResponse = {
  data: Media[];
  meta: Meta;
};
