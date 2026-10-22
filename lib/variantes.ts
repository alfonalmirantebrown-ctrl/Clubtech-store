import type { Variante } from './types';

// En la base, "Default" significa "no aplica": no se muestra como opción.
export const esOpcion = (v: string | null): v is string => !!v && v !== 'Default';

export function unicos<T>(xs: T[]) {
  return Array.from(new Set(xs));
}

export function memoriasDe(vs: Variante[]) {
  const ordenadas = [...vs].sort((a, b) => (a.precio_usd ?? 0) - (b.precio_usd ?? 0));
  return unicos(ordenadas.map((v) => v.memoria).filter(esOpcion));
}

export function coloresDe(vs: Variante[]) {
  const vistos = new Map<string, string | null>();
  vs.forEach((v) => esOpcion(v.color) && !vistos.has(v.color) && vistos.set(v.color, v.color_hex));
  return Array.from(vistos, ([color, hex]) => ({ color, hex }));
}
