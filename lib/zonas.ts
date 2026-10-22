// Atmósfera por sala (ver CLAUDE.md → "Cómo aplicar los azules por zona")
type Zona = { fondo: string; acento: string };

const ZONAS: Record<string, Zona> = {
  celulares: { fondo: 'var(--blue-void)', acento: 'var(--blue-glow)' },
  tablets: { fondo: 'var(--black)', acento: 'var(--blue-ice)' },
  laptops: { fondo: 'var(--blue-deep)', acento: 'var(--white)' },
  consolas: { fondo: 'var(--black)', acento: 'var(--blue-tech)' },
};

export function zonaDe(categoriaSlug: string): Zona {
  return ZONAS[categoriaSlug] ?? { fondo: 'var(--black)', acento: 'var(--blue-glow)' };
}

export function estiloZona(categoriaSlug: string) {
  const z = zonaDe(categoriaSlug);
  return { '--zone-bg': z.fondo, '--zone-accent': z.acento, background: z.fondo } as React.CSSProperties;
}
