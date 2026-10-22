'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFaseIntro } from '@/lib/intro';
import { linkWhatsApp } from '@/lib/whatsapp';
import { Isotipo } from './Logo';

// Coordenadas de dónde estás en el showroom, no un menú.
function ubicacion(path: string) {
  const partes = path.split('/').filter(Boolean);
  if (partes[0] === 'catalogo' && partes.length === 2) return ['N.02', 'Sala', partes[1]];
  if (partes[0] === 'catalogo' && partes.length === 3) return ['N.03', 'Estante', `${partes[1]} / ${partes[2]}`];
  if (partes[0] === 'producto') return ['N.04', 'Vitrina', partes[1]?.replace(/-/g, ' ')];
  return ['N.01', 'Vestíbulo', 'Planta baja'];
}

function Reloj() {
  const [hora, setHora] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    const tick = () => setHora(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>BUE {hora ?? '--:--'}</span>;
}

export default function Nav() {
  const path = usePathname();
  const fase = useFaseIntro();
  const [nivel, sala, detalle] = ubicacion(path);
  // En la home, el isotipo aparece cuando la intro lo deposita (fase 3)
  const mostrarIsotipo = path !== '/' || fase === 'terminada';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-black/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-5 md:px-8" aria-label="Principal">
        <Link href="/" className="group flex items-center gap-3" aria-label="Clubtech, volver al vestíbulo">
          <span id="nav-isotipo-slot" className="block h-8 w-8">
            <span className={`block transition-opacity duration-300 ${mostrarIsotipo ? 'opacity-100' : 'opacity-0'}`}>
              <Isotipo size={32} />
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <span className="text-blue-tech">{nivel}</span>
          <span className="text-off-white">{sala}</span>
          <span className="hidden truncate text-grey-dim sm:inline">— {detalle}</span>
        </div>

        <div className="ml-auto flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em]">
          <span className="hidden text-grey-dim md:inline">
            <Reloj />
          </span>
          <a
            href={linkWhatsApp('Hola Clubtech! Estoy mirando la web y tengo una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-off-white transition-colors duration-200 hover:text-blue-tech"
          >
            WhatsApp ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
