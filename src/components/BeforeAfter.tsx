import { AnimatePresence, motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { COMPARISONS } from '../content';
import { useScene } from '../lib/useScene';
import { DemoBadge, Heading, Reveal } from './ui';

function Slider({ index }: { index: number }) {
  const c = COMPARISONS[index];
  const before = useScene({ ...c.before, w: 1600, h: 1000 }, c.beforePhoto);
  const after = useScene({ ...c.after, w: 1600, h: 1000 }, c.afterPhoto);
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);
  const down = (e: PointerEvent) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); update(e.clientX); };
  const move = (e: PointerEvent) => dragging.current && update(e.clientX);
  const up = () => (dragging.current = false);
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
  };
  const demo = !c.beforePhoto;

  return (
    <div ref={box} className="relative aspect-[16/10] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-charcoal"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {after && <img src={after} alt={`After: ${c.caption}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />}
      {before && (
        <img src={before} alt={`Before: ${c.caption}`} className="absolute inset-0 h-full w-full object-cover" draggable={false}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      )}
      <span className="absolute left-4 top-4 bg-obsidian/70 px-3 py-1.5 text-[10px] uppercase tracking-wide2 backdrop-blur md:left-6 md:top-6">Before</span>
      <span className="absolute right-4 top-4 bg-gold px-3 py-1.5 text-[10px] uppercase tracking-wide2 text-obsidian md:right-6 md:top-6">After</span>
      {demo && <DemoBadge className="absolute bottom-4 left-4 md:bottom-6 md:left-6" />}
      <div className="absolute inset-y-0 w-px bg-ivory/80" style={{ left: `${pos}%` }}>
        <button
          role="slider" aria-label="Before and after comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onKeyDown={key}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-obsidian/80 text-gold backdrop-blur transition-transform hover:scale-110">
          <MoveHorizontal size={20} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [i, setI] = useState(0);
  return (
    <section id="results" className="relative bg-[#0e0e0e] px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div className="flex flex-col">
            <Heading eyebrow="Before & After" title={<>The difference is in the details.</>}
              intro="Drag across each surface to compare its worn condition with the restored finish." />
            <Reveal delay={0.2} className="mt-12 flex flex-wrap gap-2 lg:flex-col lg:gap-0" role="tablist" aria-label="Comparison type">
              {COMPARISONS.map((c, k) => (
                <button key={c.id} role="tab" aria-selected={i === k} onClick={() => setI(k)}
                  className={`group flex items-center gap-5 border px-4 py-3 text-left transition-colors lg:border-0 lg:border-b lg:border-ivory/10 lg:px-0 lg:py-5 ${i === k ? 'border-gold text-ivory' : 'border-ivory/15 text-ivory/45 hover:text-ivory'}`}>
                  <span className="hidden font-serif text-sm italic text-gold lg:inline">0{k + 1}</span>
                  <span className="text-[11px] uppercase tracking-wide2 lg:font-serif lg:text-2xl lg:normal-case lg:tracking-normal">{c.label}</span>
                  <span className={`ml-auto hidden h-px bg-gold transition-all duration-700 lg:block ${i === k ? 'w-12' : 'w-0'}`} />
                </button>
              ))}
            </Reveal>
            <p className="mt-8 text-xs leading-relaxed text-ivory/35">Demonstration renders shown until real Ironwood project photography is available. Actual results vary with material and condition.</p>
          </div>
          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <Slider index={i} />
                <p className="mt-5 font-serif text-lg italic text-stone">{COMPARISONS[i].caption}</p>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
