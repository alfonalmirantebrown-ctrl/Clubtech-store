// Arma lib/fotos-locales.json con las fotos que hay en public/productos y public/categorias.
// Corre solo antes de cada build (npm "prebuild"), así alcanza con subir la foto al repo:
// no hay que tocar código ni la base de datos.
//
// Nombre del archivo = slug del producto o de la categoría (ej: iphone-17-pro.png, celulares.jpg).
// Se aceptan mayúsculas, espacios y guiones bajos: "iPhone 17 Pro.PNG" también encuentra iphone-17-pro.
import { readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const raiz = new URL('..', import.meta.url).pathname;
const slug = (nombre) =>
  nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

function leer(carpeta) {
  const fotos = {};
  let archivos = [];
  try {
    archivos = readdirSync(join(raiz, 'public', carpeta)).sort();
  } catch {}
  for (const archivo of archivos) {
    const ext = extname(archivo).toLowerCase();
    if (!EXT.has(ext)) continue;
    // si hay dos formatos del mismo modelo, gana el primero (orden alfabético del nombre original)
    fotos[slug(archivo.slice(0, -ext.length))] ??= `/${carpeta}/${encodeURIComponent(archivo)}`;
  }
  return fotos;
}

const manifest = { productos: leer('productos'), categorias: leer('categorias') };
writeFileSync(join(raiz, 'lib', 'fotos-locales.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `fotos: ${Object.keys(manifest.productos).length} de productos, ${Object.keys(manifest.categorias).length} de categorías`,
);
