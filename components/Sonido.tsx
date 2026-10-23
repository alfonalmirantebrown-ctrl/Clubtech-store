'use client';

import { useEffect, useRef, useState } from 'react';

/*
  Sonido ambiente opcional, sintetizado en el navegador (no descarga ningún archivo):
  un zumbido grave de sala vacía, como el aire acondicionado de un showroom de noche.
  Arranca apagado; solo suena si el visitante lo prende.
*/
export default function Sonido() {
  const [on, setOn] = useState(false);
  const audio = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  const crear = () => {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 420;
    filtro.Q.value = 0.7;
    filtro.connect(master);

    // dos tonos graves apenas desafinados: el "latido" lo hace la diferencia entre ambos
    [55, 82.41, 110.6].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.05 : 0.22;
      o.connect(g).connect(filtro);
      o.start();
    });

    // ruido muy filtrado, como aire
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const ruido = ctx.createBufferSource();
    ruido.buffer = buf;
    ruido.loop = true;
    const gr = ctx.createGain();
    gr.gain.value = 0.05;
    ruido.connect(gr).connect(filtro);
    ruido.start();

    // el filtro respira lento
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain();
    lg.gain.value = 160;
    lfo.connect(lg).connect(filtro.frequency);
    lfo.start();

    return { ctx, master };
  };

  const alternar = () => {
    if (!audio.current) audio.current = crear();
    const { ctx, master } = audio.current;
    const prender = !on;
    if (prender) ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(prender ? 0.09 : 0, ctx.currentTime, 0.6);
    setOn(prender);
  };

  useEffect(() => () => void audio.current?.ctx.close(), []);

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={on}
      className="flex items-center gap-2 text-grey-dim transition-colors duration-200 hover:text-off-white"
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current"
            style={{
              height: on ? undefined : '3px',
              animation: on ? `ecualizador 0.9s ease-in-out ${i * 0.15}s infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      Sonido {on ? 'on' : 'off'}
    </button>
  );
}
