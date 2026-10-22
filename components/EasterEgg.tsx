'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Easter egg: tipeá "clubh" (el error de la intro) en cualquier parte del sitio.
const CLAVE = 'clubh';

export default function EasterEgg() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-CLAVE.length);
      if (buffer === CLAVE) {
        setVisible(true);
        setTimeout(() => setVisible(false), 4200);
      }
    };
    window.addEventListener('keydown', onKey);
    // eslint-disable-next-line no-console
    console.log('%cCLUBTECH', 'font: 800 28px system-ui; color: #0040F0', '\nSi estás leyendo esto, probá tipear "clubh" en la página.');
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 z-[70] max-w-[300px] border border-blue-tech bg-black px-4 py-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-off-white"
          style={{ borderRadius: '0 10px 10px 10px' }}
        >
          <span className="text-blue-tech">Encontraste la H.</span>
          <br />
          Se nos escapó en la intro y anda suelta por la web. No le digas a nadie.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
