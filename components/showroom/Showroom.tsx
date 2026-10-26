'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import FloatingWord from '@/components/hero/FloatingWord';
import Intro from '@/components/hero/Intro';
import Glyph from '@/components/Glyph';
import { auraX, escena, type ColorPieza } from '@/lib/escena';
import { formatUSD } from '@/lib/format';
import { useFaseIntro } from '@/lib/intro';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// three.js pesa: se baja recién en el navegador y nunca bloquea el primer render
const Escena3D = dynamic(() => import('./Escena3D'), { ssr: false });

type Props = {
  pieza: { nombre: string; slug: string; colores: ColorPieza[]; desde: number | null };
};

const ACTOS = { color: [0.45, 0.8] as const };

function soportaWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Showroom({ pieza }: Props) {
  const raiz = useRef<HTMLElement>(null);
  const fase = useFaseIntro();
  const [mobile, setMobile] = useState(false);
  const [reducido, setReducido] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [activa, setActiva] = useState(true);
  const [color, setColor] = useState(0);

  useEffect(() => {
    escena.colores = pieza.colores;
    escena.p = 0;
    const mq = window.matchMedia('(max-width: 767px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMobile(mq.matches);
    setReducido(rm.matches);
    setWebgl(soportaWebGL());
    const onMq = () => setMobile(mq.matches);
    mq.addEventListener('change', onMq);

    // la atmósfera cambia con la hora real de Buenos Aires: de noche el aura está más encendida
    const h = Number(new Intl.DateTimeFormat('es-AR', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()));
    const noche = h >= 20 || h < 7;
    raiz.current?.style.setProperty('--aura', noche ? '1' : '0.72');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      escena.mx = (e.clientX / window.innerWidth) * 2 - 1;
      escena.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);

    // fuera de pantalla, la escena 3D se pausa (batería y ventiladores agradecen)
    const io = new IntersectionObserver(([e]) => setActiva(e.isIntersecting), { rootMargin: '100px' });
    if (raiz.current) io.observe(raiz.current);
    return () => {
      mq.removeEventListener('change', onMq);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, [pieza.colores]);

  useGSAP(
    () => {
      if (reducido) return;
      const root = raiz.current!;
      const ancho3d = () => 2 * 5 * Math.tan((15 * Math.PI) / 180) * (window.innerWidth / window.innerHeight);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            escena.p = p;
            root.style.setProperty('--ax', `${auraX(p, mobile, ancho3d())}%`);
            const [a, b] = ACTOS.color;
            const n = pieza.colores.length || 1;
            const i = Math.min(n - 1, Math.max(0, Math.floor(((p - a) / (b - a)) * n)));
            if (i !== escena.color) {
              escena.color = i;
              setColor(i);
            }
          },
        },
      });

      // la duración total del timeline es 1 = todo el recorrido del showroom
      tl.set({}, {}, 1)
        .to('[data-acto="0"]', { autoAlpha: 0, y: -40, duration: 0.08 }, 0.1)
        .to('[data-palabra]', { opacity: 0, scale: 0.96, duration: 0.12 }, 0.01)
        .fromTo('[data-acto="1"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.2)
        .to('[data-acto="1"]', { autoAlpha: 0, y: -40, duration: 0.05 }, 0.38)
        .fromTo('[data-acto="2"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.46)
        .to('[data-acto="2"]', { autoAlpha: 0, y: -40, duration: 0.04 }, 0.79)
        .fromTo('[data-acto="3"]', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.84);
    },
    { scope: raiz, dependencies: [reducido, mobile, pieza.colores] },
  );

  const c = pieza.colores[color];
  // la escena 3D se monta enseguida, también durante la intro (queda tapada y quieta):
  // así, cuando la intro termina o si no hay intro, el celular ya está listo
  const mostrar3D = webgl;
  const revelada = fase === 'terminada';
  // el giro de entrada solo tiene sentido como remate de la intro; sin intro, el celular ya está en su lugar
  const huboIntro = useRef(false);
  if (fase === 'corriendo') huboIntro.current = true;

  return (
    <section
      ref={raiz}
      aria-label="Showroom"
      className="relative bg-black"
      style={{ height: reducido ? '100svh' : '520svh', ['--ax' as string]: mobile ? '50%' : '70%' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Intro />

        {/* resplandor detrás del celular: luz tenue, blanca y plateada, como humo iluminado */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: 'var(--aura, 1)' }}>
          <div
            className="aura-humo absolute top-1/2 aspect-[4/5] w-[95vmin] -translate-x-1/2 -translate-y-1/2"
            style={{ left: 'var(--ax)', transition: 'left 0.8s cubic-bezier(0.22,1,0.36,1)' }}
          />
          <div
            className="aura-destello absolute top-1/2 aspect-square w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: 'var(--ax)', transition: 'left 0.8s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </div>

        {/* la palabra gigante: al llegar, el celular aparece DETRÁS de ella; al bajar, se desvanece y lo deja pasar */}
        <div data-palabra className="absolute inset-x-0 bottom-[20%] z-10 px-5 md:bottom-[16%] md:px-8">
          <div className="mx-auto max-w-[1600px]">
            <FloatingWord className="-ml-[0.04em] whitespace-nowrap text-[12.6vw] md:text-[clamp(56px,13.2vw,206px)]" />
          </div>
        </div>

        {/* la pieza */}
        {mostrar3D ? (
          <Escena3D mobile={mobile} activa={activa && revelada} entrada={huboIntro.current} />
        ) : (
          !webgl && (
            <div className="absolute top-1/2 w-[40vmin] -translate-x-1/2 -translate-y-1/2" style={{ left: 'var(--ax)' }}>
              <Glyph categoria="celulares" className="float-glyph h-auto w-full" />
            </div>
          )
        )}

        {/* ACTO 0 · llegada */}
        <div data-acto="0" className="pointer-events-none absolute inset-0 z-20 px-5 pt-24 md:px-8 md:pt-28">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col">
            <div className="flex items-start justify-between gap-6">
              <p className="max-w-[17ch] font-sans font-light text-[24px] leading-[1.05] text-off-white md:text-[34px]">
                Lo último en celulares, tablets y consolas. Precio en dólares.
              </p>
            </div>

          </div>
        </div>

        {!reducido && (
          <>
            {/* ACTO I · mirala de cerca */}
            <div data-acto="1" className="invisible absolute inset-0 z-20 flex items-end px-5 pb-16 md:items-center md:justify-start md:px-8 md:pb-0">
              <div className="max-w-[460px] md:ml-[2vw]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-glow">01 — Cámara</p>
                <h2 className="mt-3 font-display text-[clamp(40px,5.4vw,84px)] font-extrabold uppercase leading-[0.84] tracking-[-0.03em] text-white">
                  Mirala
                  <span className="block font-sans font-light text-[0.62em] font-normal normal-case tracking-[-0.01em] text-off-white">de cerca.</span>
                </h2>
              </div>
            </div>

            {/* ACTO II · el color */}
            <div data-acto="2" className="invisible absolute inset-0 z-20 flex items-end justify-end px-5 pb-16 text-right md:items-center md:px-8 md:pb-0">
              <div className="max-w-[640px] md:mr-[2vw]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-grey-dim">
                  02 — Color
                </p>
                <h2
                  key={c?.color}
                  className="color-entra mt-3 font-display text-[clamp(44px,7vw,120px)] font-extrabold uppercase leading-[0.82] tracking-[-0.03em]"
                  style={{ color: c?.hex ?? '#fff', textShadow: `0 0 80px ${c?.hex ?? '#fff'}55` }}
                >
                  {c?.color}
                </h2>
                <p className="mt-4 font-sans font-light text-[26px] text-off-white md:text-[34px]">El color lo elegís vos.</p>
                <div className="mt-6 flex items-center justify-end gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim">
                  <span className="flex gap-2">
                    {pieza.colores.map((x, i) => (
                      <span
                        key={x.color}
                        className="h-3 w-3 rounded-full border transition-transform duration-300"
                        style={{ background: x.hex, borderColor: i === color ? '#fff' : 'transparent', transform: i === color ? 'scale(1.35)' : 'none' }}
                      />
                    ))}
                  </span>
                  <span>
                    {pieza.nombre} · desde {formatUSD(c?.desde ?? pieza.desde)}
                  </span>
                </div>
              </div>
            </div>

            {/* 03 · pase al catálogo */}
            <div data-acto="3" className="invisible absolute inset-0 z-20 flex items-center px-5 md:px-8">
              <div className="mx-auto w-full max-w-[1600px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-glow">03 — Catálogo</p>
                <h2 className="mt-4 max-w-[14ch] font-display text-[clamp(36px,5.4vw,92px)] font-extrabold uppercase leading-[0.86] tracking-[-0.03em] text-white">
                  No solo celulares.
                </h2>
                <p className="mt-6 max-w-[34ch] font-sans font-light text-[24px] leading-[1.15] text-off-white md:text-[32px]">
                  Tablets, laptops, relojes, consolas, audio y accesorios. Si algo te gusta, <span className="text-blue-glow">escribinos.</span>
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
