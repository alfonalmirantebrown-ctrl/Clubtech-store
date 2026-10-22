// Forma de las tablas en Supabase (ver CLAUDE.md → Schema)

export type Categoria = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  hero_product_slug: string | null;
};

export type Marca = {
  id: number;
  slug: string;
  nombre: string;
  color_hex: string | null;
  grad_from: string | null;
  grad_via: string | null;
  grad_to: string | null;
  glow: string | null;
  logo_label: string | null;
};

export type Producto = {
  id: number;
  slug: string;
  nombre: string;
  marca_id: number;
  categoria_id: number;
  tagline: string | null;
  descripcion: string | null;
  destacado: boolean | null;
  hero_producto: boolean | null;
  orden: number | null;
  image_url: string | null;
};

export type Variante = {
  id: number;
  producto_id: number;
  memoria: string | null;
  color: string | null;
  color_hex: string | null;
  stock: number | null;
  precio_usd: number | null;
};

export type ProductoCompleto = Producto & {
  marca: Marca;
  categoria: Categoria;
  variantes: Variante[];
  precioDesde: number | null;
};
