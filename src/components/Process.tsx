import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { STEPS } from '../content';
import { Heading } from './ui';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.process-track', start: 'top 75%', end: 'bottom 45%', scrub: 0.8 } });
        tl.fromTo('.process-line', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
        gsap.utils.toArray<HTMLElement>('.process-step').forEach((el, i) => {
          tl.fromTo(el, { opacity: 0.25, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, i * 0.22);
          tl.fromTo(el.querySelector('.process-dot'), { scale: 0.4, backgroundColor: '#252525' }, { scale: 1, backgroundColor: '#B69A68', duration: 0.2 }, i * 0.22 + 0.05);
        });
      });
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.process-vline', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-track', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>('.process-step').forEach((el) => {
          gsap.fromTo(el, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} className="relative bg-ivory px-5 py-28 text-obsidian md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <Heading light eyebrow="Our Restoration Process" title={<>Precision at<br />every step.</>} intro="A considered sequence — from first conversation to final reveal — designed around your material and its condition." />
        <div className="process-track relative mt-20 lg:mt-28">
          {/* horizontal progress line (desktop) */}
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-obsidian/10 lg:block" />
          <div className="process-line absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-gold lg:block" />
          {/* vertical progress line (mobile) */}
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-obsidian/10 lg:hidden" />
          <div className="process-vline absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gold lg:hidden" />
          <ol className="grid gap-14 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((s) => (
              <li key={s.no} className="process-step relative pl-10 lg:pl-0">
                <span className="process-dot absolute left-0 top-0 block h-[15px] w-[15px] rotate-45 border border-gold bg-gold lg:relative" />
                <span className="mt-0 block font-serif text-[5rem] font-light leading-none text-obsidian/10 lg:mt-10">{s.no}</span>
                <h3 className="-mt-6 font-serif text-[1.7rem] uppercase tracking-[0.06em]">{s.title}</h3>
                <div className="mt-5 h-px w-10 bg-gold" />
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-charcoal/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
