import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Unbounded } from 'next/font/google';
import EasterEgg from '@/components/EasterEgg';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Tipografía (elegida por Joaquín: A + D): Unbounded en titulares, Geist en texto, Geist Mono en etiquetas
const display = Unbounded({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Clubtech Store · Tecnología premium en Argentina', template: '%s · Clubtech Store' },
  description: 'Celulares, tablets, laptops, consolas, audio y accesorios. Elegí tu próximo celular y compralo por WhatsApp.',
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="grain font-sans">
        <SmoothScroll />
        <Nav />
        {children}
        <Footer />
        <EasterEgg />
      </body>
    </html>
  );
}
