import Hero from '@/components/hero/Hero';
import Vestibulo from '@/components/catalogo/Vestibulo';
import { getCatalogo } from '@/lib/catalogo';
import { fotoDe } from '@/lib/fotos';

export const revalidate = 600;

export default async function Home() {
  const { categorias, productos } = await getCatalogo();
  const salas = categorias.map((categoria) => {
    const items = productos.filter((p) => p.categoria_id === categoria.id);
    const precios = items.map((p) => p.precioDesde).filter((x): x is number => x != null);
    // foto de la sala: la del producto héroe si tiene, si no la primera que haya
    const hero = items.find((p) => p.slug === categoria.hero_product_slug);
    const foto = (hero && fotoDe(hero)) ?? items.map(fotoDe).find(Boolean) ?? null;
    return { categoria, piezas: items.length, desde: precios.length ? Math.min(...precios) : null, foto };
  });

  return (
    <main>
      <Hero categorias={categorias.length} piezas={productos.length} />
      <Vestibulo salas={salas} />
    </main>
  );
}
