import Image from 'next/image';
import Glyph from './Glyph';

type Props = {
  nombre: string;
  categoria: string;
  imageUrl: string | null;
  tinte?: string | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// Foto real si existe; si no, el dibujo de la categoría.
export default function ProductoVisual({ nombre, categoria, imageUrl, tinte, priority, sizes = '50vw', className = '' }: Props) {
  if (imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <Image src={imageUrl} alt={nombre} fill priority={priority} sizes={sizes} className="object-contain" />
      </div>
    );
  }
  return <Glyph categoria={categoria} tinte={tinte} className={className} />;
}
