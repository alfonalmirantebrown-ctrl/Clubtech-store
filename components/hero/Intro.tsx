'use client';

import { useAnimate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { setFaseIntro } from '@/lib/intro';
import { LogoTipografico } from '../Logo';

const VISTA = 'ct-intro-vista';
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
  Intro cinematográfica, 4 fases (ver CLAUDE.md):
  1 · 0-4s  type-on "CLUBTECH" con error humano (CLUBH → borra → CLUBTECH)
  2 · 4-6s  aparece el logo tipográfico y hace zoom 1 → 8
  3 · 6-7s  zoom out 8 → 1 y viaja a la nav, donde queda el isotipo de 32px
  4 · fin   se desmonta; queda el hero con CLUBTECH flotante
  Se ve una vez por sesión: si volvés a la home navegando, no se repite.
*/
export default function Intro() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [fase, setFase] = useState<0 | 1 | 2 | 3 | 4>(0);

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
    (async () => {
      await espera(4000);
      if (cancelado) return;
      setFase(2);
      const logo = scope.current.querySelector<HTMLElement>('[data-logo]')!;
      const fondo = scope.current.querySelector<HTMLElement>('[data-fondo]')!;

      await animate(logo, { opacity: [0, 1], scale: 1 }, { duration: 0.45, ease: 'easeOut' });
      logo.style.willChange = 'transform';
      await animate(logo, { scale: 8 }, { duration: 1.55, ease: [0.7, 0, 0.84, 0] });
      if (cancelado) return;

      setFase(3);
      await animate(logo, { scale: 1 }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });

      // Viaje hasta el hueco del isotipo en la nav
      const slot = document.getElementById('nav-isotipo-slot')?.getBoundingClientRect();
      const r = logo.getBoundingClientRect();
      const destino = slot
        ? {
            x: slot.left + slot.width / 2 - (r.left + r.width / 2),
            y: slot.top + slot.height / 2 - (r.top + r.height / 2),
            scale: slot.height / r.height,
          }
        : { x: 0, y: 0, scale: 0.1 };
      animate(fondo, { opacity: 0 }, { duration: 0.5 });
      await animate(logo, { ...destino, opacity: [1, 1, 0] }, { duration: 0.5, ease: [0.65, 0, 0.35, 1] });
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
  }, [animate, scope]);

  if (fase === 4) return null;

  return (
    <div ref={scope} className="intro fixed inset-0 z-[55] overflow-hidden" aria-hidden>
      <div data-fondo className="absolute inset-0 bg-black" />

      {fase === 1 && (
        <div className="absolute inset-0 grid place-items-center px-5">
          <TypeAnimation
            sequence={[400, 'CLUBH', 380, 'CLUB', 260, 'CLUBTECH']}
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
          <LogoTipografico />
        </div>
      </div>

      {/* sin JS no hay intro */}
      <noscript>
        <style>{'.intro{display:none}'}</style>
      </noscript>
    </div>
  );
}
