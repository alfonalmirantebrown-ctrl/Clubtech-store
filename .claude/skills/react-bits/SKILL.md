---
name: react-bits
description: Catálogo de React Bits (reactbits.dev) — componentes animados open source (text animations, backgrounds, animations, micro-interacciones) en JS/TS + CSS/Tailwind. Usar para buscar un efecto ya resuelto (texto que se revela, fondos con partículas, cursor, magnet, etc.) antes de escribirlo de cero.
---

# React Bits

Catálogo completo para agentes en `references/llms.txt` (nombre, qué hace y el identificador CLI de cada componente). Licencia en `references/LICENSE.md`: MIT + Commons Clause → se puede usar en sitios comerciales; NO se pueden revender los componentes en sí.

## Cómo usarlo acá

1. Buscar en `references/llms.txt` el efecto (ej: "Split Text", "Particles", "Magnet", "Noise").
2. Instalar la variante **TS + Tailwind** (`TS-TW`):
   `npx shadcn@latest add https://reactbits.dev/r/<Componente>-TS-TW`
   o `npx jsrepo@latest add https://reactbits.dev/r/<Componente>-TS-TW`
   - Si la red no llega a reactbits.dev (la sandbox cloud bloquea muchos hosts), escribir una versión propia inspirada en el efecto. No copiar código de memoria.
3. Revisar dependencias del componente (gsap, motion, three, ogl) antes de instalar.
4. **Adaptarlo a CLAUDE.md**: paleta negro/blanco/azules, tipografías del Combo 1, `transform/opacity`, `prefers-reduced-motion`. Un efecto de React Bits tal cual, sin adaptar, es justamente el "AI-feel" que no queremos: usarlos como punto de partida, no como producto final.
5. Nunca más de 1–2 efectos "wow" por pantalla.
