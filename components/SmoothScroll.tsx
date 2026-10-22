'use client';

import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { useFaseIntro } from '@/lib/intro';

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const fase = useFaseIntro();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // syncTouch: false = en touch se usa el scroll nativo del teléfono (antes "smoothTouch")
    const lenis = new Lenis({ wheelMultiplier: 0.8, syncTouch: false });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Mientras corre la intro no se scrollea
  useEffect(() => {
    const corriendo = fase === 'corriendo';
    document.documentElement.style.overflow = corriendo ? 'hidden' : '';
    if (corriendo) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [fase]);

  return null;
}
