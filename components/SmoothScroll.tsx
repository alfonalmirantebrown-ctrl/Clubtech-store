'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { useFaseIntro } from '@/lib/intro';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const fase = useFaseIntro();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // syncTouch: false = en touch se usa el scroll nativo del teléfono (antes "smoothTouch")
    const lenis = new Lenis({ wheelMultiplier: 0.8, syncTouch: false, autoRaf: false });
    lenisRef.current = lenis;
    // un solo reloj para todo: Lenis avanza con el ticker de GSAP y le avisa a ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
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
    if (fase === 'terminada') ScrollTrigger.refresh();
  }, [fase]);

  return null;
}
