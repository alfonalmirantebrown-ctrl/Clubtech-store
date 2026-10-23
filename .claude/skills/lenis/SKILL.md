---
name: lenis
description: Smooth scroll con Lenis (darkroom.engineering) — setup en React/Next, integración con GSAP ScrollTrigger, scroll anidado (data-lenis-prevent), anclas, stop/start y reduced motion. Usar al tocar el scroll del sitio o sincronizar animaciones con él.
---

# Lenis en este proyecto

Fuente: github.com/darkroomengineering/lenis (README completo en `references/README.md`).

## Config del proyecto (CLAUDE.md)
`new Lenis({ wheelMultiplier: 0.8, syncTouch: false })` — `smoothTouch` ya no existe: es `syncTouch`. En touch se usa el scroll nativo.

## Reglas

- **Una sola instancia** global (hoy: `components/SmoothScroll.tsx`). Exponerla si otra parte la necesita; no crear otra.
- **CSS recomendado** (ya en `globals.css`): `html.lenis, html.lenis body { height: auto }`, `.lenis.lenis-stopped { overflow: hidden }`.
- **Con GSAP ScrollTrigger** — un solo loop, el de GSAP:
  ```ts
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  (con `autoRaf: false`, sin otro `requestAnimationFrame` propio).
- **Bloquear scroll** (intro, modales): `lenis.stop()` / `lenis.start()`.
- **Scroll interno** (galerías, modales con overflow): atributo `data-lenis-prevent` en el contenedor.
- **Anclas**: `lenis.scrollTo('#id', { offset: -56 })` (56 = alto de la nav).
- **Reduced motion**: no inicializar Lenis si `prefers-reduced-motion: reduce`.
