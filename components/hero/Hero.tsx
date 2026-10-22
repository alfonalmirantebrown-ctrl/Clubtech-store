import FloatingWord from './FloatingWord';
import Intro from './Intro';

export default function Hero({ categorias, piezas }: { categorias: number; piezas: number }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black px-5 pb-10 pt-24 md:px-8 md:pb-14">
      <Intro />

      {/* coordenadas del showroom, arriba a la derecha */}
      <dl className="absolute right-5 top-24 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-grey-dim md:right-8">
        <dt>Salas</dt>
        <dd className="text-off-white">{String(categorias).padStart(2, '0')}</dd>
        <dt>Piezas</dt>
        <dd className="text-off-white">{String(piezas).padStart(2, '0')}</dd>
        <dt>Moneda</dt>
        <dd className="text-off-white">USD</dd>
      </dl>

      <div className="mx-auto w-full max-w-[1600px]">
        <FloatingWord className="-ml-[0.04em] text-[clamp(64px,17vw,260px)]" />

        <div className="mt-6 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.16em] md:mt-8 md:flex-row md:items-end md:justify-between md:text-[12px]">
          <p className="max-w-[34ch] text-off-white">— Tu próxima pieza de tecnología empieza acá</p>
          <p className="text-grey-dim">
            <span className="text-blue-tech">Store</span> · Argentina
          </p>
        </div>

        <a
          href="#vestibulo"
          className="mt-12 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-grey-dim transition-colors duration-200 hover:text-off-white md:mt-16"
        >
          <span className="inline-block h-px w-10 bg-current" />
          Entrá al vestíbulo
        </a>
      </div>
    </section>
  );
}
