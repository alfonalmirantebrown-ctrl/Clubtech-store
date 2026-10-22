// "CLUBTECH" flotante: cada letra sube/baja ±3px a su propio ritmo,
// y al hover aparece una aberración cromática (rojo/cyan) que nunca deforma la letra.

const PALABRA = 'CLUBTECH';

// Valores fijos (no Math.random) para que servidor y cliente rendericen igual
const RITMOS = [3.4, 2.9, 3.8, 3.1, 4.2, 2.7, 3.6, 3.0];
const DESFASES = [0, -1.3, -0.4, -2.1, -0.9, -1.7, -2.6, -0.2];

function Letras() {
  return (
    <>
      {PALABRA.split('').map((l, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: `${i % 2 ? 'float-letter-alt' : 'float-letter'} ${RITMOS[i]}s ease-in-out ${DESFASES[i]}s infinite`,
          }}
        >
          {l}
        </span>
      ))}
    </>
  );
}

export default function FloatingWord({ className = '' }: { className?: string }) {
  return (
    <h1
      className={`glitch select-none font-sans font-extrabold leading-[0.85] tracking-[-0.035em] text-white md:tracking-[-0.055em] ${className}`}
      aria-label="Clubtech"
    >
      <span aria-hidden className="relative">
        <Letras />
      </span>
      <span aria-hidden className="glitch__layer glitch__layer--r">
        <Letras />
      </span>
      <span aria-hidden className="glitch__layer glitch__layer--c">
        <Letras />
      </span>
    </h1>
  );
}
