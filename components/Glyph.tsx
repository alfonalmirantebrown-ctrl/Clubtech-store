// Dibujos de línea por categoría: se usan mientras no haya fotos reales.
// `tinte` pinta el cuerpo del objeto (ej: el color de la variante elegida).

type Props = { categoria: string; tinte?: string | null; className?: string };

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' as const };

function Cuerpo({ categoria, t }: { categoria: string; t: string }) {
  const body = { fill: t, fillOpacity: 0.14, stroke: 'currentColor', strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' as const };
  switch (categoria) {
    case 'celulares':
      return (
        <>
          <rect x="62" y="18" width="76" height="164" rx="17" {...body} />
          <rect x="67" y="23" width="66" height="154" rx="13" {...S} opacity={0.35} />
          <rect x="72" y="30" width="30" height="34" rx="9" {...S} />
          <circle cx="81" cy="40" r="5.5" {...S} />
          <circle cx="93" cy="40" r="5.5" {...S} />
          <circle cx="81" cy="54" r="5.5" {...S} />
          <circle cx="93" cy="54" r="2" fill="var(--blue-glow)" />
          <line x1="138" y1="58" x2="138" y2="74" stroke="currentColor" strokeWidth={2.4} />
        </>
      );
    case 'tablets':
      return (
        <>
          <rect x="30" y="30" width="140" height="140" rx="12" {...body} />
          <rect x="38" y="38" width="124" height="124" rx="6" {...S} opacity={0.35} />
          <circle cx="100" cy="34" r="1.6" fill="var(--blue-glow)" />
          <line x1="172" y1="60" x2="172" y2="92" stroke="currentColor" strokeWidth={2} opacity={0.7} />
        </>
      );
    case 'laptops':
      return (
        <>
          <rect x="44" y="44" width="112" height="76" rx="5" {...body} />
          <rect x="50" y="50" width="100" height="64" rx="2" {...S} opacity={0.35} />
          <path d="M28 124 H172 L164 136 H36 Z" {...S} />
          <line x1="88" y1="124" x2="112" y2="124" stroke="var(--blue-glow)" strokeWidth={2} />
          <circle cx="100" cy="47" r="1.2" fill="var(--blue-glow)" />
        </>
      );
    case 'smartwatches':
      return (
        <>
          <path d="M80 22 H120 L116 58 H84 Z" {...S} opacity={0.6} />
          <path d="M84 142 H116 L120 178 H80 Z" {...S} opacity={0.6} />
          <rect x="66" y="56" width="68" height="88" rx="20" {...body} />
          <rect x="73" y="63" width="54" height="74" rx="14" {...S} opacity={0.35} />
          <rect x="134" y="84" width="6" height="16" rx="2.5" {...S} />
          <path d="M100 100 L100 82 M100 100 L112 108" stroke="var(--blue-glow)" strokeWidth={1.6} fill="none" />
        </>
      );
    case 'consolas':
      return (
        <>
          <path d="M54 72 C38 72 28 92 24 122 C21 146 32 156 44 150 C54 144 60 128 72 124 H128 C140 128 146 144 156 150 C168 156 179 146 176 122 C172 92 162 72 146 72 Z" {...body} />
          <circle cx="64" cy="98" r="10" {...S} />
          <circle cx="114" cy="112" r="9" {...S} opacity={0.6} />
          <circle cx="86" cy="112" r="9" {...S} opacity={0.6} />
          <circle cx="138" cy="90" r="3" {...S} />
          <circle cx="150" cy="100" r="3" {...S} />
          <circle cx="138" cy="110" r="3" {...S} />
          <circle cx="126" cy="100" r="3" fill="var(--blue-glow)" />
          <line x1="94" y1="86" x2="106" y2="86" stroke="var(--blue-glow)" strokeWidth={2} />
        </>
      );
    case 'audio':
      return (
        <>
          <path d="M46 112 V96 C46 62 70 38 100 38 C130 38 154 62 154 96 V112" {...S} />
          <rect x="34" y="104" width="34" height="58" rx="15" {...body} />
          <rect x="132" y="104" width="34" height="58" rx="15" {...body} />
          <line x1="51" y1="118" x2="51" y2="148" stroke="var(--blue-glow)" strokeWidth={1.6} />
          <line x1="149" y1="118" x2="149" y2="148" stroke="currentColor" strokeWidth={1.2} opacity={0.4} />
        </>
      );
    default:
      // accesorios: cargador + cable
      return (
        <>
          <rect x="58" y="62" width="58" height="62" rx="10" {...body} />
          <line x1="76" y1="62" x2="76" y2="44" stroke="currentColor" strokeWidth={3} />
          <line x1="98" y1="62" x2="98" y2="44" stroke="currentColor" strokeWidth={3} />
          <rect x="80" y="118" width="14" height="8" rx="2" {...S} />
          <path d="M87 126 C87 160 120 170 140 148 C156 130 150 104 160 92" {...S} />
          <rect x="155" y="78" width="10" height="16" rx="3" {...S} />
          <circle cx="87" cy="80" r="2" fill="var(--blue-glow)" />
        </>
      );
  }
}

export default function Glyph({ categoria, tinte, className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={`text-off-white ${className}`} aria-hidden>
      <Cuerpo categoria={categoria} t={tinte ?? 'var(--white)'} />
    </svg>
  );
}
