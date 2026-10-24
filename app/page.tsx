import Vestibulo from '@/components/catalogo/Vestibulo';
import Cierre from '@/components/showroom/Cierre';
import Showroom from '@/components/showroom/Showroom';
import { getCatalogo } from '@/lib/catalogo';
import type { ColorPieza } from '@/lib/escena';
import { fotoDe, fotoDeCategoria } from '@/lib/fotos';
import { esOpcion } from '@/lib/variantes';

export const revalidate = 600;

export default async function Home() {
  const { categorias, productos } = await getCatalogo();
  const salas = categorias.map((categoria) => {
    const items = productos.filter((p) => p.categoria_id === categoria.id);
    const precios = items.map((p) => p.precioDesde).filter((x): x is number => x != null);
    // foto de la card: la propia de la categoría; si no, la del producto héroe; si no, la primera que haya
    const hero = items.find((p) => p.slug === categoria.hero_product_slug);
    const foto = fotoDeCategoria(categoria.slug) ?? (hero && fotoDe(hero)) ?? items.map(fotoDe).find(Boolean) ?? null;
    return { categoria, piezas: items.length, desde: precios.length ? Math.min(...precios) : null, foto };
  });

  // La pieza en exhibición del showroom: el producto héroe de Celulares, con sus colores reales
  const celulares = categorias.find((c) => c.slug === 'celulares');
  const pieza =
    productos.find((p) => p.slug === celulares?.hero_product_slug) ??
    productos.find((p) => p.hero_producto) ??
    productos[0];
  const colores: ColorPieza[] = [];
  pieza?.variantes.forEach((v) => {
    if (!esOpcion(v.color) || !v.color_hex) return;
    const ya = colores.find((c) => c.color === v.color);
    if (!ya) colores.push({ color: v.color, hex: v.color_hex, desde: v.precio_usd });
    else if (v.precio_usd != null && (ya.desde == null || v.precio_usd < ya.desde)) ya.desde = v.precio_usd;
  });

  return (
    <main>
      <Showroom
        pieza={{
          nombre: pieza?.nombre ?? 'Clubtech',
          slug: pieza?.slug ?? '',
          colores: colores.length ? colores : [{ color: 'Silver', hex: '#C0C0C8', desde: null }],
          desde: pieza?.precioDesde ?? null,
        }}
      />
      <Vestibulo salas={salas} />
      <Cierre />
    </main>
  );
}
