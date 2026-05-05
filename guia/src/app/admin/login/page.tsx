'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { LoginForm } from '@/features/auth-login';
import { Toaster } from '@/shared/ui/sonner';

/**
 * Página de Login del Administrador — /admin/login
 *
 * DISEÑO según la guía de construcción (Paso 4):
 * - Fondo: imagen del cenote (Cenote_Persona_Nadando_1) con blur + overlay oscuro
 * - Centro: card blanca con rounded-2xl y shadow-2xl
 * - Logo arriba → título → subtítulo → formulario → botón
 *
 * SEO: esta página hereda noindex/nofollow del admin layout.
 * No necesita meta adicional porque es una página privada.
 */
export default function AdminLoginPage() {
  return (
    <>
      <main className="relative flex items-center justify-center min-h-screen px-4 py-8">
        {/* ── Imagen de fondo con overlay ───────────────────────── */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/login-background.jpg"
            alt=""
            fill
            className="object-cover brightness-[0.4] blur-sm scale-105"
            priority
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* ── Card de login ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white shadow-2xl px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Mochotours Logo"
                width={180}
                height={48}
                className="h-12 w-auto"
                style={{ width: 'auto', height: '100%' }}
                priority
              />
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-stone-dark text-center mb-1">
              Iniciar sesión
            </h1>

            {/* Subtítulo */}
            <p className="text-sm text-stone-text text-center mb-8">
              Accede al panel de administración
            </p>

            {/* Formulario */}
            <LoginForm />
          </div>

          {/* Nota debajo de la card */}
          <p className="text-center text-xs text-white/60 mt-6">
            Panel exclusivo para el administrador del sitio
          </p>
        </motion.div>
      </main>

      {/* ── Toaster para notificaciones ────────────────────────── */}
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
