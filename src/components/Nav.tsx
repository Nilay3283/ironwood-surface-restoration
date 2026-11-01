import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo, requestEstimate } from './ui';

const LINKS = [
  ['Services', '#services'],
  ['Results', '#results'],
  ['Process', '#process'],
  ['Gallery', '#gallery'],
  ['About', '#about'],
  ['FAQ', '#faq'],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? 'border-b border-ivory/5 bg-obsidian/80 py-3 backdrop-blur-xl' : 'py-6'}`}>
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10" aria-label="Main">
        <a href="#top" aria-label="Ironwood Surface Restoration — home"><Logo /></a>
        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map(([l, h]) => (
            <li key={h}>
              <a href={h} className="group relative text-[11px] uppercase tracking-wide2 text-ivory/70 transition-colors hover:text-ivory">
                {l}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button onClick={() => requestEstimate()} className="btn-gold hidden !px-5 !py-3 sm:inline-flex">Free Estimate</button>
          <button className="p-2 text-ivory lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} strokeWidth={1.2} /></button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-obsidian px-6 py-6 lg:hidden" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu"><X size={24} strokeWidth={1.2} /></button>
            </div>
            <ul className="mt-16 space-y-6">
              {LINKS.map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <a href={h} onClick={() => setOpen(false)} className="font-serif text-4xl uppercase tracking-[0.08em]">{l}</a>
                </motion.li>
              ))}
            </ul>
            <button onClick={() => { setOpen(false); setTimeout(() => requestEstimate(), 50); }} className="btn-gold mt-auto w-full">Request a Free Estimate</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
