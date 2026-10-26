/** @type {import('next').NextConfig} */
const nextConfig = {
  // el modelo 3D no cambia seguido: que el navegador lo guarde (si se reemplaza, cambiarle el nombre)
  async headers() {
    return [
      {
        source: '/models/:archivo*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wfazriudzybknzcjplob.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
