import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import EasterEgg from '@/components/EasterEgg';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// TODO tipografía final (ver CLAUDE.md → Tipografía). Inter es placeholder.
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Clubtech Store · Tecnología premium en Argentina', template: '%s · Clubtech Store' },
  description: 'Celulares, tablets, laptops, consolas, audio y accesorios. Elegí tu próxima pieza y comprala por WhatsApp.',
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${sans.variable} ${mono.variable}`}>
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
