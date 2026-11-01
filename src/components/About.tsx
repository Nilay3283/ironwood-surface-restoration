import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SceneImage from './SceneImage';
import { DemoBadge, Heading, Reveal } from './ui';

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-[#0e0e0e] px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.div style={{ y }} className="absolute -inset-[8%]">
              <SceneImage scene={{ kind: 'slab', floor: 'statuario', seed: 61, w: 1000, h: 1250 }} alt="Close study of polished statuario marble" className="h-full" />
            </motion.div>
            <DemoBadge className="absolute left-4 top-4" />
          </div>
          <motion.div style={{ y: y2 }} className="absolute -bottom-10 -right-4 hidden w-[42%] border-8 border-[#0e0e0e] md:block">
            <SceneImage scene={{ kind: 'detail', floor: 'nero', seed: 62, w: 600, h: 750 }} alt="Nero marquina marble detail" className="aspect-[4/5]" />
          </motion.div>
          <div className="absolute -left-4 -top-4 h-24 w-24 border-l border-t border-gold/60" />
        </div>
        <div>
          <Heading eyebrow="About Ironwood · Est. 2025" title={<>Built on craftsmanship.<br /><span className="text-gold">Defined by detail.</span></>} />
          <Reveal delay={0.2} className="mt-10 space-y-6 text-[15px] leading-[1.9] text-ivory/65">
            <p>
              <span className="float-left mr-3 mt-1 font-serif text-6xl leading-[0.8] text-gold">A</span>t Ironwood Surface Restoration, we believe every surface deserves expert attention. Established in 2025, our mission is to help homeowners and businesses rediscover the beauty of their tile, stone, and grout through professional restoration and attention to detail.
            </p>
            <p>We combine quality-focused workmanship, thoughtful service, and a passion for beautiful surfaces to deliver results that make a lasting impression.</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-12 grid grid-cols-3 border-t border-ivory/10 pt-8">
            {[['Tile', 'Porcelain · Ceramic'], ['Stone', 'Marble · Travertine'], ['Grout', 'Clean · Color · Seal']].map(([a, b]) => (
              <div key={a}>
                <p className="font-serif text-2xl uppercase tracking-[0.08em]">{a}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide2 text-ivory/40">{b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
