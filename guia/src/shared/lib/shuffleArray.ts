/**
 * Baraja un array aleatoriamente usando el algoritmo Fisher-Yates.
 * Retorna una COPIA (no modifica el original).
 *
 * Se usa para mostrar fotos aleatorias en el hero y en el preview
 * de la galería de la home.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
