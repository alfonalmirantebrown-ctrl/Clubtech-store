'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { linkWhatsApp } from '@/lib/whatsapp';

// Botón magnético: el botón se acerca al cursor cuando pasás cerca (idea tomada de "Magnet" de React Bits).
function BotonMagnetico({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducido = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });

  const onMove = (e: React.PointerEvent) => {
    if (reducido || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="inline-block p-8 -m-8" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ x, y, borderRadius: '0 28px 0 28px' }}
        className="group relative inline-flex items-center gap-8 overflow-hidden bg-blue-tech px-8 py-6 text-[18px] font-semibold text-white md:px-12 md:py-8 md:text-[22px]"
      >
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-blue-glow transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
        <span className="relative">{children}</span>
        <span className="relative font-mono transition-transform duration-300 group-hover:translate-x-1.5">→</span>
      </motion.a>
    </div>
  );
}

export default function Cierre() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-black px-5 py-28 md:px-8 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] bottom-[-30vw] aspect-square w-[80vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(0,64,240,0.28), transparent)' }}
      />
      <div className="relative mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12">
        <h2 className="font-display text-[clamp(56px,9vw,150px)] font-extrabold uppercase leading-[0.84] tracking-[-0.03em] text-white md:col-span-8">
          Sin carrito.
          <br />
          Sin formulario.
          <span className="mt-2 block font-serif text-[0.7em] font-normal normal-case italic tracking-[-0.01em] text-blue-glow">
            Un mensaje y listo.
          </span>
        </h2>

        <div className="flex flex-col justify-end gap-10 md:col-span-4">
          <ol className="space-y-4 font-mono text-[12px] uppercase tracking-[0.14em]">
            {['Elegís la pieza', 'Nos escribís por WhatsApp', 'Te confirmamos stock y precio'].map((paso, i) => (
              <li key={paso} className="flex items-baseline gap-4 border-b border-line pb-4">
                <span className="text-blue-glow">0{i + 1}</span>
                <span className="text-off-white">{paso}</span>
              </li>
            ))}
          </ol>
          <div>
            <BotonMagnetico href={linkWhatsApp('Hola Clubtech! Vi la web y quiero consultar por una pieza.')}>
              Escribinos
            </BotonMagnetico>
          </div>
        </div>
      </div>
    </section>
  );
}
