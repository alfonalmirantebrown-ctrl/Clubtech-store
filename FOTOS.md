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
- [ ] iphone-15
- [ ] iphone-16
- [ ] iphone-17
- [ ] iphone-17e
- [ ] iphone-17-pro
- [ ] iphone-17-pro-max
- [ ] iphone-18-pro
- [ ] iphone-18-pro-max

**Celulares · Samsung**
- [ ] galaxy-a07
- [ ] galaxy-a16
- [ ] galaxy-a17
- [ ] galaxy-a27
- [ ] galaxy-a57
- [ ] galaxy-s25-fe
- [ ] galaxy-s25-ultra
- [ ] galaxy-s26
- [ ] galaxy-s26-plus
- [ ] galaxy-s26-ultra
- [ ] galaxy-s26-fe
- [ ] galaxy-z-flip-8

**Celulares · Motorola**
- [ ] moto-g06-power
- [ ] moto-g15
- [ ] moto-g17
- [ ] moto-g57
- [ ] moto-g86
- [ ] moto-g86-power

**Celulares · Xiaomi**
- [ ] redmi-15c
- [ ] redmi-17
- [ ] redmi-note-15
- [ ] redmi-note-15-pro
- [ ] redmi-note-15-pro-plus
- [ ] poco-x7-pro
- [ ] poco-x8-pro

**Tablets**
- [ ] ipad-a16
- [ ] ipad-pro-m5
- [ ] galaxy-tab-a11
- [ ] galaxy-tab-s10-lite
- [ ] galaxy-tab-s10-fe
- [ ] galaxy-tab-s10-fe-plus
- [ ] galaxy-tab-s11-ultra

**Laptops**
- [ ] macbook-neo
- [ ] macbook-pro-m5
- [ ] macbook-pro-m5-pro

**Smartwatches**
- [ ] apple-watch-s11
- [ ] apple-watch-se-3

**Consolas**
- [ ] nintendo-switch-2
- [ ] playstation-5-digital-slim
- [ ] playstation-5-standard-slim
- [ ] playstation-5-pro
- [ ] playstation-vr2
- [ ] xbox-series-s
- [ ] xbox-series-x

**Audio**
- [ ] airpods-4
- [ ] airpods-pro-3
- [ ] airpods-max-2

**Accesorios**
- [ ] apple-pencil
- [ ] cable-original
- [ ] cargador-20w-original
- [ ] cargador-40w-dynamic
- [ ] joystick-ps5
- [ ] cargador-samsung-25w
