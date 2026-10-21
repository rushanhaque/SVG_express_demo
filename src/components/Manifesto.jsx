import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion';
import { ArrowRight, Truck } from '@phosphor-icons/react';
import './Manifesto.css';
import Img from './ui/Img.jsx';

// Strings render as scrubbed words; objects render as inline image "pills".
const TEXT = [
  "We don't broker capacity.",
  { img: '/img/trailer.webp', alt: 'SVG Express trailer truck', cap: 'Owned trailer · 32 ft' },
  'We own it: 200+ vehicles, 50+ hubs',
  { img: '/img/hub-sunset.webp', alt: 'SVG Express hub at sunset', cap: 'Owned hub · Rajasthan' },
  'and warehouses run by 500+ of our own people.',
  { img: '/img/team-1.webp', alt: 'SVG Express team', cap: 'Our people' },
  'Then we built the technology',
  { img: '/img/control.webp', alt: 'SVG Express operations control room', cap: 'eCarry control tower' },
  'that makes every kilometre visible to you.',
];
const KEY = ['own', 'it:', 'visible'];

export default function Manifesto() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      const build = (pin) => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: pin
            ? { trigger: root.current, start: 'top top', end: '+=140%', pin: true, scrub: 0.8, refreshPriority: 4 }
            : { trigger: '.mf__text', start: 'top 80%', end: 'bottom 55%', scrub: 0.8 },
        });
        // Walk the sentence in reading order so pills open exactly where they sit.
        root.current.querySelectorAll('.mf__text > *').forEach((el) => {
          if (el.classList.contains('mf__w')) {
            tl.fromTo(el, { opacity: 0.1, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, '>-0.22');
            if (el.classList.contains('is-key')) tl.fromTo(el, { color: '#0b1a12' }, { color: '#2f8f5b', duration: 0.2 }, '<');
          } else {
            tl.fromTo(el, { clipPath: 'inset(0 50% 0 50% round 999px)' }, { clipPath: 'inset(0 0% 0 0% round 999px)', duration: 0.6 }, '>-0.2').fromTo(
              el.querySelector('img'),
              { scale: 1.7 },
              { scale: 1, duration: 0.8 },
              '<'
            );
          }
        });
        tl.from('.mf__foot', { opacity: 0, y: 40, duration: 1 }).from('.mf__seal', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)' }, '<0.2');
      };
      mm.add('(min-width: 901px) and (min-height: 700px)', () => build(true));
      mm.add('(max-width: 900px), (max-height: 699px)', () => build(false));
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="mf lines" ref={root} data-nav="light" data-chapter="Origin">
      <div className="container mf__inner">
        <span className="eyebrow">01 · The SVG difference</span>
        <p className="mf__text">
          {TEXT.map((t, i) =>
            typeof t === 'string' ? (
              t.split(' ').map((w, j) => (
                <span className={`mf__w ${KEY.includes(w) ? 'is-key' : ''}`} key={`${i}-${j}`}>
                  {w}{' '}
                </span>
              ))
            ) : (
              <span className="mf__pill" key={i}>
                <Img src={t.img} alt={t.alt} sizes="180px" loading="lazy" />
                <span className="mf__cap mono">{t.cap}</span>
              </span>
            )
          )}
        </p>
        <div className="mf__foot">
          <div className="mf__stamp">
            <span className="mf__seal" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text>
                  <textPath href="#seal">OWNED · OPERATED · ACCOUNTABLE · </textPath>
                </text>
              </svg>
              <b>
                <Truck size={18} weight="light" />
              </b>
            </span>
            <span>
              <span className="mono muted">Est. 2002</span>
              <span className="mf__stamp-big">Jaipur, Rajasthan</span>
            </span>
          </div>
          <p className="lead">
            SVG Express started out solving bulk distribution for telecom companies across Rajasthan. Twenty-four years on,
            the idea hasn't changed: when the fleet, the hub and the software all belong to one operator, nothing falls
            between the cracks.
          </p>
          <a href="#people" className="tlink">
            Our story <ArrowRight size={16} weight="light" />
          </a>
        </div>
      </div>
    </section>
  );
}
