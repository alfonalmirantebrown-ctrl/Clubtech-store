// Estado compartido entre el scroll (GSAP) y la escena 3D (useFrame).
// Es un objeto mutable a propósito: se lee 60 veces por segundo sin re-render de React.

export type ColorPieza = { color: string; hex: string; desde: number | null };

export const escena = {
  /** progreso del scroll dentro del showroom, 0 → 1 */
  p: 0,
  /** mouse normalizado, -1 → 1 */
  mx: 0,
  my: 0,
  /** índice de color activo (acto II) */
  color: 0,
  /** colores del producto en exhibición (los carga el Showroom) */
  colores: [] as ColorPieza[],
};

const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

/*
  Coreografía del celular según el scroll:
  0.00–0.22  hero: de frente, levemente girado
  0.22–0.45  acto I: gira y muestra la cámara (texto a la izquierda, celular a la derecha)
  0.45–0.80  acto II: cruza a la izquierda y cambia de color (texto a la derecha)
  0.80–1.00  acto III: se va hacia arriba y deja lugar al pase al catálogo
*/
export function pose(p: number, mobile: boolean) {
  const a1 = suave(0.12, 0.34, p);
  const a2 = suave(0.42, 0.52, p);
  const a3 = suave(0.8, 0.97, p);
  const xHero = mobile ? 0 : 0.95;
  // los textos se alternan de lado; el celular siempre se ubica del lado contrario
  const x = mobile ? 0 : mezcla(mezcla(xHero, 0.8, a1), -0.85, a2);
  // en el celular la pieza va más chica y sube en el acto II para dejar lugar al texto de abajo
  const y = mobile ? mezcla(mezcla(mezcla(-0.12, 0.4, a1), 0.42, a2), 2.6, a3) : mezcla(0, 2.6, a3);
  return {
    x,
    y,
    rotY: mezcla(mezcla(-0.42, Math.PI + 0.32, a1), Math.PI - 0.28, a2),
    rotX: mezcla(0.06, -0.12, a1) * (1 - a2) + 0.05 * a2,
    scale: mezcla(mezcla(1, 1.32, a1), 1.05, a2) * (mobile ? mezcla(mezcla(0.62, 0.46, a1), 0.58, a2) : 1),
  };
}

/** posición horizontal del celular en % de pantalla, para centrar el aura (CSS) detrás */
export function auraX(p: number, mobile: boolean, ancho3d: number) {
  return 50 + (pose(p, mobile).x / ancho3d) * 100;
}
