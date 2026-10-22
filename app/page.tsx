import Hero from '@/components/hero/Hero';
import Vestibulo from '@/components/catalogo/Vestibulo';
import { getCatalogo } from '@/lib/catalogo';

export const revalidate = 600;

export default async function Home() {
  const { categorias, productos } = await getCatalogo();
  const salas = categorias.map((categoria) => {
    const items = productos.filter((p) => p.categoria_id === categoria.id);
    const precios = items.map((p) => p.precioDesde).filter((x): x is number => x != null);
    return { categoria, piezas: items.length, desde: precios.length ? Math.min(...precios) : null };
  });

  return (
    <main>
      <Hero categorias={categorias.length} piezas={productos.length} />
      <Vestibulo salas={salas} />
    </main>
  );
}
