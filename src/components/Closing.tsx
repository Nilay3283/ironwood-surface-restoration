import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CONTACT, FAQS, TESTIMONIALS } from '../content';
import SceneImage from './SceneImage';
import { Heading, Logo, Reveal, ease, requestEstimate } from './ui';

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [paused, n]);
  const t = TESTIMONIALS[i];
  return (
    <section id="testimonials" className="relative bg-ivory px-5 py-28 text-obsidian md:px-10 md:py-36" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-5xl text-center">
        <Heading light align="center" eyebrow="Testimonials" title={<>Trust built on<br />quality work.</>} />
        <div className="relative mt-16 min-h-[260px]" aria-live="polite">
          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-[9rem] leading-none text-gold/25">“</span>
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease }}>
              <blockquote className="relative font-serif text-[clamp(1.4rem,3vw,2.3rem)] font-light italic leading-snug text-charcoal">{t.quote}</blockquote>
              <figcaption className="mt-10">
                <div className="mx-auto h-px w-10 bg-gold" />
                <p className="mt-5 text-[11px] uppercase tracking-wide2">{t.name}</p>
                <p className="mt-1 text-xs text-charcoal/50">{t.role}</p>
                {t.placeholder && import.meta.env.DEV && (
                  <p className="mx-auto mt-5 inline-block border border-dashed border-gold px-3 py-1 text-[10px] uppercase tracking-wide2 text-gold">Editable placeholder · src/content.ts</p>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous testimonial" className="border border-obsidian/20 p-3 transition-colors hover:border-gold hover:text-gold"><ArrowLeft size={16} strokeWidth={1.2} /></button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className={`h-px transition-all duration-700 ${k === i ? 'w-10 bg-gold' : 'w-5 bg-obsidian/20'}`} />
            ))}
          </div>
          <button onClick={() => setI((i + 1) % n)} aria-label="Next testimonial" className="border border-obsidian/20 p-3 transition-colors hover:border-gold hover:text-gold"><ArrowRight size={16} strokeWidth={1.2} /></button>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative bg-obsidian px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <div>
          <Heading eyebrow="Questions" title={<>Frequently<br />asked.</>} intro="Can’t find what you’re looking for? Share your question with your estimate request and we’ll be glad to help." />
          <Reveal delay={0.2}><button onClick={() => requestEstimate()} className="btn-ghost mt-10">Ask Us Directly</button></Reveal>
        </div>
        <Reveal delay={0.1}>
          <dl className="border-t border-ivory/10">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-ivory/10">
                  <dt>
                    <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`}
                      className="group flex w-full items-center gap-6 py-7 text-left">
                      <span className="font-serif text-sm italic text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`flex-1 font-serif text-xl font-light transition-colors md:text-2xl ${isOpen ? 'text-ivory' : 'text-ivory/75 group-hover:text-ivory'}`}>{f.q}</span>
                      <Plus size={18} strokeWidth={1.1} className={`shrink-0 text-gold transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
                    </button>
                  </dt>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.dd id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                        <p className="max-w-2xl pb-8 pl-12 text-[15px] leading-relaxed text-ivory/55">{f.a}</p>
                      </motion.dd>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-32 text-center">
      <SceneImage scene={{ kind: 'slab', floor: 'nero', seed: 71, w: 1800, h: 1100 }} alt="" className="!absolute inset-0" imgClassName="scale-110" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,17,17,.55)_0%,rgba(17,17,17,.92)_75%)]" />
      <div className="shimmer pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen" />
      <motion.div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, ease }} />
      <div className="relative z-10 max-w-4xl">
        <Reveal><span className="eyebrow">Begin your restoration</span></Reveal>
        <Reveal delay={0.1}>
          <h2 className="h-display mt-8 text-[clamp(2.4rem,6.5vw,6rem)]">Your surfaces deserve<br /><span className="text-gold">a second life.</span></h2>
        </Reveal>
        <Reveal delay={0.2}><p className="mx-auto mt-8 max-w-md text-ivory/65">Discover the beauty of professionally restored tile, stone, and grout.</p></Reveal>
        <Reveal delay={0.3}>
          <button onClick={() => requestEstimate()} className="btn-gold group mt-12">Start Your Restoration <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></button>
        </Reveal>
      </div>
    </section>
  );
}

function Legal({ kind, onClose }: { kind: 'privacy' | 'terms'; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true">
      <div className="max-w-lg bg-charcoal p-10" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-3xl uppercase tracking-[0.06em]">{kind === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}</h3>
        <div className="gold-rule mt-5" />
        <p className="mt-6 text-sm leading-relaxed text-ivory/60">
          {kind === 'privacy'
            ? 'Placeholder. Information submitted through the estimate form is used only to respond to your inquiry. Replace this text with Ironwood’s full privacy policy before launch.'
            : 'Placeholder. Replace this text with Ironwood’s terms and conditions before launch.'}
        </p>
        <button onClick={onClose} className="btn-ghost mt-8">Close</button>
      </div>
    </motion.div>
  );
}

export function Footer() {
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  const col = 'text-[10px] uppercase tracking-luxe text-gold';
  const link = 'text-sm text-ivory/60 transition-colors hover:text-gold';
  return (
    <footer className="relative border-t border-ivory/10 bg-[#0b0b0b] px-5 pb-10 pt-24 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-6 font-serif text-xl italic text-ivory/70">Restoring the beauty beneath.</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ivory/40">Premium Tile | Stone | Grout Restoration · Est. 2025</p>
            <button onClick={() => requestEstimate()} className="btn-gold mt-8">Request an Estimate</button>
          </div>
          <nav aria-label="Footer">
            <p className={col}>Explore</p>
            <ul className="mt-6 space-y-3">
              {[['Home', '#top'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Contact', '#estimate']].map(([l, h]) => (
                <li key={l}><a href={h} className={link}>{l}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={col}>Contact</p>
            <ul className="mt-6 space-y-4 text-sm text-ivory/60">
              <li><a href={CONTACT.phoneHref} className={`flex items-center gap-3 ${link}`}><Phone size={14} strokeWidth={1.2} className="text-gold" />{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className={`flex items-center gap-3 break-all ${link}`}><Mail size={14} strokeWidth={1.2} className="shrink-0 text-gold" />{CONTACT.email}</a></li>
              <li className="flex items-center gap-3"><MapPin size={14} strokeWidth={1.2} className="text-gold" />{CONTACT.serviceAreas}</li>
            </ul>
          </div>
          <div>
            <p className={col}>Follow</p>
            <div className="mt-6 flex gap-3">
              <a href={CONTACT.instagram} aria-label="Instagram" className="border border-ivory/15 p-3 transition-colors hover:border-gold hover:text-gold"><Instagram size={16} strokeWidth={1.2} /></a>
              <a href={CONTACT.facebook} aria-label="Facebook" className="border border-ivory/15 p-3 transition-colors hover:border-gold hover:text-gold"><Facebook size={16} strokeWidth={1.2} /></a>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-ivory/10 pt-8 text-[11px] text-ivory/35 md:flex-row">
          <p>© {new Date().getFullYear()} Ironwood Surface Restoration. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setLegal('privacy')} className="hover:text-gold">Privacy Policy</button>
            <button onClick={() => setLegal('terms')} className="hover:text-gold">Terms & Conditions</button>
          </div>
        </div>
      </div>
      <AnimatePresence>{legal && <Legal kind={legal} onClose={() => setLegal(null)} />}</AnimatePresence>
    </footer>
  );
}
