import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Component, lazy, Suspense, type ReactNode } from 'react';
import { ease, requestEstimate } from './ui';

const Hero3D = lazy(() => import('./Hero3D'));

/** Falls back to a static backdrop if WebGL is unavailable. */
class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#3a3127_0%,#111_65%)]" /> : this.props.children; }
}

const words = ['BRING YOUR', 'SURFACES BACK', 'TO LIFE.'];

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const fade = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section id="top" className="grain relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0c0b0a]">
      <GLBoundary>
        <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#2a241d_0%,#0c0b0a_65%)]" />}>
          <Hero3D />
        </Suspense>
      </GLBoundary>

      {/* cinematic scrims */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c0b0a] via-[#0c0b0a]/70 to-transparent md:via-[#0c0b0a]/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent" />

      {/* gold architectural lines */}
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 2, delay: 0.4, ease }} className="pointer-events-none absolute left-5 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-10 md:block" />
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.2, delay: 0.8, ease }} className="pointer-events-none absolute bottom-[18%] left-0 h-px w-2/3 origin-left bg-gradient-to-r from-gold/50 to-transparent" />

      <motion.div style={{ y, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-5 pt-20 md:px-16">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease }} className="eyebrow flex items-center gap-4">
          <span className="h-px w-10 bg-gold" /> Restoring the beauty beneath · Est. 2025
        </motion.p>
        <h1 className="h-display mt-7 text-[clamp(2.7rem,7.6vw,7.4rem)]">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-1">
              <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.3, delay: 0.45 + i * 0.14, ease }}>
                {i === 2 ? <><em className="font-light not-italic text-gold">TO</em> LIFE.</> : w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.05, ease }} className="mt-8 max-w-md text-[15px] leading-relaxed text-ivory/70 md:text-base">
          Premium tile, natural stone, and grout restoration crafted to restore beauty, enhance elegance, and protect your investment.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.25, ease }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button onClick={() => requestEstimate()} className="btn-gold group">
            Request a Free Estimate <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
          <a href="#services" className="btn-ghost">Explore Our Services</a>
        </motion.div>
      </motion.div>

      <motion.a href="#services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-luxe text-ivory/50" aria-label="Scroll to services">
        Scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}><ArrowDown size={14} strokeWidth={1} /></motion.span>
      </motion.a>
      <div className="absolute bottom-8 right-5 z-10 hidden text-right text-[9px] uppercase leading-relaxed tracking-luxe text-ivory/40 md:right-16 md:block">
        Premium Tile<br />Timeless Stone<br />Flawless Finishes
      </div>
    </section>
  );
}
