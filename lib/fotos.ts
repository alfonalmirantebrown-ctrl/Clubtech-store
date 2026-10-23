import type { Producto } from './types';

export type Foto = { src: string; credito?: string; demo?: boolean };

const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

/*
  FOTOS DE MUESTRA (temporales).
  Fotos reales con licencia libre de Wikimedia Commons, para mostrar cómo se ve el sitio con fotos.
  Cuando Clubtech mande las suyas se cargan en Supabase (columna image_url) y estas dejan de usarse:
  image_url siempre tiene prioridad. Para sacar la muestra entera, vaciar este objeto.
*/
const DEMO: Record<string, Foto> = {
  'iphone-17-pro-max': {
    src: `${WM}/9/92/Cosmic_Orange_iPhone_17_Pro_Max.jpg/960px-Cosmic_Orange_iPhone_17_Pro_Max.jpg`,
    credito: 'Ahmad Ali Karim · CC0 · Wikimedia Commons',
  },
  'galaxy-s25-ultra': {
    src: `${WM}/b/b0/Samsung_Galaxy_S25_Ultra.jpg/960px-Samsung_Galaxy_S25_Ultra.jpg`,
    credito: 'Jakub CA · CC BY 4.0 · Wikimedia Commons',
  },
  'macbook-pro-m5-pro': {
    src: `${WM}/4/43/MacBook_Pro_(16-inch%2C_M4_Pro%2C_Silver).jpg/960px-MacBook_Pro_(16-inch%2C_M4_Pro%2C_Silver).jpg`,
    credito: 'Foto de un M4 Pro · Wikimedia Commons',
  },
  'playstation-5-pro': {
    src: `${WM}/8/82/PlayStation_5_Pro_no_disc_drive.jpg/960px-PlayStation_5_Pro_no_disc_drive.jpg`,
    credito: 'BeatEmUps · CC BY · Wikimedia Commons',
  },
  'nintendo-switch-2': {
    src: `${WM}/5/50/Nintendo_Switch_2_in_Handheld_Mode.jpg/960px-Nintendo_Switch_2_in_Handheld_Mode.jpg`,
    credito: 'Crisco 1492 · CC BY-SA 4.0 · Wikimedia Commons',
  },
};

export function fotoDe(p: Pick<Producto, 'slug' | 'image_url'>): Foto | null {
  if (p.image_url) return { src: p.image_url };
  const demo = DEMO[p.slug];
  return demo ? { ...demo, demo: true } : null;
}
