import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import GaleriaMarcas from '@/components/catalogo/GaleriaMarcas';
import { getCatalogo, getMarcasDeCategoria } from '@/lib/catalogo';
import { fotoDe } from '@/lib/fotos';
import { estiloZona } from '@/lib/zonas';

export const revalidate = 600;

export async function generateStaticParams() {
  const { categorias } = await getCatalogo();
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: { params: { categoria: string } }): Promise<Metadata> {
  const data = await getMarcasDeCategoria(params.categoria);
  return data ? { title: data.categoria.nombre, description: data.categoria.descripcion ?? undefined } : {};
}

export default async function SalaDeMarcas({ params }: { params: { categoria: string } }) {
  const data = await getMarcasDeCategoria(params.categoria);
  if (!data) notFound();
  const { categoria, marcas } = data;

  // Una sola marca en la sala: directo al estante, sin un clic de más
  if (marcas.length === 1) redirect(`/catalogo/${categoria.slug}/${marcas[0].marca.slug}`);

  const piezas = marcas.reduce((n, m) => n + m.productos.length, 0);

  return (
    <main className="min-h-[100svh] pb-20 pt-28 md:pt-32" style={estiloZona(categoria.slug)}>
      <header className="mx-auto mb-10 grid max-w-[1600px] gap-6 px-5 md:mb-14 md:grid-cols-12 md:px-8">
        <h1 className="text-[clamp(38px,8vw,130px)] font-display font-extrabold uppercase leading-[0.84] tracking-[-0.03em] text-white md:col-span-9">
          {categoria.nombre}
        </h1>
        <div className="flex flex-col justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.14em] md:col-span-3 md:pb-3 md:text-right">
          <p className="text-off-white">{categoria.descripcion}</p>
          <p className="text-grey-dim">
            {marcas.length} marcas · {piezas} modelos
          </p>
        </div>
      </header>

      <GaleriaMarcas
        categoria={categoria.slug}
        items={marcas.map((m) => ({
          marca: m.marca,
          piezas: m.productos.length,
          precioDesde: m.precioDesde,
          modelos: m.productos.map((p) => p.nombre),
          foto: m.productos.map(fotoDe).find(Boolean) ?? null,
        }))}
      />
    </main>
  );
}
