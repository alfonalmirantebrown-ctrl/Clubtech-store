---
name: gsap
description: Animación con GSAP (GreenSock) en React/Next.js — timelines, ScrollTrigger (scroll pinneado, scrub), SplitText, easing y limpieza con useGSAP/gsap.context. Usar cuando una animación necesita secuencia precisa, estar atada al scroll o animar texto letra por letra; para transiciones simples de UI alcanza Framer Motion.
---

# GSAP en este proyecto

Fuente: github.com/greensock/GSAP (README en `references/README.md`). GSAP es 100% gratis, incluidos todos los plugins (SplitText, ScrollTrigger, MorphSVG…), también para uso comercial.

## Reglas

1. **Registrar plugins una vez**, del lado cliente:
   ```ts
   'use client';
   import gsap from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   import { useGSAP } from '@gsap/react';
   gsap.registerPlugin(ScrollTrigger, useGSAP);
   ```
2. **Siempre `useGSAP(() => {...}, { scope: ref })`** (o `gsap.context` + `ctx.revert()`): limpia tweens y ScrollTriggers al desmontar. Nunca crear tweens sueltos en un `useEffect` sin revertirlos.
3. **Solo `transform` y `opacity`** (`x`, `y`, `scale`, `rotation`, `autoAlpha`). Nunca `top/left/width/margin`.
4. **Scroll narrativo**: un timeline con `scrollTrigger: { trigger, start: 'top top', end: '+=300%', scrub: 1, pin: true }`. `scrub: 1` suaviza; `pin` deja la escena fija mientras avanza la historia.
5. **Con Lenis**: conectar ambos (ver skill `lenis`): `lenis.on('scroll', ScrollTrigger.update)` y `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.
6. **Three.js / R3F**: GSAP puede animar objetos (`gsap.to(mesh.rotation, {...})`) o, mejor, un objeto "progreso" `{ p: 0 }` que el loop de R3F lee en `useFrame`. Así la escena 3D sigue al scroll sin re-render de React.
7. **prefers-reduced-motion**: `gsap.matchMedia()` con `(prefers-reduced-motion: no-preference)` para las animaciones y un estado final estático para el resto.
8. **Easing**: `power3.out` / `expo.out` para entradas; `none` en scrub (el scroll ya es la curva). Evitar `bounce`/`elastic` salvo humor intencional.
9. Después de cambios de layout (fuentes, imágenes): `ScrollTrigger.refresh()`.

## Paquetes
`npm i gsap @gsap/react`
