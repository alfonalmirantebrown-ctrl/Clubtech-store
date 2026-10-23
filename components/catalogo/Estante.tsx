'use client';

import { useMemo, useState } from 'react';
import type { ProductoCompleto } from '@/lib/types';
import { coloresDe, memoriasDe } from '@/lib/variantes';
import ProductoCard from './ProductoCard';

const RANGOS = [
  { id: 'hasta-500', label: 'Hasta US$ 500', min: 0, max: 500 },
  { id: '500-1000', label: 'US$ 500 – 1.000', min: 500, max: 1000 },
  { id: '1000-1500', label: 'US$ 1.000 – 1.500', min: 1000, max: 1500 },
  { id: 'mas-1500', label: 'Más de US$ 1.500', min: 1500, max: Infinity },
];

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 ${
        activo
          ? 'border-[color:var(--zone-accent)] bg-[color:var(--zone-accent)] text-black'
          : 'border-line text-off-white/80 hover:border-off-white/40'
      }`}
    >
      {children}
    </button>
  );
}

export default function Estante({ productos }: { productos: ProductoCompleto[] }) {
  const [memoria, setMemoria] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [rango, setRango] = useState<string | null>(null);

  const todas = useMemo(() => productos.flatMap((p) => p.variantes), [productos]);
  const memorias = useMemo(() => memoriasDe(todas), [todas]);
  const colores = useMemo(() => coloresDe(todas), [todas]);
  const rangos = useMemo(
    () => RANGOS.filter((r) => todas.some((v) => v.precio_usd != null && v.precio_usd >= r.min && v.precio_usd < r.max)),
    [todas],
  );

  const visibles = useMemo(() => {
    const r = RANGOS.find((x) => x.id === rango);
    // un producto entra si al menos UNA variante cumple todos los filtros a la vez
    return productos.filter((p) =>
      p.variantes.some(
        (v) =>
          (!memoria || v.memoria === memoria) &&
          (!color || v.color === color) &&
          (!r || (v.precio_usd != null && v.precio_usd >= r.min && v.precio_usd < r.max)),
      ),
    );
  }, [productos, memoria, color, rango]);

  const hayFiltros = memoria || color || rango;
  const toggle = (set: (v: string | null) => void, actual: string | null, v: string) => set(actual === v ? null : v);

  return (
    <>
      <div className="sticky top-14 z-30 -mx-5 mb-6 border-y border-line bg-[color-mix(in_srgb,var(--zone-bg)_95%,transparent)] px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8">
        <div className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {memorias.length > 1 && (
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Memoria</legend>
              <span aria-hidden className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-grey-dim">Mem.</span>
              {memorias.map((m) => (
                <Chip key={m} activo={memoria === m} onClick={() => toggle(setMemoria, memoria, m)}>
                  {m}
                </Chip>
              ))}
            </fieldset>
          )}
          {colores.length > 1 && (
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Color</legend>
              <span aria-hidden className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-grey-dim">Color</span>
              {colores.map((c) => (
                <Chip key={c.color} activo={color === c.color} onClick={() => toggle(setColor, color, c.color)}>
                  <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ background: c.hex ?? '#666' }} />
                  {c.color}
                </Chip>
              ))}
            </fieldset>
          )}
          {rangos.length > 1 && (
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Precio</legend>
              <span aria-hidden className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-grey-dim">Precio</span>
              {rangos.map((r) => (
                <Chip key={r.id} activo={rango === r.id} onClick={() => toggle(setRango, rango, r.id)}>
                  {r.label}
                </Chip>
              ))}
            </fieldset>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim">
        <span aria-live="polite">
          {String(visibles.length).padStart(2, '0')} / {String(productos.length).padStart(2, '0')} modelos
        </span>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => {
              setMemoria(null);
              setColor(null);
              setRango(null);
            }}
            className="text-off-white underline decoration-line underline-offset-4 hover:decoration-off-white"
          >
            Limpiar
          </button>
        )}
      </div>

      {visibles.length ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {visibles.map((p) => (
            <ProductoCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="py-24 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-grey-dim">
          No hay modelos con esa combinación. Probá sacando un filtro.
        </p>
      )}
    </>
  );
}
