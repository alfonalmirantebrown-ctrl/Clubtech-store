import { cache } from 'react';
import { supabase } from './supabase';
import type { Categoria, Marca, Producto, ProductoCompleto, Variante } from './types';

// El catálogo entero son ~200 filas: lo traemos de una vez y armamos las relaciones acá.
// Cada página filtra sobre esto, así no hay N consultas por render.
export const getCatalogo = cache(async () => {
  const [c, m, p, v] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase.from('marcas').select('*'),
    supabase.from('productos').select('*').order('orden'),
    supabase.from('variantes').select('*'),
  ]);
  const error = c.error ?? m.error ?? p.error ?? v.error;
  if (error) throw new Error(`Supabase: ${error.message}`);

  const categorias = c.data as Categoria[];
  const marcas = m.data as Marca[];
  const variantes = v.data as Variante[];

  const productos: ProductoCompleto[] = (p.data as Producto[]).flatMap((prod) => {
    const marca = marcas.find((x) => x.id === prod.marca_id);
    const categoria = categorias.find((x) => x.id === prod.categoria_id);
    if (!marca || !categoria) return [];
    const vs = variantes.filter((x) => x.producto_id === prod.id);
    const precios = vs.map((x) => x.precio_usd).filter((x): x is number => x != null);
    return [{ ...prod, marca, categoria, variantes: vs, precioDesde: precios.length ? Math.min(...precios) : null }];
  });

  return { categorias, marcas, productos };
});

export async function getCategoria(slug: string) {
  const { categorias, productos } = await getCatalogo();
  const categoria = categorias.find((c) => c.slug === slug);
  if (!categoria) return null;
  return { categoria, productos: productos.filter((p) => p.categoria_id === categoria.id) };
}

export async function getMarcasDeCategoria(slug: string) {
  const data = await getCategoria(slug);
  if (!data) return null;
  const { marcas } = await getCatalogo();
  const conProductos = marcas
    .map((marca) => {
      const items = data.productos.filter((p) => p.marca_id === marca.id);
      const precios = items.map((p) => p.precioDesde).filter((x): x is number => x != null);
      return {
        marca,
        productos: items,
        precioDesde: precios.length ? Math.min(...precios) : null,
      };
    })
    .filter((x) => x.productos.length > 0)
    .sort((a, b) => b.productos.length - a.productos.length);
  return { categoria: data.categoria, marcas: conProductos };
}

export async function getEstante(categoriaSlug: string, marcaSlug: string) {
  const data = await getCategoria(categoriaSlug);
  if (!data) return null;
  const productos = data.productos.filter((p) => p.marca.slug === marcaSlug);
  if (!productos.length) return null;
  return { categoria: data.categoria, marca: productos[0].marca, productos };
}

export async function getProducto(slug: string) {
  const { productos } = await getCatalogo();
  const producto = productos.find((p) => p.slug === slug);
  if (!producto) return null;
  const relacionados = productos
    .filter((p) => p.categoria_id === producto.categoria_id && p.id !== producto.id)
    .slice(0, 4);
  return { producto, relacionados };
}
