import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import EasterEgg from '@/components/EasterEgg';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

// Tipografía: Combo 1 (ver CLAUDE.md → Tipografía)
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-display',
  display: 'swap',
});
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
// Mona Sans y Geist Mono no vienen en next/font/google de Next 14: van como archivos propios
const sans = localFont({ src: './fonts/MonaSans-wght.woff2', weight: '200 900', variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Clubtech Store · Tecnología premium en Argentina', template: '%s · Clubtech Store' },
  description: 'Celulares, tablets, laptops, consolas, audio y accesorios. Elegí tu próximo celular y compralo por WhatsApp.',
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${serif.variable} ${sans.variable} ${GeistMono.variable}`}>
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
