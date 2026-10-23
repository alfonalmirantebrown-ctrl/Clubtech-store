import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductoCard from '@/components/catalogo/ProductoCard';
import Vitrina from '@/components/catalogo/Vitrina';
import { getCatalogo, getProducto } from '@/lib/catalogo';

export const revalidate = 600;

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const { productos } = await getCatalogo();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getProducto(params.slug);
  if (!data) return {};
  const { producto } = data;
  return { title: producto.nombre, description: producto.tagline ?? undefined };
}

export default async function ProductoPage({ params }: Params) {
  const data = await getProducto(params.slug);
  if (!data) notFound();
  const { producto, relacionados } = data;

  // la vitrina siempre es negra con glow (ver CLAUDE.md); el acento de las cards es blue-glow
  return (
    <main className="bg-black" style={{ '--zone-bg': 'var(--black)', '--zone-accent': 'var(--blue-glow)' } as React.CSSProperties}>
      <Vitrina producto={producto} />

      {relacionados.length > 0 && (
        <section className="border-t border-line px-5 pb-24 pt-14 md:px-8">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-6 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
              <h2 className="text-off-white">También en {producto.categoria.nombre.toLowerCase()}</h2>
              <Link href={`/catalogo/${producto.categoria.slug}`} className="text-grey-dim hover:text-off-white">
                Ver {producto.categoria.nombre} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              {relacionados.map((p) => (
                <ProductoCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
