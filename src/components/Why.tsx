import { Eye, Gem, HeartHandshake, Home, Layers3, Ruler } from 'lucide-react';
import { FEATURES } from '../content';
import { Heading, Reveal } from './ui';

const ICONS = [Eye, Layers3, Gem, HeartHandshake, Ruler, Home];

/** A small marble-faced block that turns in 3D on hover. */
function StoneIcon({ i }: { i: number }) {
  const Icon = ICONS[i];
  return (
    <div className="h-16 w-16 [perspective:400px]">
      <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] [transform:rotateX(-14deg)_rotateY(28deg)] group-hover:[transform:rotateX(-14deg)_rotateY(208deg)]">
        {[0, 90, 180, 270].map((r) => (
          <div key={r} className="absolute inset-0 flex items-center justify-center border border-gold/50 bg-gradient-to-br from-[#2c2a27] via-[#1c1b1a] to-[#121212] shadow-[inset_0_0_20px_rgba(182,154,104,.15)]"
            style={{ transform: `rotateY(${r}deg) translateZ(32px)` }}>
            <Icon size={22} strokeWidth={1.1} className="text-gold" />
          </div>
        ))}
        <div className="absolute inset-0 border border-gold/30 bg-[#2a2723]" style={{ transform: 'rotateX(90deg) translateZ(32px)' }} />
      </div>
    </div>
  );
}

export default function Why() {
  return (
    <section id="why" className="grain relative overflow-hidden bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="mx-auto max-w-[1440px]">
        <Heading align="center" eyebrow="Why Ironwood" title={<>Craftsmanship you can see.<br /><span className="text-gold">Quality you can feel.</span></>} />
        <div className="mt-20 grid border-l border-t border-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08} className="group relative border-b border-r border-ivory/10 p-8 transition-colors duration-700 hover:bg-charcoal/40 md:p-12">
              <span className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-1000 group-hover:w-full" />
              <StoneIcon i={i} />
              <span className="mt-10 block font-serif text-sm italic text-gold">0{i + 1}</span>
              <h3 className="mt-2 font-serif text-2xl font-light uppercase tracking-[0.06em]">{f.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/55">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
