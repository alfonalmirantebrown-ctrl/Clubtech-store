import Link from 'next/link';
import ProductoVisual from '@/components/ProductoVisual';
import { formatUSD } from '@/lib/format';
import type { ProductoCompleto } from '@/lib/types';
import { coloresDe } from '@/lib/variantes';

export default function ProductoCard({ p }: { p: ProductoCompleto }) {
  const colores = coloresDe(p.variantes);
  return (
    <Link
      href={`/producto/${p.slug}`}
      className="group flex flex-col border border-line bg-black/40 p-3 transition-[border-color] duration-300 hover:border-[color:var(--zone-accent)] focus-visible:border-[color:var(--zone-accent)] md:p-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {p.destacado && (
          <span className="absolute left-0 top-0 z-10 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--zone-accent)]">
            ● Destacado
          </span>
        )}
        <ProductoVisual
          nombre={p.nombre}
          categoria={p.categoria.slug}
          imageUrl={p.image_url}
          tinte={p.variantes[0]?.color_hex}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="absolute inset-[12%] h-[76%] w-[76%] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white md:text-[17px]">{p.nombre}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-grey-dim">desde {formatUSD(p.precioDesde)}</p>
        </div>
        {colores.length > 0 && (
          <div className="flex shrink-0 -space-x-1" aria-label={`${colores.length} colores`}>
            {colores.slice(0, 4).map((c) => (
              <span key={c.color} className="h-2.5 w-2.5 rounded-full border border-black" style={{ background: c.hex ?? '#666' }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
