'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductoVisual from '@/components/ProductoVisual';
import { formatUSD } from '@/lib/format';
import { fotoDe } from '@/lib/fotos';
import type { ProductoCompleto } from '@/lib/types';
import { coloresDe, esOpcion, memoriasDe } from '@/lib/variantes';
import { linkWhatsApp } from '@/lib/whatsapp';

const TILT = 7; // grados máximos de inclinación

function Pill({ activo, onClick, children, disabled }: { activo: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={activo}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${
        activo ? 'border-white bg-white text-black' : 'border-line text-off-white hover:border-off-white/50'
      }`}
    >
      {children}
    </button>
  );
}

export default function Vitrina({ producto }: { producto: ProductoCompleto }) {
  const { variantes, marca, categoria } = producto;
  const memorias = useMemo(() => memoriasDe(variantes), [variantes]);
  const [memoria, setMemoria] = useState<string | null>(memorias[0] ?? null);

  const deEstaMemoria = useMemo(
    () => (memoria ? variantes.filter((v) => v.memoria === memoria) : variantes),
    [variantes, memoria],
  );
  const coloresTodos = useMemo(() => coloresDe(variantes), [variantes]);
  const coloresDisponibles = useMemo(() => new Set(coloresDe(deEstaMemoria).map((c) => c.color)), [deEstaMemoria]);
  const [color, setColor] = useState<string | null>(coloresDe(deEstaMemoria)[0]?.color ?? null);

  // si el color elegido no existe en la nueva memoria, saltamos al primero que sí
  useEffect(() => {
    if (color && !coloresDisponibles.has(color)) setColor(coloresDe(deEstaMemoria)[0]?.color ?? null);
  }, [color, coloresDisponibles, deEstaMemoria]);

  const variante =
    deEstaMemoria.find((v) => !color || v.color === color || !esOpcion(v.color)) ?? deEstaMemoria[0] ?? variantes[0];
  const sinStock = (variante?.stock ?? 0) <= 0;

  // ← → cambian de color
  useEffect(() => {
    const disponibles = coloresTodos.filter((c) => coloresDisponibles.has(c.color));
    if (disponibles.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = disponibles.findIndex((c) => c.color === color);
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + disponibles.length) % disponibles.length;
      setColor(disponibles[n].color);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [color, coloresTodos, coloresDisponibles]);

  // Tilt 3D siguiendo el mouse
  const reducido = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-TILT, TILT]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [TILT, -TILT]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducido || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const detalle = [variante?.memoria, variante?.color].filter(esOpcion).join(' · ');
  const mensaje = `Hola Clubtech! Quiero comprar: ${producto.nombre}${detalle ? ` (${detalle})` : ''} — ${formatUSD(
    variante?.precio_usd ?? null,
  )}. ¿Está disponible?`;

  return (
    <section className="grid min-h-[100svh] grid-cols-1 md:grid-cols-12">
      {/* Producto: va primero en mobile, a la derecha en desktop */}
      <div
        className="relative flex min-h-[50svh] items-center justify-center overflow-hidden pb-12 pt-24 md:order-2 md:py-0 md:col-span-7 md:min-h-[100svh]"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ perspective: 1200 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background: `radial-gradient(42% 38% at 50% 52%, ${variante?.color_hex ?? '#1E7FFF'}2e, transparent 70%), radial-gradient(60% 50% at 50% 60%, rgba(30,127,255,0.12), transparent 70%)`,
          }}
        />
        <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative w-[72%] max-w-[520px] md:w-[52%]">
          <ProductoVisual
            nombre={producto.nombre}
            foto={fotoDe(producto)}
            tinte={variante?.color_hex}
            priority
            credito
            sizes="(min-width: 768px) 45vw, 80vw"
            className="aspect-[4/5] w-full shadow-[0_40px_120px_-30px_rgba(30,127,255,0.35)]"
          />
        </motion.div>
      </div>

      {/* Texto editorial */}
      <div className="flex flex-col justify-end px-5 pb-12 pt-6 md:order-1 md:col-span-5 md:px-8 md:pb-16 md:pt-28">
        <nav className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim" aria-label="Migas">
          <Link href={`/catalogo/${categoria.slug}`} className="hover:text-off-white">{categoria.nombre}</Link>
          <span className="mx-2">/</span>
          <Link href={`/catalogo/${categoria.slug}/${marca.slug}`} className="hover:text-off-white">{marca.nombre}</Link>
        </nav>

        <h1 className="font-display text-[clamp(44px,6vw,96px)] font-extrabold leading-[0.88] tracking-[-0.025em] text-white">{producto.nombre}</h1>
        {producto.tagline && <p className="mt-5 max-w-[24ch] font-serif text-[26px] italic leading-[1.1] text-off-white md:text-[34px]">{producto.tagline}</p>}
        {producto.descripcion && <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-off-white/60">{producto.descripcion}</p>}

        <div className="mt-10 space-y-6">
          {memorias.length > 1 && (
            <fieldset>
              <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-grey-dim">Versión</legend>
              <div className="flex flex-wrap gap-2">
                {memorias.map((m) => (
                  <Pill key={m} activo={memoria === m} onClick={() => setMemoria(m)}>
                    {m}
                  </Pill>
                ))}
              </div>
            </fieldset>
          )}
          {coloresTodos.length > 0 && (
            <fieldset>
              <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-grey-dim">
                Color {coloresTodos.length > 1 && <span className="text-grey-dim/60">· ← →</span>}
              </legend>
              <div className="flex flex-wrap gap-2">
                {coloresTodos.map((c) => (
                  <Pill key={c.color} activo={color === c.color} disabled={!coloresDisponibles.has(c.color)} onClick={() => setColor(c.color)}>
                    <span className="h-3 w-3 rounded-full border border-black/20" style={{ background: c.hex ?? '#666' }} />
                    {c.color}
                  </Pill>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-[44px] font-bold leading-none tracking-[-0.018em] text-white">{formatUSD(variante?.precio_usd ?? null)}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim">
              {sinStock ? 'Sin stock · consultá ingreso' : 'En stock · listo para entregar'}
            </p>
          </div>
          <a
            href={linkWhatsApp(sinStock ? `Hola Clubtech! ¿Cuándo les entra ${producto.nombre}${detalle ? ` (${detalle})` : ''}?` : mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-between gap-6 bg-blue-tech px-6 py-4 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue-glow"
            style={{ borderRadius: '0 14px 0 14px' }}
          >
            {sinStock ? 'Avisame por WhatsApp' : 'Comprar por WhatsApp'}
            <span className="font-mono transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
