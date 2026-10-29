# CLAUDE.md · Clubtech Store

Este archivo lo lee Claude Code automáticamente al abrir el proyecto. Contiene todo el contexto que necesita para no preguntar lo mismo cada vez.

## El proyecto

Clubtech Store es un e-commerce premium de tecnología para Argentina. Venden celulares, tablets, laptops, smartwatches, consolas, audio y accesorios. Público: compradores argentinos de tech que valoran lo premium.

**Target emocional:** que al entrar al sitio, el usuario sienta que compra tecnología en un showroom, no en MercadoLibre.

## Decisiones estéticas tomadas (NO negociar)

- Minimalismo radical. Pocos colores, mucho contraste, mucho vacío. Nada de clutter.
- Dark cinematográfico inspirado en @ubernatural.io (Dubai, Awwwards winners).
- Paleta: solo negro + blanco + variaciones de azul tech por zonas.
- Referencias concretas: ubernatural.io, basement.studio, rauno.me, linear.app.
- NO queremos ningún AI-feel. Ver sección "Lo que NO hacemos" al final.

## Stack técnico

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Framer Motion (animaciones)
- Lenis (smooth scroll)
- GSAP (type-on del hero)
- @supabase/supabase-js (DB + storage)
- react-type-animation (type-on con error humano)
- Zustand (estado global)
- Deploy: Vercel conectado a GitHub

## Paleta de colores (CSS variables en `/app/globals.css`)

```css
:root {
  /* BASE */
  --black: #000000;
  --white: #FFFFFF;
  --off-white: #F2F2F2;
  --grey-dim: #666666;
  --line: rgba(255,255,255,0.08);

  /* ZONAS AZULES (atmósferas por sección) */
  --blue-void: #000818;  /* azul noche profundo (zonas quietas) */
  --blue-deep: #001E52;  /* azul profundo (zonas de énfasis) */
  --blue-tech: #0040F0;  /* azul eléctrico primary (acento del logo) */
  --blue-glow: #1E7FFF;  /* glow / hovers interactivos */
  --blue-ice:  #A8D4FF;  /* highlights sutiles */
}
```

### Cómo aplicar los azules por zona

| Zona | Fondo | Acento |
|---|---|---|
| Hero home | `--black` | `--blue-tech` (en "STORE" + CTAs) |
| Vestíbulo (nivel 1) | `--black` | `--blue-glow` (hover de cards) |
| Celulares (nivel 2) | `--blue-void` | `--blue-glow` |
| Tablets | `--black` | `--blue-ice` |
| Laptops | `--blue-deep` | `--white` |
| Consolas | `--black` | `--blue-tech` |
| Vitrina producto | `--black` + glow sutil | `--blue-glow` |
| Nav bar | `--black` 95% + blur | `--blue-tech` (hover) |

## Tipografía

**DECIDIDO (Joaquín eligió A + D del muestrario):**

- Display (titulares, CLUBTECH, categorías, marcas, modelos, precio): **Unbounded**, clase `font-display`. Es muy ancha: los tamaños de titulares están calculados para ella (ej. CLUBTECH del hero `13.2vw` desktop / `12.6vw` mobile). Si se agrega un titular nuevo, probar que no desborde.
- Texto y frases destacadas: **Geist** (paquete `geist`), clase `font-sans`. Las frases que antes iban en serif itálica ahora son Geist `font-light`, sin cursiva.
- Etiquetas técnicas: **Geist Mono** (paquete `geist`), clase `font-mono`.
- Descartadas: Combo 1 (Bricolage + Mona Sans + Instrument Serif), Big Shoulders, Archivo Expanded. NO usar Space Grotesk + Fraunces.

## Supabase

- Project: `wfazriudzybknzcjplob` (región sa-east-1)
- URL: https://wfazriudzybknzcjplob.supabase.co
- Credenciales: en `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`). `.env.local` está en `.gitignore`: nunca commitearlo.

### Schema (YA creado, solo consultar)

- `categorias` (7): id, slug, nombre, descripcion, orden, hero_product_slug
- `marcas` (7): id, slug, nombre, color_hex, grad_from, grad_via, grad_to, glow, logo_label
- `productos` (61): id, slug, nombre, marca_id, categoria_id, tagline, descripcion, destacado, hero_producto, orden, image_url
- `variantes` (133): id, producto_id, memoria, color, color_hex, stock, precio_usd

Row Level Security activado con lectura pública. Solo select queries.

### Storage buckets

- `productos` (público) → fotos de productos cuando se suban
- `brand` (público) → logo tipográfico + isotipo

### Categorías disponibles

celulares, tablets, laptops, smartwatches, consolas, audio, accesorios

### Marcas disponibles

apple, samsung, xiaomi, motorola, sony (PlayStation), nintendo, microsoft (Xbox)

## Estructura del sitio (4 niveles + hero)

### Hero home · Intro cinematográfica (al cargar)

4 fases obligatorias sin skip:

- **Fase 1 (0-4s):** type-on "CLUBTECH" con error humano (tipea CLUBH, borra H, sigue CLUBTECH). Font display 160px desktop.
- **Fase 2 (4-6s):** aparece el **isotipo** de Clubtech (`/public/brand/logo-isotipo.png`), zoom in leve de scale 1 → 3.5 (antes 8; Joaquín lo quiso más sutil). (Decisión de Joaquín: el zoom se hace con el isotipo, no con el nombre.)
- **Fase 3 (6-7s):** zoom out scale 3.5 → 1 y el mismo isotipo viaja a la nav, donde queda a 32px (transición continua, sin fundido).
- **Fase 4 (permanente):** "CLUBTECH" flotante en hero home, cada letra con loop sutil translateY ±3px asíncrono. Debajo: "— TU PRÓXIMA PIEZA DE TECNOLOGÍA EMPIEZA ACÁ" en mono, con "STORE · ARGENTINA" + "STORE" en `--blue-tech`.

### Micro-interacción pendiente: Glitch RGB sutil

En CLUBTECH flotante, al hover:

- RGB chromatic aberration sutil (3 copias superpuestas: blanca + roja offset -1px + cyan offset +1px)
- En hover el offset se intensifica a -3px/+3px con loop keyframe 400ms
- Nunca distorsionar las letras (no clip-path, no scramble)
- Debe sentirse ELEGANTE, no caótico
- Respetar `prefers-reduced-motion`

### Showroom nocturno (home, debajo de la intro) — concepto vigente

Narrativa scroll de 5 actos dentro de un escenario fijo (`components/showroom/`), inspirada en la skill `ubernatural-style`:

- **Pieza central 3D** (`Escena3D.tsx`): modelo 3D real del iPhone 17 Pro (ver abajo), con pantalla de bloqueo que muestra la hora real de Buenos Aires. Estudio de luces con `Lightformer` (sin HDR externo). Polvo en el aire que se junta donde está el mouse.
- **Luz detrás del celular**: resplandor tenue blanco/plateado tipo humo (`.aura-humo` + `.aura-destello`), sin rayos ni líneas (decisión de Joaquín); más intenso de noche (hora real de BA).
- **NO usar lenguaje de museo en la web** (decisión de Joaquín): nada de "salas", "piezas", "exhibición", "vitrina", "vestíbulo" ni datos tipo "Salas 07 / Piezas 61 / Moneda USD" de cara al visitante. Los nombres internos del código (Vestibulo, Estante, Vitrina) pueden quedar.
- **01** · llegada: frase "Lo último en celulares, tablets y consolas. Precio en dólares." y CLUBTECH gigante. Nada más.
- **Sin elementos decorativos alrededor** (decisión de Joaquín): sacados "Store · Argentina", "— Tu próxima pieza de tecnología empieza acá", reloj "BUE", botón de sonido, indicador "Scroll", etiqueta "Destacado" y la ubicación en la nav. La nav es solo isotipo + WhatsApp. No volver a agregarlos. En la home el botón de WhatsApp de la nav no aparece en la intro ni durante el scroll del celular: recién cuando llegás al catálogo (`#vestibulo`); en las otras páginas está siempre (decisión de Joaquín).
- Al llegar, el celular aparece **detrás** de CLUBTECH (palabra `z-10`, canvas debajo). Apenas se empieza a scrollear, CLUBTECH se desvanece del todo y el celular queda adelante.
- **Sin texto de relleno** (decisión de Joaquín): nada de contadores ("04 modelos", "3 marcas", "01 / 03", "Color 02/05") ni frases poéticas (las `descripcion` de categorías no se muestran; quedan solo como meta description). Mantener lo simple; si hay dudas, sacar de a poco.
- **Los textos de cada momento se alternan de lado** (decisión de Joaquín): 01 izquierda → 02 derecha → 03 izquierda; el celular siempre se ubica del lado contrario (`pose` en `lib/escena.ts`).
- **01 — Cámara** · "Mirala de cerca": el celular gira y muestra la cámara.
- **02 — Color** · "El color lo elegís vos": recorre los colores reales del producto (de `variantes`).
- **03 — Catálogo** · "No solo celulares.": pase al catálogo de categorías.
- **Modelo 3D real** del hero: `public/models/celular.glb` = «iPhone 17 Pro» de **Ranguel** (Sketchfab), licencia **CC BY 4.0** → el crédito en el footer es obligatorio, no sacarlo. Joaquín lo subió como `.usdz` (23,5 MB); se convirtió con `scripts/usdz-a-glb.py` y se optimizó con gltf-transform (WebP 1024 + meshopt) a 2,2 MB. Se carga con `useGLTF(..., false, true)` (meshopt, sin Draco).
- En `Escena3D.tsx` el modelo se tiñe por nombre de material: `Anodized_aluminum` (cuerpo, color de la variante), `Frosted_glass` (panel trasero, el mismo color 30% más claro; en colores oscuros como el Deep Blue casi igual al cuerpo, como el real). Colores corregidos a mano (la base es de solo lectura): `COLOR_REAL` en `lib/catalogo.ts` (ej. iPhone 17 Pro Blue = `#47537D`, el Deep Blue oficial de Apple). La pantalla es el material `OLED`: se le pone la textura con la hora de BA, espejada porque la pantalla del modelo mira hacia adentro. Los productos a la venta siguen siendo fotos 2D.
- Después: Vestíbulo y **Cierre** ("Sin carrito. Sin formulario. Un mensaje y listo." + botón magnético a WhatsApp).
- Coreografía del celular según el scroll: `lib/escena.ts` (`pose`). Scroll: GSAP ScrollTrigger + Lenis en el mismo ticker (`components/SmoothScroll.tsx`).
- Fallbacks: sin WebGL → dibujo de línea; `prefers-reduced-motion` → solo el acto 0, sin scroll narrativo.
- **Carga del celular 3D (que esté desde que entrás, pedido de Joaquín):** `app/page.tsx` precarga `celular.glb` junto con el HTML; la escena se monta enseguida, también detrás de la intro, quieta (`frameloop` en `never`) hasta que la intro termina; `<Preload all />` compila los shaders apenas llega el modelo. El giro de entrada (1,6 s) solo se hace después de la intro; en visitas sin intro el celular ya está en su lugar. `next.config.mjs` cachea `/models/*` una semana: si se reemplaza el modelo, **cambiarle el nombre al archivo**.

### Nivel 1 · El Vestíbulo (`/`)

Grid asimétrico de 7 cards grandes, una por categoría. Cada card:

- Nombre categoría en display bold uppercase
- Producto hero flotando (foto o SVG fallback)
- Contador de productos en mono
- Hover: card crece 1.02x, border se ilumina `--blue-glow`

Grid NO uniforme: Celulares más grande, 2 cards segunda fila, 3 tercera fila.

### Nivel 2 · La Sala de Marcas (`/catalogo/[categoria]`)

Galería horizontal de marcas con productos en esa categoría. Cada card de marca con atmósfera distinta según zona.

### Nivel 3 · El Estante (`/catalogo/[categoria]/[marca]`)

Grilla densa 3 columnas desktop / 2 mobile. Cards con foto + nombre + precio menor variante. Filtros chip arriba: memoria, color, precio.

### Nivel 4 · La Vitrina del Producto (`/producto/[slug]`)

Fullscreen cinematográfico. Texto editorial izquierda, producto derecha con tilt 3D al mouse (CSS perspective + rotateY/rotateX ±5-8deg). Selector de variantes (memoria + color pills). CTA primary: "Comprar por WhatsApp" (abre WhatsApp con mensaje precargado).

## Reglas de código

### Siempre

- Server Components por default (reducir JS bundle)
- `next/image` con `priority` solo en producto hero visible
- Lazy loading con Intersection Observer para secciones no visibles
- Animaciones solo con `transform` y `opacity` (nunca top, margin, padding)
- `will-change` solo durante animaciones, removerlo al terminar
- Lenis con `wheelMultiplier: 0.8`, `smoothTouch: false`
- Mobile-first responsive
- Keyboard navigation (arrows ← → donde aplica)
- `prefers-reduced-motion` respetado

### Nunca

- Iconos de Lucide/Heroicons/Feather (son firma AI). Usar SVG custom cuando se necesite ícono.
- `rounded-lg` o border-radius uniforme en TODO. Variar o eliminar.
- Gradients tipo "purple → blue" o "from-cyan-500 to-blue-500".
- Imágenes stock de Unsplash obvias (mujer con laptop, escritorio con planta).
- Copy genérico "Transform your business" / "Empower your team".
- fade-in on scroll genérico en todo (es cliché AI).
- Nav bar fija translúcida con backdrop-blur igual a todas las webs AI.
- Tipografía Space Grotesk + Fraunces (pairing AI-default).

## Lo que NO hacemos (anti-AI-made)

Antes de dar algo por terminado, pasar la checklist:

- [ ] ¿Tiene un elemento que NO vi en otro sitio?
- [ ] ¿La paleta NO es cream+terracotta ni dark+green ni purple+blue?
- [ ] ¿La tipografía NO es solo Inter o Space Grotesk?
- [ ] ¿Hay algo asimétrico intencional?
- [ ] ¿Hay fotos reales del cliente, no stock?
- [ ] ¿El copy tiene jerga/voz específica del rubro?
- [ ] ¿Hay al menos 1 micro-interacción que haga sonreír?
- [ ] ¿El border-radius NO es el mismo en todos los elementos?
- [ ] ¿Hay algún "easter egg" descubrible?
- [ ] ¿Qué pensaría ubernatural si lo viera?

Si no cumple 7/10, iterar antes de deploy.

## Deploy

- Repo en GitHub: `alfonalmirantebrown-ctrl/clubtech-store`
- Vercel (plan Hobby, equipo `888-estudio`): proyecto `clubtech-store` (`prj_LrMoSloHVwYMek6FEl67EoBzkDJ1`)
- Preview online: https://clubtech-store.vercel.app
- Deploy automático en cada push a la rama de producción, hoy `claude/clubtech-store-setup-h0f3o3` (la principal del repo; no existe `main` todavía)
- Variables cargadas en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Falta `NEXT_PUBLIC_WHATSAPP_NUMBER` (al cargarla hay que redeployar)
- Antes de vender: pasar a plan Pro o a la cuenta de Vercel del cliente (Hobby no permite uso comercial)
- Dominio final: clubtech.ar (pendiente de configurar en Vercel)

## Skills instaladas (`.claude/skills/`)

Copiadas de estos repos (ver `.claude/skills/SOURCES.md`):

- **vercel-labs/skills** → `find-skills` (buscar e instalar más skills)
- **emilkowalski/skills** → animación y design engineering: `animate`, `improve-animations`, `review-animations`, `animation-performance`, `animation-vocabulary`, `find-animation-opportunities`, `emil-design-eng`, `apple-design`, `break-ui`, `prototype`, `pick-ui-library`, etc. Usarlas para el hero, el glitch RGB y las micro-interacciones.
- **JuliusBrussee/caveman** → modo respuestas cortas (`/caveman`, se apaga con "stop caveman") y flujos de trabajo: `investigate-first`, `surgical-patch`, `safe-refactor`, `verify-and-stop`, `lean-build`, etc.

- **vercel/next.js** → skills oficiales de Next.js: `next-dev-loop`, `next-bundle-optimizer`, `next-cache-components-*`, `next-partial-prefetching-*`. Ojo: las de cache components y partial prefetching son para Next 15/16; con Next 14 no aplican hasta que actualicemos.
- **nextlevelbuilder/ui-ux-pro-max-skill** → `ui-ux-pro-max` (base de estilos, paletas, tipografías y reglas UX), `design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides`. Sus sugerencias NO pisan las decisiones estéticas de este archivo: si proponen otra paleta, tipografía, shadcn/ui, íconos Lucide o fotos stock (Pexels), gana CLAUDE.md.

- **gsap**, **lenis**, **react-bits** → escritas a partir de la documentación oficial de cada repo (ninguno trae `SKILL.md`). React Bits: reactbits.dev no es accesible desde la sandbox; los efectos se escriben a mano inspirados en el catálogo (`references/llms.txt`).
- **ubernatural-style** → la musa creativa (también está guardada en la cuenta de Claude de Joaquín, para cualquier proyecto).

Nota: aunque caveman esté activo, las explicaciones a Joaquín siguen siendo en castellano claro (ver abajo).

## Notas de implementación

- Datos: `lib/catalogo.ts` trae las 4 tablas de una vez (cache 10 min) y arma las relaciones en código.
- En las variantes, `"Default"` en memoria/color significa "no aplica" y no se muestra como opción.
- Categorías con una sola marca (laptops, smartwatches, audio) saltan directo del Vestíbulo al Estante.
- La intro del hero se ve una vez por sesión del navegador; con `prefers-reduced-motion` se saltea.
- Fotos (`lib/fotos.ts`, guía completa en `FOTOS.md`): prioridad `productos.image_url` > archivo en `public/productos/{slug}.png|jpg|webp` > foto de MUESTRA (Wikimedia, badge "Muestra") > espacio vacío "Foto en camino". Categorías: `public/categorias/{slug}.jpg` (si no hay, usa la foto del producto héroe). `scripts/fotos-manifest.mjs` corre solo en `prebuild`/`predev` y arma `lib/fotos-locales.json`: alcanza con subir el archivo al repo. Productos se muestran con `object-contain` (enteros), categorías y muestras con `object-cover`.
- Fotos ideales del cliente: PNG o JPG de al menos 1600px de alto, producto solo, fondo negro o transparente, mismo ángulo en todos los modelos, nombradas con el slug del producto (ej: `iphone-17-pro.png`).
- Supabase pausa el proyecto gratis si no se usa: si el sitio no trae datos, revisar que esté activo.

## Pendientes

- [x] Setup inicial del proyecto
- [x] Hero cinematográfico (4 fases)
- [x] Glitch RGB en CLUBTECH flotante
- [x] Nivel 1 Vestíbulo con 7 cards
- [x] Nivel 2 Sala de Marcas
- [x] Nivel 3 Estante
- [x] Nivel 4 Vitrina del Producto
- [x] SVG fallbacks por categoría (mientras no hay fotos)
- [x] Decidir tipografía final (Unbounded + Geist + Geist Mono)
- [x] Micro-interacciones custom (showroom 3D, polvo que sigue al mouse, botón magnético, sonido ambiente)
- [x] Easter egg (tipear "clubh" en cualquier página)
- [x] Sistema de fotos por archivo (`public/productos`, `public/categorias`, ver `FOTOS.md`)
- [x] Fotos oficiales de las marcas en `public/productos/` (59 de 61, `.webp` transparente; ver `FOTOS.md`)
- [ ] Fotos que faltan: `moto-g57` y `moto-g06-power` (sin foto oficial publicada) + 7 de categorías
- [x] Compra por WhatsApp (CTA primary)
- [ ] Cargar `NEXT_PUBLIC_WHATSAPP_NUMBER` (número de Clubtech) en `.env.local` y en Vercel
- [x] Isotipo: `public/brand/logo-isotipo.jpeg` (original de Joaquín) → `logo-isotipo.png` con fondo transparente (es el que usa la web)
- [ ] Testing en mobile real
- [ ] Lighthouse Performance 90+
- [x] Deploy a Vercel (preview en clubtech-store.vercel.app)
- [ ] Conectar dominio clubtech.ar

## Contexto del dueño

- Nombre: Joaquín
- Studio: 888 Studio (hace webs premium a pymes LATAM)
- Clubtech es su cliente, no su propio negocio
- Trabaja desde ChromeOS (limitado para dev local)
- Prefiere trabajar en Claude Code dentro de la app desktop (sandbox cloud)
- No es dev profundo → explicar errores en castellano claro, no asumir conocimiento técnico
- Rioplatense cercano → tono amable pero directo, no formal
- Si algo no se puede implementar, decir CLARO qué y por qué, no asumir que lo entiende por default.
