import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { SERVICES, type Service } from '../content';
import SceneImage from './SceneImage';
import { DemoBadge, Heading, Reveal, ease, requestEstimate } from './ui';

function Card({ s, onOpen }: { s: Service; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 });
  const glare = useTransform([mx, my] as any, ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,240,210,.18), transparent 55%)`);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.article ref={ref} onPointerMove={move} onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-charcoal [transform-style:preserve-3d]">
      <SceneImage scene={s.scene} photo={s.photo} alt={`${s.title} — stone surface`} className="!absolute inset-0" imgClassName="transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
      <div className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-gold/40" />
      {!s.photo && <DemoBadge className="absolute right-4 top-4" />}
      <div className="relative p-7 md:p-8" style={{ transform: 'translateZ(40px)' }}>
        <span className="font-serif text-sm italic text-gold">Service {s.no}</span>
        <h3 className="mt-2 font-serif text-[1.9rem] font-light uppercase leading-none tracking-[0.05em]">{s.title}</h3>
        <p className="mt-4 max-h-0 overflow-hidden text-sm leading-relaxed text-ivory/70 opacity-0 transition-all duration-700 group-hover:max-h-40 group-hover:opacity-100 group-focus-within:max-h-40 group-focus-within:opacity-100 max-md:max-h-40 max-md:opacity-100">{s.text}</p>
        <button onClick={onOpen} className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-wide2 text-gold">
          Explore Service <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

function Detail({ s, onClose }: { s: Service; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={s.title}>
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.8, ease }} onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-obsidian">
        <div className="relative h-72 shrink-0">
          <SceneImage scene={s.scene} photo={s.photo} alt="" className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
          <button onClick={onClose} className="absolute right-5 top-5 bg-obsidian/60 p-2 backdrop-blur" aria-label="Close"><X size={20} strokeWidth={1.2} /></button>
        </div>
        <div className="flex flex-1 flex-col p-8 md:p-12">
          <span className="font-serif italic text-gold">Service {s.no}</span>
          <h3 className="mt-2 font-serif text-4xl font-light uppercase tracking-[0.05em]">{s.title}</h3>
          <div className="gold-rule mt-6" />
          <p className="mt-6 leading-relaxed text-ivory/70">{s.text}</p>
          <ul className="mt-8 space-y-4">
            {s.detail.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-ivory/80"><Check size={16} className="mt-0.5 shrink-0 text-gold" strokeWidth={1.4} />{d}</li>
            ))}
          </ul>
          <p className="mt-8 text-xs leading-relaxed text-ivory/40">Suitability and results depend on the material and its condition, confirmed during the surface assessment.</p>
          <button onClick={() => { onClose(); setTimeout(() => requestEstimate(s.title), 300); }} className="btn-gold mt-auto w-full">Request an Estimate for this Service</button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

export default function Services() {
  const [open, setOpen] = useState<Service | null>(null);
  return (
    <section id="services" className="relative bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <Heading eyebrow="Premium Restoration" title={<>Expert care for<br />every surface.</>} />
          <Reveal delay={0.2} className="max-w-sm text-sm leading-relaxed text-ivory/55">
            From hand-selected marble to hard-working commercial tile, each restoration is tailored to the material, its finish and its history.
          </Reveal>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.1}>
              <Card s={s} onOpen={() => setOpen(s)} />
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <Detail s={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
