import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-start justify-end bg-black px-5 pb-16 md:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-tech">Error 404</p>
      <h1 className="mt-3 max-w-[12ch] text-[clamp(48px,9vw,140px)] font-display font-extrabold leading-[0.86] tracking-[-0.028em] text-white">
        Esta pieza <em className="font-serif font-normal italic tracking-[-0.02em] text-blue-glow">no está</em> en exhibición.
      </h1>
      <Link href="/" className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-off-white underline decoration-line underline-offset-4 hover:decoration-off-white">
        ← Volver al vestíbulo
      </Link>
    </main>
  );
}
