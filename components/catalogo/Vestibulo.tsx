import Link from 'next/link';
import Glyph from '@/components/Glyph';
import ProductoVisual from '@/components/ProductoVisual';
import type { Foto } from '@/lib/fotos';
import { formatUSD } from '@/lib/format';
import type { Categoria } from '@/lib/types';

type Sala = { categoria: Categoria; piezas: number; desde: number | null; foto: Foto | null };

// Grilla asimétrica: Celulares ocupa toda la primera fila, después 2, después 3 y un pasillo final.
const LAYOUT: Record<string, { col: string; alto: string; radio: string; glyph: string }> = {
  celulares: { col: 'md:col-span-12', alto: 'min-h-[78vw] md:min-h-[68vh]', radio: '0', glyph: 'w-[62%] md:w-[34%] md:right-[8%]' },
  tablets: { col: 'md:col-span-7', alto: 'min-h-[88vw] md:min-h-[440px]', radio: '0 0 0 28px', glyph: 'w-[52%] md:w-[40%]' },
  laptops: { col: 'md:col-span-5', alto: 'min-h-[88vw] md:min-h-[440px]', radio: '2px', glyph: 'w-[58%]' },
  smartwatches: { col: 'md:col-span-4', alto: 'min-h-[88vw] md:min-h-[380px]', radio: '22px 0 0 0', glyph: 'w-[50%]' },
  consolas: { col: 'md:col-span-5', alto: 'min-h-[88vw] md:min-h-[380px]', radio: '0', glyph: 'w-[56%]' },
  audio: { col: 'md:col-span-3', alto: 'min-h-[88vw] md:min-h-[380px]', radio: '0 22px 0 0', glyph: 'w-[60%]' },
  accesorios: { col: 'md:col-span-12', alto: 'min-h-[60vw] md:min-h-[220px]', radio: '0 0 6px 6px', glyph: 'w-[34%] md:w-[13%] md:right-[10%]' },
};

function CardSala({ sala, n }: { sala: Sala; n: number }) {
  const { categoria, piezas, desde, foto } = sala;
  const l = LAYOUT[categoria.slug] ?? LAYOUT.accesorios;
  const grande = categoria.slug === 'celulares';

  return (
    <Link
      href={`/catalogo/${categoria.slug}`}
      className={`group relative isolate col-span-1 flex flex-col justify-between overflow-hidden border border-line bg-[#040404] p-5 transition-[transform,border-color] duration-500 ease-out hover:z-10 hover:scale-[1.02] hover:border-blue-glow focus-visible:scale-[1.02] focus-visible:border-blue-glow md:p-7 ${l.col} ${l.alto}`}
      // containerType: el título se mide contra el ancho de su card (unidades cqi)
      style={{ borderRadius: l.radio, containerType: 'inline-size' }}
    >
      {/* halo que se enciende detrás del producto */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: 'radial-gradient(60% 60% at 70% 55%, rgba(30,127,255,0.16), transparent 70%)' }}
      />

      <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
        <span className="text-grey-dim">N.{String(n).padStart(2, '0')}</span>
        <span className="text-grey-dim transition-colors duration-300 group-hover:text-blue-glow">
          {String(piezas).padStart(2, '0')} {piezas === 1 ? 'modelo' : 'modelos'}
        </span>
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 ${l.glyph}`}
      >
        <div className="float-glyph" style={{ animationDelay: `${-n * 0.9}s` }}>
          {foto ? (
            // lámina con la foto: apagada en reposo, a color cuando entrás
            <ProductoVisual
              nombre={categoria.nombre}
              foto={foto}
              sinFoto={<Glyph categoria={categoria.slug} className="h-auto w-full" />}
              sizes="(min-width: 768px) 30vw, 60vw"
              className="mx-auto aspect-[4/5] w-[78%] max-w-[340px] rotate-[2deg] saturate-[0.35] transition-[filter,transform] duration-700 group-hover:rotate-0 group-hover:saturate-100"
            />
          ) : (
            <Glyph categoria={categoria.slug} className="h-auto w-full" />
          )}
        </div>
      </div>

      <div className="relative">
        <h3
          className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.025em] text-white"
          style={{ fontSize: grande ? 'clamp(36px, 10.5cqi, 150px)' : 'clamp(22px, 7.4cqi, 58px)' }}
        >
          {categoria.nombre}
        </h3>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]">
          <span className="text-off-white/70">{categoria.descripcion}</span>
          {desde != null && <span className="text-grey-dim">desde {formatUSD(desde)}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Vestibulo({ salas }: { salas: Sala[] }) {
  return (
    <section id="vestibulo" className="scroll-mt-14 bg-black px-3 pb-24 pt-20 md:px-5 md:pt-28">
      <header className="mx-auto mb-10 flex max-w-[1600px] items-end justify-between gap-6 px-2 md:mb-14">
        <h2 className="max-w-[16ch] font-display text-[clamp(24px,3vw,42px)] font-bold leading-[0.95] tracking-[-0.02em] text-white">
          Siete categorías.{' '}
          <em className="not-italic font-sans font-light font-normal tracking-[-0.01em] text-off-white/70">Elegí por dónde arrancar.</em>
        </h2>
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:block">Catálogo</p>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-3 md:grid-cols-12">
        {salas.map((s, i) => (
          <CardSala key={s.categoria.id} sala={s} n={i + 1} />
        ))}
      </div>
    </section>
  );
}
