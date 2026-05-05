/**
 * Formatea una fecha ISO a un formato legible en español.
 * Ejemplo: "14 de abril de 2026, 2:10 p.m."
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formatea una fecha ISO a formato corto.
 * Ejemplo: "14 abr 2026"
 */
export function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate);

  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formatea bytes a un tamaño legible.
 * Ejemplo: 1048576 → "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
