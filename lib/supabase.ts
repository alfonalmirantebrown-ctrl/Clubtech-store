import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copiá .env.example a .env.local (o cargalas en Vercel).',
  );
}

// El catálogo cambia poco: cada respuesta de Supabase se cachea 10 minutos en el servidor.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 600 } }),
  },
});

export const STORAGE_URL = `${url}/storage/v1/object/public`;
