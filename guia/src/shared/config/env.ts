/**
 * Variables de entorno tipadas del proyecto.
 * Se leen desde .env.local (nunca se sube a Git).
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
