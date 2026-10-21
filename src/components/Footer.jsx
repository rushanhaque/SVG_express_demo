import { useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '../lib/motion';
import { ArrowUp, ArrowRight, ArrowUpRight, LinkedinLogo, InstagramLogo, YoutubeLogo, XLogo } from '@phosphor-icons/react';
import './Footer.css';

const COLS = [
  { h: 'Solutions', l: ['B2B Freight · FTL & PTL', 'D2C Express', 'Intra-State Express', 'Warehousing & 3PL', 'Reverse Logistics', 'Dedicated EV Fleet'] },
  { h: 'Network', l: ['Owned fleet', 'Hubs & branches', 'Coverage map', 'Project rollouts', 'Field verification'] },
  { h: 'Company', l: ['About SVG', 'Careers', 'Attach your vehicle', 'eMitra & AEPS services', 'Contact'] },
  { h: 'Support', l: ['Track a shipment', 'Client login · eCarry', 'API documentation', 'FAQs', 'Raise a ticket'] },
];
const R = 20;
const C = 2 * Math.PI * R;

export default function Footer() {
  const root = useRef(null);
  const ring = useRef(null);

  useGSAP(
    () => {
      // Back-to-top doubles as a page-progress ring.
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (s) => ring.current && (ring.current.style.strokeDashoffset = String(C * (1 - s.progress))),
      });
      if (prefersReducedMotion()) return;
      let live = true;
      let cleanup = () => {};
      document.fonts.ready.then(() => {
        if (!live) return;
        const word = root.current.querySelector('.ft__word');
        const split = SplitText.create(word, { type: 'chars', charsClass: 'ft__ch' });
        const intro = gsap.from(split.chars, {
          yPercent: 110,
          rotate: 8,
          opacity: 0,
          duration: 1.5,
          stagger: 0.045,
          ease: 'svg.out',
          scrollTrigger: { trigger: word, start: 'top 95%', once: true },
        });
        // Proximity: letters near the pointer rise and brighten.
        const ys = split.chars.map((c) => gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3' }));
        // Letter centres are cached on enter (and on resize) and the maths runs once per frame.
        let centres = [];
        const measure = () => {
          centres = split.chars.map((c) => {
            const r = c.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + r.height / 2 - (gsap.getProperty(c, 'y') || 0)];
          });
        };
        let frame = 0;
        let px = 0;
        let py = 0;
        let stale = true;
        const markStale = () => (stale = true);
        const paint = () => {
          frame = 0;
          if (stale) {
            measure();
            stale = false;
          }
          split.chars.forEach((c, i) => {
            const [cx, cy] = centres[i];
            const d = Math.hypot(px - cx, (py - cy) * 0.6);
            const k = Math.max(0, 1 - d / 320);
            ys[i](-k * 46);
            c.style.setProperty('--k', k.toFixed(2));
          });
        };
        const move = (e) => {
          px = e.clientX;
          py = e.clientY;
          if (!frame) frame = requestAnimationFrame(paint);
        };
        const enter = markStale;
        word.addEventListener('pointerenter', enter);
        window.addEventListener('scroll', markStale, { passive: true });
        const leave = () => split.chars.forEach((c, i) => (ys[i](0), c.style.setProperty('--k', 0)));
        word.addEventListener('pointermove', move);
        word.addEventListener('pointerleave', leave);
        cleanup = () => {
          cancelAnimationFrame(frame);
          word.removeEventListener('pointermove', move);
          word.removeEventListener('pointerleave', leave);
          word.removeEventListener('pointerenter', enter);
          window.removeEventListener('scroll', markStale);
          intro.scrollTrigger?.kill();
          intro.kill();
          split.revert();
        };
      });
      return () => {
        live = false;
        cleanup();
      };
    },
    { scope: root }
  );

  const top = (e) => {
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 2.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="ft night" ref={root} data-nav="dark">
      <div className="container">
        <div className="ft__top">
          <div className="ft__brand">
            <img src="/img/logo-white.png" alt="SVG Express" className="ft__logo" />
            <p>Asset-backed logistics and supply chain, run on technology. Jaipur, since 2002.</p>
            <form className="ft__news" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Work email for network updates" aria-label="Email for updates" />
              <button aria-label="Subscribe">
                <ArrowRight size={18} weight="light" />
              </button>
            </form>
          </div>
          {COLS.map((c) => (
            <div key={c.h} className="ft__col">
              <span className="mono">{c.h}</span>
              <ul>
                {c.l.map((x) => (
                  <li key={x}>
                    <a href="#top" className="ft__link">
                      <ArrowUpRight size={13} weight="light" className="ft__arr" />
                      <span>{x}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ft__word" aria-hidden="true">
          SVG Express
        </div>

        <div className="ft__bar mono">
          <span>© 2026 SVG Express Services Pvt. Ltd. · Jaipur, Rajasthan 302001</span>
          <span className="ft__legal">
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Cookies</a>
          </span>
          <span className="ft__social">
            {[LinkedinLogo, InstagramLogo, YoutubeLogo, XLogo].map((I, i) => (
              <a key={i} href="#top" aria-label="Social link">
                <I size={16} weight="light" />
              </a>
            ))}
          </span>
          <a href="#top" className="ft__up" onClick={top} aria-label="Back to top">
            <svg viewBox="0 0 48 48" className="ft__ring" aria-hidden="true">
              <circle cx="24" cy="24" r={R} />
              <circle cx="24" cy="24" r={R} ref={ring} style={{ strokeDasharray: C, strokeDashoffset: C }} />
            </svg>
            <ArrowUp size={16} weight="light" />
          </a>
        </div>
      </div>
    </footer>
  );
}
