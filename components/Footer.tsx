import Link from 'next/link';
import { linkWhatsApp } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-black px-5 py-10 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-off-white">Clubtech Store</p>
          <p>Tecnología premium · Argentina</p>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-off-white">Inicio</Link>
          <a href={linkWhatsApp('Hola Clubtech!')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-tech">
            WhatsApp ↗
          </a>
        </div>
        <p>Precios en dólares · Sujetos a stock</p>
      </div>
    </footer>
  );
}
