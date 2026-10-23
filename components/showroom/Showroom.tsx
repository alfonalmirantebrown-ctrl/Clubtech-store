'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
  numeros: { piezas: number; salas: number; marcas: number };
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

export default function Showroom({ pieza, numeros }: Props) {
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
      const nums = gsap.utils.toArray<HTMLElement>('[data-num]', root);

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
            // contadores del acto III: suben con el scroll
            const k = gsap.utils.clamp(0, 1, (p - 0.84) / 0.1);
            nums.forEach((el) => (el.textContent = String(Math.round(Number(el.dataset.num) * k)).padStart(2, '0')));
          },
        },
      });

      // la duración total del timeline es 1 = todo el recorrido del showroom
      tl.set({}, {}, 1)
        .to('[data-acto="0"]', { autoAlpha: 0, y: -40, duration: 0.08 }, 0.1)
        .to('[data-palabra]', { opacity: 0.07, scale: 0.94, duration: 0.12 }, 0.08)
        .fromTo('[data-acto="1"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.2)
        .to('[data-acto="1"]', { autoAlpha: 0, y: -40, duration: 0.05 }, 0.38)
        .fromTo('[data-acto="2"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.46)
        .to('[data-acto="2"]', { autoAlpha: 0, y: -40, duration: 0.04 }, 0.79)
        .to('[data-palabra]', { opacity: 0, duration: 0.05 }, 0.8)
        .fromTo('[data-acto="3"]', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.84);
    },
    { scope: raiz, dependencies: [reducido, mobile, pieza.colores] },
  );

  const c = pieza.colores[color];
  const mostrar3D = webgl && fase === 'terminada';

  return (
    <section
      ref={raiz}
      aria-label="Showroom"
      className="relative bg-black"
      style={{ height: reducido ? '100svh' : '520svh', ['--ax' as string]: mobile ? '50%' : '70%' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Intro />

        {/* aura: rayos de luz que salen de detrás de la pieza */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: 'var(--aura, 1)' }}>
          <div
            className="aura-rayos absolute top-1/2 aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2"
            style={{ left: 'var(--ax)', transition: 'left 0.6s cubic-bezier(0.22,1,0.36,1)' }}
          />
          <div
            className="absolute top-1/2 aspect-square w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: 'var(--ax)',
              transition: 'left 0.6s cubic-bezier(0.22,1,0.36,1)',
              background: 'radial-gradient(closest-side, rgba(30,127,255,0.45), rgba(0,64,240,0.12) 55%, transparent)',
              filter: 'blur(10px)',
            }}
          />
        </div>

        {/* la palabra gigante, detrás de la pieza */}
        <div data-palabra className="absolute inset-x-0 bottom-[20%] px-5 md:bottom-[16%] md:px-8">
          <div className="mx-auto max-w-[1600px]">
            <FloatingWord className="-ml-[0.04em] whitespace-nowrap text-[21vw] md:text-[clamp(72px,24.5vw,380px)]" />
          </div>
        </div>

        {/* la pieza */}
        {mostrar3D ? (
          <Escena3D mobile={mobile} activa={activa} />
        ) : (
          !webgl && (
            <div className="absolute top-1/2 w-[40vmin] -translate-x-1/2 -translate-y-1/2" style={{ left: 'var(--ax)' }}>
              <Glyph categoria="celulares" className="float-glyph h-auto w-full" />
            </div>
          )
        )}

        {/* ACTO 0 · llegada */}
        <div data-acto="0" className="absolute inset-0 px-5 pt-24 md:px-8 md:pt-28">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col">
            <div className="flex items-start justify-between gap-6">
              <p className="max-w-[17ch] font-serif text-[24px] italic leading-[1.05] text-off-white md:text-[34px]">
                ¿Y si comprar un celular se sintiera como entrar a un museo a las 3 de la mañana?
              </p>
              <dl className="hidden shrink-0 grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim sm:grid">
                <dt>Salas</dt>
                <dd className="text-off-white">{String(numeros.salas).padStart(2, '0')}</dd>
                <dt>Piezas</dt>
                <dd className="text-off-white">{String(numeros.piezas).padStart(2, '0')}</dd>
                <dt>Moneda</dt>
                <dd className="text-off-white">USD</dd>
              </dl>
            </div>

            {/* placa de museo junto a la pieza */}
            <Link
              href={`/producto/${pieza.slug}`}
              className="group absolute hidden font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] md:block"
              style={{ left: 'calc(var(--ax) - 26vw)', top: '42%' }}
            >
              <span className="flex items-center gap-3">
                <span className="text-blue-glow">Pieza 001</span>
                <span className="h-px w-16 bg-off-white/30 transition-[width] duration-500 group-hover:w-24" />
              </span>
              <span className="block text-off-white">{pieza.nombre}</span>
              <span className="block text-grey-dim">Desde {formatUSD(pieza.desde)}</span>
              <span className="mt-1 block text-grey-dim transition-colors group-hover:text-off-white">Verla en vitrina →</span>
            </Link>

            <div className="mt-auto flex flex-col gap-3 pb-8 font-mono text-[11px] uppercase tracking-[0.16em] md:flex-row md:items-end md:justify-between md:pb-10 md:text-[12px]">
              <p className="max-w-[34ch] text-off-white">— Tu próxima pieza de tecnología empieza acá</p>
              <p className="text-grey-dim">
                <span className="text-blue-tech">Store</span> · Argentina
              </p>
            </div>
          </div>
        </div>

        {!reducido && (
          <>
            {/* ACTO I · mirala de cerca */}
            <div data-acto="1" className="invisible absolute inset-0 flex items-end px-5 pb-16 md:items-center md:justify-end md:px-8 md:pb-0">
              <div className="max-w-[460px] md:mr-[4vw] md:text-right">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-glow">Acto I</p>
                <h2 className="mt-3 font-display text-[clamp(56px,8vw,128px)] font-extrabold uppercase leading-[0.84] tracking-[-0.03em] text-white">
                  Mirala
                  <span className="block font-serif text-[0.62em] font-normal normal-case italic tracking-[-0.01em] text-off-white">de cerca.</span>
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-off-white/70 md:ml-auto md:max-w-[36ch]">
                  Como en el local: la das vuelta, mirás la cámara, la sentís en la mano. Solo que acá no hacés la cola.
                </p>
              </div>
            </div>

            {/* ACTO II · el color */}
            <div data-acto="2" className="invisible absolute inset-0 flex items-end px-5 pb-16 md:items-center md:px-8 md:pb-0">
              <div className="max-w-[640px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-grey-dim">
                  Acto II · Color {String(color + 1).padStart(2, '0')}/{String(pieza.colores.length).padStart(2, '0')}
                </p>
                <h2
                  key={c?.color}
                  className="color-entra mt-3 font-display text-[clamp(64px,11vw,190px)] font-extrabold uppercase leading-[0.82] tracking-[-0.03em]"
                  style={{ color: c?.hex ?? '#fff', textShadow: `0 0 80px ${c?.hex ?? '#fff'}55` }}
                >
                  {c?.color}
                </h2>
                <p className="mt-4 font-serif text-[26px] italic text-off-white md:text-[34px]">El color lo elegís vos.</p>
                <div className="mt-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim">
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

            {/* ACTO III · los números */}
            <div data-acto="3" className="invisible absolute inset-0 flex items-center px-5 md:px-8">
              <div className="mx-auto w-full max-w-[1600px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-glow">Acto III</p>
                <div className="mt-6 grid grid-cols-3 gap-4 md:max-w-[1100px] md:gap-10">
                  {[
                    [numeros.piezas, 'piezas'],
                    [numeros.salas, 'salas'],
                    [numeros.marcas, 'marcas'],
                  ].map(([n, l]) => (
                    <div key={l} className="border-t border-line pt-4">
                      <p data-num={n} className="font-display text-[clamp(64px,13vw,220px)] font-extrabold leading-[0.8] tracking-[-0.03em] text-white">
                        00
                      </p>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-grey-dim">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-10 max-w-[30ch] font-serif text-[26px] italic leading-[1.1] text-off-white md:text-[36px]">
                  Una sola regla: si algo te gusta, <span className="text-blue-glow">escribinos.</span>
                </p>
              </div>
            </div>
          </>
        )}

        {/* indicador de recorrido */}
        {!reducido && (
          <div aria-hidden className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-grey-dim md:right-8 md:flex">
            <span>Scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <span className="scroll-hint absolute inset-x-0 top-0 h-3 bg-off-white" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
