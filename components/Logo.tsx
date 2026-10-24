'use client';

import { useEffect, useRef, useState } from 'react';

// Si la imagen falló antes de que React hidrate, onError nunca se dispara:
// por eso también chequeamos el estado de la imagen al montar.
function useImagenRota() {
  const ref = useRef<HTMLImageElement>(null);
  const [rota, setRota] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setRota(true);
  }, []);
  return { ref, rota, onError: () => setRota(true) };
}

// Usa los archivos reales de /public/brand. Si todavía no se subieron,
// cae a una versión tipográfica para que nada se vea roto.
export function Isotipo({ size = 32, className = '' }: { size?: number; className?: string }) {
  const { ref, rota, onError } = useImagenRota();
  if (rota) {
    return (
      <span
        className={`grid place-items-center bg-blue-tech font-mono text-[11px] font-bold text-white ${className}`}
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
        aria-label="Clubtech"
      >
        CT
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/brand/logo-isotipo.png"
      alt="Clubtech"
      width={size}
      height={size}
      onError={onError}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

export function LogoTipografico({ className = '' }: { className?: string }) {
  const { ref, rota, onError } = useImagenRota();
  if (rota) {
    return (
      <span className={`whitespace-nowrap font-display text-[clamp(22px,4vw,52px)] font-extrabold tracking-[-0.022em] text-white ${className}`}>
        CLUB<span className="text-blue-tech">TECH</span>
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src="/brand/logo-tipografico.jpeg" alt="Clubtech" onError={onError} className={`w-[min(70vw,520px)] ${className}`} />
  );
}
