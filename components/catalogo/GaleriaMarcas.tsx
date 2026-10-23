'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import Glyph from '@/components/Glyph';
import ProductoVisual from '@/components/ProductoVisual';
import type { Foto } from '@/lib/fotos';
import { formatUSD } from '@/lib/format';
import type { Marca } from '@/lib/types';

type Item = { marca: Marca; piezas: number; precioDesde: number | null; modelos: string[]; foto: Foto | null };

export default function GaleriaMarcas({ categoria, items }: { categoria: string; items: Item[] }) {
  const pista = useRef<HTMLDivElement>(null);

  const mover = useCallback((dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 12), behavior: 'smooth' });
  }, []);

  // ← → recorren la galería (salvo que estés escribiendo en un campo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mover]);

  return (
    <div>
      <div
        ref={pista}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Marcas"
      >
        {items.map(({ marca, piezas, precioDesde, modelos, foto }, i) => (
          <Link
            key={marca.id}
            href={`/catalogo/${categoria}/${marca.slug}`}
            data-card
            role="listitem"
            className="group relative isolate flex h-[68svh] min-h-[460px] w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden border border-line p-6 transition-[border-color] duration-500 hover:border-[color:var(--glow)] focus-visible:border-[color:var(--glow)] md:w-[440px] md:p-8"
            style={
              {
                '--glow': marca.glow ?? 'var(--blue-glow)',
                borderRadius: i % 2 ? '0 0 32px 0' : '0',
                containerType: 'inline-size',
                background: `radial-gradient(120% 70% at 50% 110%, ${marca.grad_to ?? '#000'}55, transparent 60%), radial-gradient(90% 60% at 80% 0%, ${marca.grad_via ?? '#000'}33, transparent 70%), var(--zone-bg)`,
              } as React.CSSProperties
            }
          >
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim">
              <span>{String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
              <span>{String(piezas).padStart(2, '0')} {piezas === 1 ? 'modelo' : 'modelos'}</span>
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[16%] mx-auto w-[58%] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04]">
              <div className="float-glyph" style={{ animationDelay: `${-i * 1.3}s` }}>
                {foto ? (
                  <ProductoVisual
                    nombre={marca.nombre}
                    foto={foto}
                    sinFoto={<Glyph categoria={categoria} tinte={marca.glow} className="h-auto w-full" />}
                    sizes="(min-width: 768px) 260px, 50vw"
                    className="mx-auto aspect-[4/5] w-[86%] saturate-[0.4] transition-[filter] duration-700 group-hover:saturate-100"
                  />
                ) : (
                  <Glyph categoria={categoria} tinte={marca.glow} className="h-auto w-full" />
                )}
              </div>
            </div>

            <div className="relative">
              <ul className="mb-5 space-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-off-white/60">
                {modelos.slice(0, 3).map((m) => (
                  <li key={m}>— {m}</li>
                ))}
                {modelos.length > 3 && <li className="text-grey-dim">+ {modelos.length - 3} más</li>}
              </ul>
              <h2
                className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.025em] text-white"
                style={{ fontSize: 'clamp(32px, 12.5cqi, 72px)' }}
              >
                {marca.nombre}
              </h2>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--glow)' }}>
                desde {formatUSD(precioDesde)} <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:px-8">
        <button type="button" onClick={() => mover(-1)} className="px-1 py-2 transition-colors hover:text-off-white" aria-label="Marca anterior">
          ← Ant.
        </button>
        <span className="h-px w-12 bg-line" />
        <button type="button" onClick={() => mover(1)} className="px-1 py-2 transition-colors hover:text-off-white" aria-label="Marca siguiente">
          Sig. →
        </button>
        <span className="ml-auto hidden md:inline">También con las flechas del teclado</span>
      </div>
    </div>
  );
}
