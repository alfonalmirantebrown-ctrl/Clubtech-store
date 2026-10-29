'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFaseIntro } from '@/lib/intro';
import { linkWhatsApp } from '@/lib/whatsapp';
import { Isotipo } from './Logo';

export default function Nav() {
  const path = usePathname();
  const fase = useFaseIntro();
  // En la home, el isotipo aparece cuando la intro lo deposita (fase 3)
  const mostrarIsotipo = path !== '/' || fase === 'terminada';

  // En la home, el botón de WhatsApp no aparece en la intro ni durante el giro del celular:
  // recién cuando llegás al catálogo (sección #vestibulo) y desde ahí para abajo
  const [enCatalogo, setEnCatalogo] = useState(false);
  useEffect(() => {
    if (path !== '/') return;
    let frame = 0;
    const medir = () => {
      frame = 0;
      const catalogo = document.getElementById('vestibulo');
      setEnCatalogo(!!catalogo && catalogo.getBoundingClientRect().top <= window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [path]);
  const mostrarWhatsApp = path !== '/' || (fase === 'terminada' && enCatalogo);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-black/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-5 md:px-8" aria-label="Principal">
        <Link href="/" className="group flex items-center gap-3" aria-label="Clubtech, volver al inicio">
          <span id="nav-isotipo-slot" className="block h-8 w-8">
            <span className={`block transition-opacity duration-300 ${mostrarIsotipo ? 'opacity-100' : 'opacity-0'}`}>
              <Isotipo size={32} />
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
          <a
            href={linkWhatsApp('Hola Clubtech! Estoy mirando la web y tengo una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={!mostrarWhatsApp}
            tabIndex={mostrarWhatsApp ? undefined : -1}
            className={`text-off-white transition-[color,opacity] duration-500 hover:text-blue-tech ${mostrarWhatsApp ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            WhatsApp ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
