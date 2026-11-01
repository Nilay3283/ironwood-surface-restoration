import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { GALLERY } from '../content';
import { useScene } from '../lib/useScene';
import SceneImage from './SceneImage';
import { DemoBadge, Heading, Reveal, ease } from './ui';

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const g = GALLERY[index];
  const url = useScene({ ...g.scene, w: g.scene.w! * 1.4, h: g.scene.h! * 1.4 }, g.photo);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose, onNav]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex flex-col bg-obsidian/95 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={g.title}>
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <span className="text-[10px] uppercase tracking-luxe text-ivory/50">{String(index + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
        <button onClick={onClose} aria-label="Close gallery" className="p-2"><X size={24} strokeWidth={1.1} /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 md:px-24">
        <AnimatePresence mode="wait">
          <motion.figure key={index} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.6, ease }} className="relative flex max-h-full flex-col items-center">
            {url ? <img src={url} alt={g.title} className="max-h-[72vh] w-auto max-w-full object-contain" /> : <div className="h-[60vh] w-[80vw] bg-charcoal" />}
            <figcaption className="mt-6 text-center">
              <span className="eyebrow">{g.category}</span>
              <p className="mt-2 font-serif text-2xl font-light md:text-3xl">{g.title}</p>
              {!g.photo && <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ivory/35">Demonstration render — project photography coming soon</p>}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
        <button onClick={() => onNav(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 border border-ivory/20 p-3 transition-colors hover:border-gold hover:text-gold md:left-8"><ChevronLeft size={20} strokeWidth={1.1} /></button>
        <button onClick={() => onNav(1)} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 border border-ivory/20 p-3 transition-colors hover:border-gold hover:text-gold md:right-8"><ChevronRight size={20} strokeWidth={1.1} /></button>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const nav = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)), []);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="gallery" className="relative bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Heading eyebrow="Project Gallery" title={<>The art of surface<br />restoration.</>} />
          <Reveal delay={0.2}><DemoBadge /></Reveal>
        </div>
        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {GALLERY.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 0.08} className="break-inside-avoid">
              <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden text-left" aria-label={`Open ${g.title}`}>
                <SceneImage scene={g.scene} photo={g.photo} alt={g.title} className={g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'} imgClassName="transition-transform duration-[1800ms] ease-out group-hover:scale-[1.08]" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div className="translate-y-2 transition-transform duration-700 group-hover:translate-y-0">
                    <span className="text-[9px] uppercase tracking-luxe text-gold">{g.category}</span>
                    <p className="mt-1 font-serif text-xl font-light">{g.title}</p>
                  </div>
                  <Expand size={16} strokeWidth={1.2} className="text-ivory/0 transition-colors duration-700 group-hover:text-gold" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
