'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * ResilientImage — Componente Image que NUNCA muestra imagen rota.
 *
 * Si la imagen del servidor falla al cargar (CDN caído, URL rota,
 * error de red, etc.), automáticamente muestra la imagen local de
 * fallback sin que el usuario note nada.
 *
 * Uso:
 *   <ResilientImage
 *     src={imagenDelServidor}
 *     fallbackSrc="/imagen-local.jpg"
 *     alt="Descripción"
 *     fill
 *   />
 */

type ResilientImageProps = Omit<ImageProps, 'onError'> & {
  fallbackSrc: string;
};

export function ResilientImage({ fallbackSrc, src, alt, ...props }: ResilientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
