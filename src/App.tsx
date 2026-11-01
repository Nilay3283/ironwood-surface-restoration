import About from './components/About';
import BeforeAfter from './components/BeforeAfter';
import { FAQ, FinalCTA, Footer, Testimonials } from './components/Closing';
import Estimate from './components/Estimate';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Process from './components/Process';
import Services from './components/Services';
import Why from './components/Why';

export default function App() {
  return (
    <>
      <a href="#services" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Services />
        <BeforeAfter />
        <Why />
        <Process />
        <Gallery />
        <About />
        <Estimate />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
