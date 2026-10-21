import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, isLite } from '../lib/motion';
import './Preloader.css';

const WORDS = ['Owned fleet', 'Owned hubs', 'Warehousing', 'Last mile', 'eCarry OS'];

export default function Preloader({ onDone }) {
  const root = useRef(null);

  useGSAP(
    () => {
      // Skip on reduced motion and on repeat visits within the same browser session.
      let seen = false;
      try {
        seen = sessionStorage.getItem('svg-intro') === '1';
        sessionStorage.setItem('svg-intro', '1');
      } catch {
        /* storage blocked: just play it */
      }
      if (prefersReducedMotion() || seen) {
        gsap.set(root.current, { display: 'none' });
        onDone();
        return;
      }
      const count = { v: 0 };
      const num = root.current.querySelector('.pl__num');
      const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
      const STEP = 0.21;

      tl.from('.pl__stripe', { scaleX: 0, transformOrigin: 'left center', duration: 0.75, stagger: 0.03 })
        .from('.pl__logo', { opacity: 0, scale: 0.9, duration: 0.7, ease: 'expo.out' }, 0.25)
        .to(count, { v: 100, duration: 1.25, ease: 'power2.inOut', onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, '0')) }, 0)
        .to('.pl__bar i', { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0);

      WORDS.forEach((_, i) => {
        tl.fromTo(`.pl__word:nth-child(${i + 1})`, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'expo.out' }, 0.1 + i * STEP);
        if (i < WORDS.length - 1) tl.to(`.pl__word:nth-child(${i + 1})`, { yPercent: -100, duration: 0.3, ease: 'expo.in' }, 0.1 + (i + 1) * STEP - 0.06);
      });

      tl.to('.pl__logo, .pl__meta', { opacity: 0, y: -20, duration: 0.4, ease: 'expo.in' }, '+=0.05')
        .to('.pl__stripe', { scaleX: 0, transformOrigin: 'right center', duration: 0.6, stagger: { each: 0.025, from: 'end' } }, '<0.05')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onStart: onDone }, '<0.15')
        .set(root.current, { display: 'none' });
      if (isLite()) tl.timeScale(1.3);
    },
    { scope: root }
  );

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl__stripes">
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className="pl__stripe" />
        ))}
      </div>
      <img className="pl__logo" src="/img/logo-white.png" alt="" />
      <div className="pl__meta">
        <div className="pl__words mono">
          {WORDS.map((w) => (
            <span key={w} className="pl__word">
              {w}
            </span>
          ))}
        </div>
        <div className="pl__bar">
          <i />
        </div>
        <div className="pl__row mono">
          <span>Jaipur · Est. 2002</span>
          <span className="pl__num">000</span>
        </div>
      </div>
    </div>
  );
}
