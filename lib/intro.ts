'use client';

import { useSyncExternalStore } from 'react';

// Estado mínimo compartido entre la intro del hero y la nav:
// la nav no muestra el isotipo hasta que la intro lo "deja" ahí (fase 3).
type Fase = 'pendiente' | 'corriendo' | 'terminada';

let fase: Fase = 'pendiente';
const subs = new Set<() => void>();

export function setFaseIntro(f: Fase) {
  fase = f;
  subs.forEach((fn) => fn());
}

export function useFaseIntro() {
  return useSyncExternalStore(
    (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    () => fase,
    () => 'pendiente' as Fase,
  );
}
