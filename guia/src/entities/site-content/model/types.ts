export type SiteSection = {
  id: string;
  seccion: string;
  titulo: string | null;
  descripcion: string | null;
  imagenUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteContent = Record<string, SiteSection>;
