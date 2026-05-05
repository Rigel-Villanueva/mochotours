'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { useAuth } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ApiException } from '@/shared/api/types';

// ── Schema de validación ────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ── Componente ──────────────────────────────────────────────────────

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data);
      toast.success('¡Bienvenido de vuelta!', {
        description: 'Redirigiendo al panel de control…',
      });
      router.push(ROUTES.ADMIN);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 401) {
          toast.error('Correo o contraseña incorrectos', {
            description: 'Revisa que estés usando las credenciales correctas e intenta de nuevo.',
          });
        } else if (error.fieldErrors) {
          error.fieldErrors.forEach((fieldError) => {
            toast.error(fieldError.message);
          });
        } else {
          toast.error('Algo salió mal', {
            description: error.message || 'Intenta de nuevo en unos momentos.',
          });
        }
      } else {
        toast.error('Sin conexión al servidor', {
          description: 'Verifica tu internet o intenta más tarde.',
        });
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Campo: Email */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email" className="text-stone-dark font-medium">
          Correo electrónico
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          className="h-11 text-base"
          {...register('email')}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Campo: Contraseña */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password" className="text-stone-dark font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            className="h-11 text-base pr-11"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-text hover:text-stone-dark transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Botón de submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-primary text-white font-semibold text-base hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Iniciando…
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  );
}
