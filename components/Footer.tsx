import Link from 'next/link';
import { linkWhatsApp } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-black px-5 py-10 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-off-white">Clubtech Store</p>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-off-white">Inicio</Link>
          <a href={linkWhatsApp('Hola Clubtech!')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-tech">
            WhatsApp ↗
          </a>
        </div>
        <div className="md:text-right">
          <p>Precios en dólares · Sujetos a stock</p>
          {/* crédito obligatorio de la licencia CC BY 4.0 del modelo 3D */}
          <p className="mt-1 normal-case tracking-[0.06em] text-grey-dim/70">
            Modelo 3D «iPhone 17 Pro» por{' '}
            <a href="https://sketchfab.com/3d-models/iphone-17-pro-4541aa8a28324b33a2baaf81d263aaec" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-off-white">
              Ranguel
            </a>{' '}
            ·{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-off-white">
              CC BY 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
