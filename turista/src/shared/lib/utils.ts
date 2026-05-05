/**
 * Re-export de cn desde el módulo correcto.
 * Este archivo existe porque shadcn genera imports a "@/shared/lib/utils"
 * pero nosotros renombramos el archivo a "cn.ts" para ser explícitos.
 */
export { cn } from './cn';
