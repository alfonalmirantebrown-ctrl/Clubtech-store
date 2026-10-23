import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Estante from '@/components/catalogo/Estante';
import { getCatalogo, getEstante } from '@/lib/catalogo';
import { estiloZona } from '@/lib/zonas';

export const revalidate = 600;

type Params = { params: { categoria: string; marca: string } };

export async function generateStaticParams() {
  const { productos } = await getCatalogo();
  const pares = new Set(productos.map((p) => `${p.categoria.slug}/${p.marca.slug}`));
  return Array.from(pares, (x) => {
    const [categoria, marca] = x.split('/');
    return { categoria, marca };
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getEstante(params.categoria, params.marca);
  return data ? { title: `${data.categoria.nombre} ${data.marca.nombre}` } : {};
}

export default async function EstantePage({ params }: Params) {
  const data = await getEstante(params.categoria, params.marca);
  if (!data) notFound();
  const { categoria, marca, productos } = data;
  const { productos: todos } = await getCatalogo();
  const marcasEnSala = new Set(todos.filter((p) => p.categoria_id === categoria.id).map((p) => p.marca_id)).size;

  return (
    <main className="min-h-[100svh] px-5 pb-24 pt-28 md:px-8 md:pt-32" style={estiloZona(categoria.slug)}>
      <div className="mx-auto max-w-[1600px]">
        <nav className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim" aria-label="Migas">
          <Link href="/" className="hover:text-off-white">Vestíbulo</Link>
          <span className="mx-2">/</span>
          {marcasEnSala > 1 ? (
            <Link href={`/catalogo/${categoria.slug}`} className="hover:text-off-white">{categoria.nombre}</Link>
          ) : (
            <span>{categoria.nombre}</span>
          )}
          <span className="mx-2">/</span>
          <span className="text-off-white">{marca.nombre}</span>
        </nav>

        <header className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <h1 className="text-[clamp(48px,9vw,140px)] font-display font-extrabold uppercase leading-[0.84] tracking-[-0.028em] text-white">
            {marca.nombre}
            <span className="block font-serif text-[0.46em] font-normal normal-case italic tracking-[-0.02em]" style={{ color: 'var(--zone-accent)' }}>
              {categoria.nombre.toLowerCase()}
            </span>
          </h1>
          <p className="max-w-[30ch] font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:text-right">
            Precios en dólares. Tocá una pieza para verla de cerca.
          </p>
        </header>

        <Estante productos={productos} />
      </div>
    </main>
  );
}
