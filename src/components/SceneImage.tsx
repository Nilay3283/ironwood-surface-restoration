import { useScene } from '../lib/useScene';
import type { SceneOpts } from '../lib/textures';

interface Props { scene: SceneOpts; photo?: string; alt: string; className?: string; imgClassName?: string }

/** Image that fades in once its procedural render (or real photo) is ready. */
export default function SceneImage({ scene, photo, alt, className = '', imgClassName = '' }: Props) {
  const url = useScene(scene, photo);
  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      {url && (
        <img src={url} alt={alt} loading="lazy" decoding="async"
          className={`h-full w-full object-cover opacity-0 transition-opacity duration-1000 ${imgClassName}`}
          onLoad={(e) => (e.currentTarget.style.opacity = '1')} />
      )}
    </div>
  );
}
