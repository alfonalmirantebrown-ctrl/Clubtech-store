// Número en formato internacional sin "+" (ej: 5491112345678). Se carga en Vercel.
const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export function linkWhatsApp(mensaje: string) {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
