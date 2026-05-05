import type { Metadata } from 'next';
import { fraunces, inter } from './fonts';
import { AuthProvider } from './providers/auth-provider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Cenotes Aventura y Más | Tours en Homún, Yucatán — Mochotours',
    template: '%s | Mochotours',
  },
  description:
    'Descubre los cenotes más impresionantes de Homún con un guía local. Tours en moto-taxi tradicional, agua cristalina y experiencia auténtica en Yucatán.',
  keywords: [
    'cenotes Homún',
    'tour cenotes Yucatán',
    'cenotes cerca de Mérida',
    'guía local cenotes',
    'mochótours',
    'tours en moto-taxi tradicional',
  ],
  openGraph: {
    title: 'Cenotes Aventura y Más | Mochotours',
    description:
      'Vive la aventura maya real en los cenotes de Homún con guía local y moto-taxi tradicional.',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

