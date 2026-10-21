import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, isLite } from './lib/motion';
import scrollToSection from './lib/scrollTo';

import Preloader from './components/Preloader.jsx';
import Nav from './components/Nav.jsx';
import Chapters from './components/Chapters.jsx';
import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import Clients from './components/Clients.jsx';
import Manifesto from './components/Manifesto.jsx';
import Scale from './components/Scale.jsx';
import Infrastructure from './components/Infrastructure.jsx';
import NetworkMap from './components/NetworkMap.jsx';
import Technology from './components/Technology.jsx';
import Services from './components/Services.jsx';
import Journey from './components/Journey.jsx';
import Projects from './components/Projects.jsx';
import People from './components/People.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef(null);

  // Late-loading images change section heights; re-measure every trigger once all are in.
  useEffect(() => {
    const onLoad = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in lockstep.
  // Skipped on lite devices: native scrolling is always the fastest, smoothest option there.
  // Scroll velocity is published on window for velocity-reactive effects.
  useEffect(() => {
    window.__vel = 0;
    if (prefersReducedMotion() || isLite()) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    lenis.on('scroll', (l) => {
      window.__vel = l.velocity;
      ScrollTrigger.update();
    });
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready);
    if (ready) lenisRef.current?.start();
  }, [ready]);

  // Every in-page link scrolls smoothly and lands at the start of pinned scenes.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute('href');
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      scrollToSection(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Pointer-delegated spotlight glow: one listener for the whole page, at most one
  // layout read per animation frame.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let frame = 0;
    let last = null;
    const apply = () => {
      frame = 0;
      const e = last;
      const spot = e.target.closest?.('.spot, .spot-ring');
      if (!spot) return;
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const move = (e) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', move);
    };
  }, []);

  // Off-screen sections stop all their looping work: CSS animations, SVG (SMIL)
  // animations, and anything listening for the `section:visibility` event (GSAP marquees).
  useEffect(() => {
    // (Pinned sections live inside GSAP's .pin-spacer wrappers, hence the second selector.)
    const targets = document.querySelectorAll('main > section, main > .pin-spacer > section, main > .ticker, footer');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target, isIntersecting }) => {
          target.classList.toggle('is-offscreen', !isIntersecting);
          target.querySelectorAll('svg').forEach((svg) => (isIntersecting ? svg.unpauseAnimations?.() : svg.pauseAnimations?.()));
          target.dispatchEvent(new CustomEvent('section:visibility', { detail: isIntersecting }));
        }),
      { rootMargin: '150px 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Frame-rate probe: a slow PC that passed the hardware checks still gets the lite
  // rendering path (the CSS half of it switches live: grain, blur, glass).
  useEffect(() => {
    if (!ready || isLite() || prefersReducedMotion()) return;
    let n = 0;
    let slow = 0;
    let prev = performance.now();
    let id;
    const tick = (t) => {
      if (document.visibilityState === 'visible' && t - prev > 34) slow++; // under ~30fps
      prev = t;
      if (++n < 90) id = requestAnimationFrame(tick);
      else if (slow > 25) document.documentElement.classList.add('lite');
    };
    const start = setTimeout(() => (id = requestAnimationFrame(tick)), 1200); // after the intro settles
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(id);
    };
  }, [ready]);

  // Global storytelling choreography.
  useEffect(() => {
    if (!ready) return;
    const reduce = prefersReducedMotion();
    const lite = isLite();
    let ctx;
    let cancelled = false;
    const offs = [];
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        if (reduce) {
          document.querySelectorAll('[data-inview]').forEach((el) => el.classList.add('is-in'));
          document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = Number(el.dataset.count).toLocaleString('en-IN')));
          return;
        }

        // Headlines: masked lines that rise and un-tilt, like type being set.
        gsap.utils.toArray('[data-split]').forEach((el) => {
          const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          gsap.from(split.lines, {
            yPercent: 115,
            rotate: 3,
            transformOrigin: '0% 100%',
            duration: 1.5,
            stagger: 0.1,
            ease: 'svg.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          });
        });

        // Eyebrows decode themselves on arrival, and again on hover.
        gsap.utils.toArray('.eyebrow').forEach((el) => {
          const txt = el.textContent;
          const run = () =>
            gsap.to(el, { duration: 1.1, scrambleText: { text: txt, chars: 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789', speed: 0.5, revealDelay: 0.15 }, ease: 'none', overwrite: true });
          ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: run });
          el.addEventListener('mouseenter', run);
          offs.push(() => el.removeEventListener('mouseenter', run));
        });

        // Animated blur filters are expensive on weak GPUs; lite gets a pure transform/opacity reveal.
        gsap.set('[data-reveal]', lite ? { y: 48, opacity: 0 } : { y: 56, opacity: 0, filter: 'blur(8px)' });
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { y: 0, opacity: 1, ...(lite ? {} : { filter: 'blur(0px)' }), duration: lite ? 1 : 1.3, stagger: 0.09, ease: 'svg.out', overwrite: true, clearProps: 'filter,transform' }),
        });

        // Dark chapters arrive as a sheet: rounded and inset, flattening to full-bleed.
        // (Full-viewport clip-path scrubs repaint the whole screen every frame — desktop-class GPUs only.)
        if (!lite) gsap.utils.toArray('[data-sheet]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 2.4% 0% 2.4% round 56px 56px 0px 0px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 12%', scrub: true } }
          );
        });

        gsap.utils.toArray('[data-parallax]').forEach((img) => {
          const amt = parseFloat(img.dataset.parallax || '10');
          gsap.fromTo(
            img,
            { yPercent: -amt },
            { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });

        gsap.utils.toArray('[data-inview]').forEach((el) =>
          ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('is-in') })
        );

        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count);
          const dec = (el.dataset.count.split('.')[1] || '').length;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 2.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => {
              el.textContent = obj.v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
            },
          });
        });
      });
      // Pins are created per component; refresh them in page order so spacing stacks correctly.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      offs.forEach((off) => off());
      ctx?.revert();
    };
  }, [ready]);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <div className="grain" aria-hidden="true" />
      <Nav ready={ready} />
      <Chapters ready={ready} />
      <main>
        <Hero ready={ready} />
        <Ticker />
        <Clients />
        <Manifesto />
        <Scale />
        <Infrastructure />
        <NetworkMap />
        <Technology />
        <Services />
        <Journey />
        <Projects />
        <People />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
