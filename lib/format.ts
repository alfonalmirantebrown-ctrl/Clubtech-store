export function formatUSD(n: number | null) {
  if (n == null) return 'Consultar';
  return `US$ ${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
}
