# Fotos de Clubtech

Para poner una foto alcanza con **subir el archivo a la carpeta correcta del repo**. No hay que tocar código ni Supabase: en el próximo deploy (automático, ~2 min) la foto aparece en la web.

## Dónde va cada una

| Qué | Carpeta | Nombre del archivo | Ejemplo |
|---|---|---|---|
| Producto | `public/productos/` | el código del modelo (abajo) | `iphone-17-pro.png` |
| Categoría (card del inicio) | `public/categorias/` | el nombre de la categoría | `celulares.jpg` |

- Formatos: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`.
- Mayúsculas y espacios no importan: `iPhone 17 Pro.PNG` funciona igual que `iphone-17-pro.png`.
- Si una categoría no tiene foto propia, la card usa la foto de su producto principal.
- Cuando un modelo tiene su foto, la "Muestra" de Wikimedia de ese modelo deja de verse sola.

## Cómo tienen que ser

**Productos:** producto solo, sin manos ni caja, fondo **negro o transparente** (PNG), mismo ángulo en todos los modelos, al menos 1600 px de alto, menos de 5 MB. Se muestran enteras, sin recortar.

**Categorías:** foto de ambiente (puede tener fondo, mesa, luz), horizontal o vertical, al menos 1600 px. Esta sí se recorta para llenar la card y en reposo se ve apagada (en blanco y negro casi); se enciende al pasar el mouse.

## Fotos oficiales cargadas (octubre 2026)

Las fotos de `public/productos/` (`.webp` con fondo transparente) son las fotos de producto que publica cada marca en su sitio oficial, con el ángulo que usa cada una: Apple (store.storeimages.cdn-apple.com y apple.com), Samsung (images.samsung.com), Motorola (tiendas oficiales motorola.com.ar y motorola.com.pe), Xiaomi (mi.com), PlayStation (gmedia.playstation.com), Nintendo (assets.nintendo.com) y Xbox (catálogo de Microsoft). Se recortaron, se les sacó el fondo y se achicaron a 2000 px como máximo.

- Sin foto oficial publicada (quedan con "Foto en camino"): `moto-g57`, `moto-g06-power`.
- Algunas marcas publican la foto más chica que lo ideal (AirPods, Apple Watch, Motorola ~1000 px). Si Clubtech tiene fotos propias mejores, alcanza con subirlas con el mismo nombre (la de mayor prioridad es la primera en orden alfabético: borrar el `.webp` viejo al subir la nueva).
- El color de la foto es el que publica la marca; no siempre coincide con todos los colores en stock.

## Cómo subirlas desde el navegador (sin instalar nada)

1. Entrá al repo en GitHub → carpeta `public/productos` (o `public/categorias`).
2. **Add file → Upload files** y arrastrá las fotos (hasta 100 por vez, 25 MB cada una).
3. Abajo, **Commit changes**. Sin ese paso no se sube nada.
4. Esperá el deploy de Vercel y recargá la web.

## Lista de nombres

### Categorías (`public/categorias/`)
`celulares` · `tablets` · `laptops` · `smartwatches` · `consolas` · `audio` · `accesorios`

### Productos (`public/productos/`)

**Celulares · Apple**
- [x] iphone-15
- [x] iphone-16
- [x] iphone-17
- [x] iphone-17e
- [x] iphone-17-pro
- [x] iphone-17-pro-max
- [x] iphone-18-pro
- [x] iphone-18-pro-max

**Celulares · Samsung**
- [x] galaxy-a07
- [x] galaxy-a16
- [x] galaxy-a17
- [x] galaxy-a27
- [x] galaxy-a57
- [x] galaxy-s25-fe
- [x] galaxy-s25-ultra
- [x] galaxy-s26
- [x] galaxy-s26-plus
- [x] galaxy-s26-ultra
- [x] galaxy-s26-fe
- [x] galaxy-z-flip-8

**Celulares · Motorola**
- [ ] moto-g06-power
- [x] moto-g15
- [x] moto-g17
- [ ] moto-g57
- [x] moto-g86
- [x] moto-g86-power

**Celulares · Xiaomi**
- [x] redmi-15c
- [x] redmi-17
- [x] redmi-note-15
- [x] redmi-note-15-pro
- [x] redmi-note-15-pro-plus
- [x] poco-x7-pro
- [x] poco-x8-pro

**Tablets**
- [x] ipad-a16
- [x] ipad-pro-m5
- [x] galaxy-tab-a11
- [x] galaxy-tab-s10-lite
- [x] galaxy-tab-s10-fe
- [x] galaxy-tab-s10-fe-plus
- [x] galaxy-tab-s11-ultra

**Laptops**
- [x] macbook-neo
- [x] macbook-pro-m5
- [x] macbook-pro-m5-pro

**Smartwatches**
- [x] apple-watch-s11
- [x] apple-watch-se-3

**Consolas**
- [x] nintendo-switch-2
- [x] playstation-5-digital-slim
- [x] playstation-5-standard-slim
- [x] playstation-5-pro
- [x] playstation-vr2
- [x] xbox-series-s
- [x] xbox-series-x

**Audio**
- [x] airpods-4
- [x] airpods-pro-3
- [x] airpods-max-2

**Accesorios**
- [x] apple-pencil
- [x] cable-original
- [x] cargador-20w-original
- [x] cargador-40w-dynamic
- [x] joystick-ps5
- [x] cargador-samsung-25w
