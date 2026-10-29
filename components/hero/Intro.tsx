'use client';

import { cubicBezier, easeOut } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { setFaseIntro } from '@/lib/intro';

const VISTA = 'ct-intro-vista';

/*
  Reloj de la intro: cuenta solo el tiempo en que la página está viva.
  Si el navegador se traba (mala conexión, se está armando el 3D) o la pestaña queda en segundo plano,
  cada cuadro suma como máximo 50 ms: la intro se pausa y sigue desde donde estaba,
  en vez de "ponerse al día" y saltar al final.
*/
const MAX_PASO = 50;
function correr(ms: number, vivo: () => boolean, alAvanzar: (p: number) => void = () => {}) {
  return new Promise<void>((resolver) => {
    let t = 0;
    let previo: number | null = null;
    const paso = (ahora: number) => {
      if (!vivo()) return resolver();
      if (previo !== null) t += Math.min(ahora - previo, MAX_PASO);
      previo = ahora;
      const p = ms > 0 ? Math.min(1, t / ms) : 1;
      alAvanzar(p);
      if (p < 1) requestAnimationFrame(paso);
      else resolver();
    };
    requestAnimationFrame(paso);
  });
}
const mezclar = (a: number, b: number, k: number) => a + (b - a) * k;

/*
  Intro cinematográfica, 4 fases (ver CLAUDE.md):
  1 · 0-4s  type-on "CLUBTECH" con error humano (CLUBH → borra → CLUBTECH)
  (los tiempos son de una conexión normal: cada fase arranca cuando termina la anterior, no por reloj)
  2 · 4-6s  aparece el isotipo de Clubtech y hace zoom 1 → 3.5 (leve, a pedido de Joaquín)
  3 · 6-7s  zoom out 3.5 → 1 y viaja a la nav: es el mismo isotipo que queda ahí, a 32px
  4 · fin   se desmonta; queda el hero con CLUBTECH flotante
  Se ve una vez por sesión: si volvés a la home navegando, no se repite.
*/
export default function Intro() {
  const scope = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState<0 | 1 | 2 | 3 | 4>(0);
  // se resuelve cuando el tipeo de CLUBTECH llega al final (aunque la página se haya trabado en el medio)
  const finTipeo = useRef<() => void>(() => {});

  useEffect(() => {
    let vista = false;
    try {
      vista = sessionStorage.getItem(VISTA) === '1';
    } catch {}
    const reducida = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (vista || reducida) {
      setFase(4);
      setFaseIntro('terminada');
      return;
    }
    window.scrollTo(0, 0);
    setFaseIntro('corriendo');
    setFase(1);

    let cancelado = false;
    const vivo = () => !cancelado;
    const tipeado = new Promise<void>((r) => (finTipeo.current = r));

    (async () => {
      // fase 1: el tipeo marca el ritmo; después, la pausa con el cursor titilando
      await tipeado;
      await correr(1350, vivo);
      if (cancelado || !scope.current) return;
      setFase(2);
      const logo = scope.current.querySelector<HTMLElement>('[data-logo]')!;
      const fondo = scope.current.querySelector<HTMLElement>('[data-fondo]')!;
      const e = { x: 0, y: 0, s: 1 };
      const pintar = () => (logo.style.transform = `translate(${e.x}px, ${e.y}px) scale(${e.s})`);

      // aparece
      await correr(450, vivo, (p) => (logo.style.opacity = String(easeOut(p))));
      logo.style.willChange = 'transform';
      // zoom in leve
      const entra = cubicBezier(0.7, 0, 0.84, 0);
      await correr(1550, vivo, (p) => ((e.s = mezclar(1, 3.5, entra(p))), pintar()));
      if (cancelado) return;

      setFase(3);
      const sale = cubicBezier(0.16, 1, 0.3, 1);
      await correr(500, vivo, (p) => ((e.s = mezclar(3.5, 1, sale(p))), pintar()));

      // Viaje hasta el hueco del isotipo en la nav
      const slot = document.getElementById('nav-isotipo-slot')?.getBoundingClientRect();
      const r = logo.getBoundingClientRect();
      const destino = slot
        ? {
            x: slot.left + slot.width / 2 - (r.left + r.width / 2),
            y: slot.top + slot.height / 2 - (r.top + r.height / 2),
            s: slot.height / r.height,
          }
        : { x: 0, y: 0, s: 0.1 };
      const viaje = cubicBezier(0.65, 0, 0.35, 1);
      // es el mismo logo que vive en la nav: llega a su lugar y la nav lo toma sin corte
      await correr(550, vivo, (p) => {
        fondo.style.opacity = String(1 - Math.min(1, (p * 550) / 500));
        const k = viaje(p);
        e.x = mezclar(0, destino.x, k);
        e.y = mezclar(0, destino.y, k);
        e.s = mezclar(1, destino.s, k);
        pintar();
      });
      if (cancelado) return;
      logo.style.willChange = '';

      try {
        sessionStorage.setItem(VISTA, '1');
      } catch {}
      setFaseIntro('terminada');
      setFase(4);
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  if (fase === 4) return null;

  return (
    <div ref={scope} className="intro fixed inset-0 z-[55] overflow-hidden" aria-hidden>
      <div data-fondo className="absolute inset-0 bg-black" />

      {fase === 1 && (
        <div className="absolute inset-0 grid place-items-center px-5">
          <TypeAnimation
            sequence={[400, 'CLUBH', 380, 'CLUB', 260, 'CLUBTECH', () => finTipeo.current()]}
            speed={{ type: 'keyStrokeDelayInMs', value: 165 }}
            deletionSpeed={{ type: 'keyStrokeDelayInMs', value: 110 }}
            cursor
            wrapper="span"
            className="font-display text-[clamp(36px,9vw,120px)] font-extrabold tracking-[-0.03em] text-white"
          />
        </div>
      )}

      <div className="absolute inset-0 grid place-items-center">
        <div data-logo style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-isotipo.png" alt="" className="block h-auto w-[min(34vmin,240px)]" />
        </div>
      </div>

      {/* sin JS no hay intro */}
      <noscript>
        <style>{'.intro{display:none}'}</style>
      </noscript>
    </div>
  );
}
