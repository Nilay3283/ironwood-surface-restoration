import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className = '', ...rest }: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Heading({ eyebrow, title, intro, align = 'left', light = false }: { eyebrow: string; title: ReactNode; intro?: ReactNode; align?: 'left' | 'center'; light?: boolean }) {
  const center = align === 'center';
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Reveal className={`flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-gold" />
        <span className="eyebrow">{eyebrow}</span>
        {center && <span className="h-px w-10 bg-gold" />}
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`h-section mt-6 ${light ? 'text-obsidian' : 'text-ivory'}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className={`mt-6 max-w-xl text-[15px] leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-charcoal/75' : 'text-ivory/60'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

export function DemoBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`pointer-events-none inline-flex items-center gap-2 bg-obsidian/70 px-3 py-1.5 text-[9px] uppercase tracking-wide2 text-stone backdrop-blur ${className}`}>
      <span className="h-1 w-1 rounded-full bg-gold" /> Demonstration image
    </span>
  );
}

/** Scrolls to the estimate form, optionally preselecting a service. */
export function requestEstimate(service?: string) {
  if (service) window.dispatchEvent(new CustomEvent('ironwood:service', { detail: service }));
  document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth' });
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <path d="M20 2 38 20 20 38 2 20Z" fill="none" stroke="#B69A68" strokeWidth="1.2" />
        <path d="M20 8 32 20 20 32 8 20Z" fill="none" stroke="#B69A68" strokeWidth="0.6" opacity=".6" />
        <rect x="18" y="13" width="4" height="14" fill="#B69A68" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[19px] tracking-[0.28em]">IRONWOOD</span>
        <span className="mt-1 block text-[8px] tracking-[0.42em] text-stone">SURFACE RESTORATION</span>
      </span>
    </span>
  );
}
