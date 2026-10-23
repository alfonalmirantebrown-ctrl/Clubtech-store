'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Foto } from '@/lib/fotos';

type Props = {
  nombre: string;
  foto: Foto | null;
  tinte?: string | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** muestra el crédito de la foto (solo en la vitrina) */
  credito?: boolean;
  /** qué mostrar si no hay foto o falla (por defecto, el espacio vacío) */
  sinFoto?: React.ReactNode;
};

// Lugar reservado para la foto: marcas de corte como en un set de fotos.
function EspacioVacio({ nombre, tinte }: { nombre: string; tinte?: string | null }) {
  const esquina = 'absolute h-4 w-4 border-off-white/30';
  return (
    <div className="absolute inset-0" role="img" aria-label={`${nombre}: foto pendiente`}>
      <span className={`${esquina} left-0 top-0 border-l border-t`} />
      <span className={`${esquina} right-0 top-0 border-r border-t`} />
      <span className={`${esquina} bottom-0 left-0 border-b border-l`} />
      <span className={`${esquina} bottom-0 right-0 border-b border-r`} />
      <span
        aria-hidden
        className="absolute inset-[18%] transition-[background] duration-700"
        style={{ background: `radial-gradient(closest-side, ${tinte ?? '#1E7FFF'}24, transparent)` }}
      />
      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-grey-dim">
        Foto en camino
      </span>
    </div>
  );
}

export default function ProductoVisual({ nombre, foto, tinte, priority, sizes = '50vw', className = '', credito, sinFoto }: Props) {
  const [rota, setRota] = useState(false);

  return (
    // si el que llama ya lo posiciona (absolute), no lo pisamos con relative
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} ${className}`}>
      {foto && !rota ? (
        <>
          <Image
            src={foto.src}
            alt={nombre}
            fill
            priority={priority}
            sizes={sizes}
            // las fotos de muestra vienen de Wikimedia: el navegador las pide directo
            unoptimized={foto.demo}
            onError={() => setRota(true)}
            className="object-cover"
          />
          {foto.demo && (
            <span className="absolute left-2 top-2 bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-off-white/80">
              Muestra
            </span>
          )}
          {credito && foto.credito && (
            <span className="absolute -bottom-6 left-0 font-mono text-[9px] uppercase tracking-[0.12em] text-grey-dim">
              {foto.credito}
            </span>
          )}
        </>
      ) : (
        sinFoto ?? <EspacioVacio nombre={nombre} tinte={tinte} />
      )}
    </div>
  );
}
