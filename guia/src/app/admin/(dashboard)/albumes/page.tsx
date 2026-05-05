'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/api/apiClient';
import { ALBUMS, ALBUM_BY_ID } from '@/shared/config/api-endpoints';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, FolderOpen, Star, EyeOff, Pencil, Trash2, X,
  ImageIcon, Film, Loader2, MoreVertical, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ───────────────────────────────────────────────────────────

type Album = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  coverUrl: string | null;
  isActive: boolean;
  destacado: boolean;
  orden: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  totalItems: number;
  photosCount: number;
  videosCount: number;
};

type AlbumFormData = {
  titulo: string;
  slug: string;
  descripcion: string;
  destacado: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
};

const INITIAL_FORM: AlbumFormData = {
  titulo: '',
  slug: '',
  descripcion: '',
  destacado: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
};

// ── Slug helper ─────────────────────────────────────────────────────

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ── Component ───────────────────────────────────────────────────────

export default function AdminAlbumesPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AlbumFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: true; data: Album[] }>(
        ALBUMS, { includeStats: 'true', limit: 50 }, true
      );
      setAlbums(res.data);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error cargando álbumes:', error);
      toast.error('Error al cargar los álbumes', {
        description: error.message || 'Verifica tu conexión y permisos.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setAutoSlug(true);
    setShowModal(true);
  };

  const openEdit = (album: Album) => {
    setEditingId(album.id);
    setForm({
      titulo: album.titulo,
      slug: album.slug,
      descripcion: album.descripcion || '',
      destacado: album.destacado,
      isActive: album.isActive,
      metaTitle: album.metaTitle || '',
      metaDescription: album.metaDescription || '',
    });
    setAutoSlug(false);
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      titulo: val,
      slug: autoSlug ? generateSlug(val) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put<{ success: true }>(
          ALBUM_BY_ID(editingId),
          form,
          true
        );
        toast.success('Álbum actualizado', {
          description: `Se guardaron los cambios para "${form.titulo}".`
        });
      } else {
        await apiClient.post<{ success: true }>(ALBUMS, form, true);
        toast.success('Álbum creado', {
          description: `El álbum "${form.titulo}" se creó correctamente.`
        });
      }
      setShowModal(false);
      fetchAlbums();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error guardando álbum:', error);
      toast.error('Error al guardar', {
        description: error.message || 'Ocurrió un problema al guardar el álbum.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(ALBUM_BY_ID(id), true);
      toast.success('Álbum eliminado', {
        description: 'El álbum y su contenido fueron borrados permanentemente.'
      });
      fetchAlbums();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error eliminando álbum:', error);
      toast.error('Error al eliminar', {
        description: error.message || 'No se pudo eliminar el álbum.'
      });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // State local para menú de opciones
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-stone-900">
            Álbumes
          </h1>
          <p className="text-stone-500 mt-2">
            Organiza tu galería en colecciones temáticas.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo álbum
        </button>
      </div>

      {/* Grid de álbumes */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="h-12 w-12 mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500">No hay álbumes creados aún.</p>
          <button
            onClick={openCreate}
            className="mt-4 text-green-700 hover:text-green-800 text-sm font-medium underline"
          >
            Crear el primer álbum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="relative bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              {/* Overlay link para hacer toda la tarjeta clickeable */}
              <Link href={`/admin/albumes/${album.id}`} className="absolute inset-0 z-10" />

              {/* Cover */}
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden z-0">
                {album.coverUrl ? (
                  album.coverUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      src={album.coverUrl}
                      muted
                      playsInline
                      loop
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={album.coverUrl}
                      alt={album.titulo}
                      fill
                      priority={index < 4}
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen className="h-12 w-12 text-stone-300" />
                  </div>
                )}

                {/* Badges sutiles */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {album.destacado && (
                    <span className="bg-white/80 backdrop-blur-md text-amber-600 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm border border-white/20 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      Destacado
                    </span>
                  )}
                  {!album.isActive && (
                    <span className="bg-stone-900/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Oculto
                    </span>
                  )}
                </div>

                {/* Quick Upload Button (Flotante) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // setShowUploadModal({ isOpen: true, albumId: album.id });
                    // Since UploadModal is in the detail page, we navigate there directly, or we can handle it if we move it here. 
                    // Let's redirect to detail page with ?upload=true for now, or just to detail page.
                    window.location.href = `/admin/albumes/${album.id}?upload=true`;
                  }}
                  className="absolute bottom-3 right-3 h-8 w-8 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center justify-center shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-20"
                  title="Subir fotos rápido"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col relative z-10 pointer-events-none">
                <h3 className="font-semibold text-stone-900 text-lg group-hover:text-green-800 transition-colors line-clamp-1">
                  {album.titulo}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-400 pointer-events-auto">
                  <Link href={`/admin/albumes/${album.id}?filter=photos`} className="flex items-center gap-1 hover:text-green-700 transition-colors">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {album.photosCount} fotos
                  </Link>
                  <Link href={`/admin/albumes/${album.id}?filter=videos`} className="flex items-center gap-1 hover:text-green-700 transition-colors">
                    <Film className="h-3.5 w-3.5" />
                    {album.videosCount} videos
                  </Link>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 pt-0 mt-auto flex items-center justify-end gap-2 relative z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEdit(album);
                  }}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Editar metadata"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === album.id ? null : album.id);
                    }}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {openMenuId === album.id && (
                    <div 
                      className="absolute right-0 bottom-full mb-1 w-48 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden py-1 z-50 animate-in zoom-in-95 origin-bottom-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteConfirmId(album.id);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar álbum
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ MODAL Crear/Editar ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="text-xl font-bold font-fraunces text-stone-900">
                {editingId ? 'Editar álbum' : 'Nuevo álbum'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Título *</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Cenotes de Homún"
                />
              </div>

              {/* Slug (Solo lectura) */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Slug (URL)
                </label>
                <div className="flex bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 text-sm text-stone-400 bg-stone-100 border-r border-stone-200 select-none">
                    /galeria/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    readOnly
                    className="w-full px-3 py-2 text-sm outline-none font-mono bg-transparent text-stone-500 cursor-not-allowed"
                    placeholder="cenotes-de-homun"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                  placeholder="Describe el álbum..."
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm(prev => ({ ...prev, destacado: e.target.checked }))}
                    className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-stone-700">Destacado en home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-stone-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-stone-700">Activo</span>
                </label>
              </div>

              {/* SEO */}
              <details className="border border-stone-200 rounded-lg p-4">
                <summary className="text-sm font-medium text-stone-600 cursor-pointer">
                  SEO (opcional)
                </summary>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none"
                      placeholder="Cenotes de Homún — Mochotours"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Meta Description</label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none resize-none"
                      placeholder="Explora nuestra colección de..."
                    />
                  </div>
                </div>
              </details>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-stone-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.titulo.trim()}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? 'Guardar cambios' : 'Crear álbum'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL Eliminar ═══ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">¿Eliminar álbum?</h2>
              <p className="text-sm text-stone-500 mb-6">
                Esta acción es irreversible. Se eliminará el álbum y <b>todas las fotos y videos</b> que contiene de la base de datos.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
