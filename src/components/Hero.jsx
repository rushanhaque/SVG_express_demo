import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion, isLite } from '../lib/motion';
import { ArrowDown, Truck, MagnifyingGlass, CheckCircle, Package, NavigationArrow, Check } from '@phosphor-icons/react';
import Button from './ui/Button.jsx';
import './Hero.css';
import Img from './ui/Img.jsx';

const SLIDES = [
  { img: '/img/hero-highway.webp', k: 'Owned fleet', v: '200+ vehicles on the road', alt: 'SVG Express branded truck on a highway in Rajasthan' },
  { img: '/img/hero-dusk.webp', k: 'Owned hubs', v: '50+ hub-and-spoke nodes', alt: 'SVG Express dispatch hub at dusk with trucks at the docks' },
  { img: '/img/hub-aerial.webp', k: 'Warehousing', v: 'Storage that moves', alt: 'Aerial view of an SVG Express warehouse with loading bays' },
];
const DUR = 6.5;

export default function Hero({ ready }) {
  const root = useRef(null);
  const [idx, setIdx] = useState(0);
  const timer = useRef();

  // Slideshow: a wipe that travels left, with a slow push-in on the new frame.
  useEffect(() => {
    if (!ready) return;
    const slides = root.current.querySelectorAll('.hero__slide');
    if (prefersReducedMotion()) {
      slides.forEach((s, i) => gsap.set(s, { zIndex: i === idx ? 2 : 1, clipPath: 'none' }));
      return;
    }
    const lite = isLite();
    slides.forEach((s, i) => {
      if (i === idx) {
        gsap.set(s, { zIndex: 2 });
        // Full-screen clip-path wipes repaint every frame; lite devices get a GPU-only crossfade.
        if (lite) gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });
        else gsap.fromTo(s, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.6, ease: 'svg.cine' });
        gsap.fromTo(s.querySelector('img'), { scale: 1.3, xPercent: 4 }, { scale: 1.06, xPercent: 0, duration: DUR + 1.6, ease: 'power1.out' });
      } else {
        gsap.set(s, { zIndex: 1 });
      }
    });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), DUR * 1000);
    return () => clearTimeout(timer.current);
  }, [idx, ready]);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      // Intro — the headline is "set" line by line, then the underline is drawn under "owned".
      const tl = gsap.timeline({ defaults: { ease: 'svg.out' } });
      tl.from('.hl__in', { yPercent: 118, rotate: 4, transformOrigin: '0% 100%', duration: 1.8, stagger: 0.14 }, 0.15)
        .from('.hero__top > *', { y: 20, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.5)
        .from('.hero__lead, .hero__ctas', { y: 30, opacity: 0, duration: 1.4, stagger: 0.1 }, 0.75)
        .from('.track', { y: 80, rotate: 2, opacity: 0, duration: 1.7 }, 0.85)
        .from('.hero__chapter, .hero__cue', { y: 30, opacity: 0, duration: 1.2, stagger: 0.08 }, 1.05)
        .from('.hero__gridline', { scaleY: 0, transformOrigin: 'top', duration: 2.2, stagger: 0.07, ease: 'svg.cine' }, 0)
        .from('.hero__swash path', { drawSVG: '0%', duration: 1.4, ease: 'power2.inOut' }, 1.3);

      // Exit — the frame pulls back into a rounded plate while the headline lines drift apart.
      const out = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      out
        .to('.hero__media', isLite() ? { yPercent: 14 } : { clipPath: 'inset(4% 2.5% 10% 2.5% round 40px)', yPercent: 14 }, 0)
        .to('.hl:nth-child(1)', { xPercent: -10, opacity: 0.15 }, 0)
        .to('.hl:nth-child(2)', { xPercent: 8, opacity: 0.15 }, 0)
        .to('.hero__left', { y: -80, opacity: 0 }, 0)
        .to('.hero__trackwrap', { y: -160, rotate: -4, opacity: 0 }, 0)
        .to('.hero__chapters, .hero__top', { opacity: 0, y: -30 }, 0);

      // Pointer depth — media, gridlines and card sit on different planes.
      const mx = gsap.quickTo('.hero__depth', 'x', { duration: 1.2, ease: 'power3' });
      const my = gsap.quickTo('.hero__depth', 'y', { duration: 1.2, ease: 'power3' });
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        mx(nx * -24);
        my(ny * -16);
      };
      root.current.addEventListener('pointermove', move);
      return () => root.current?.removeEventListener('pointermove', move);
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <section id="top" className="hero night" ref={root} data-nav="dark" data-chapter="Intro">
      <div className="hero__media">
        <div className="hero__depth">
          {SLIDES.map((s, i) => (
            <div key={s.img} className="hero__slide" style={{ zIndex: i === 0 ? 2 : 1 }}>
              <Img src={s.img} alt={s.alt} sizes="100vw" fetchpriority={i === 0 ? 'high' : 'low'} />
            </div>
          ))}
        </div>
        <div className="hero__shade" />
      </div>

      <div className="hero__grid container" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="hero__gridline" />
        ))}
      </div>

      <div className="hero__content container">
        <div className="hero__top">
          <span className="eyebrow eyebrow--dark">Asset-backed logistics · Est. 2002</span>
          <span className="mono hero__coord">
            <NavigationArrow size={12} weight="fill" /> 26.9124° N, 75.7873° E — Jaipur mother hub
          </span>
        </div>

        <div className="hero__main">
          <h1 className="display hero__title">
            <span className="hl">
              <span className="hl__in">India's supply chain,</span>
            </span>
            <span className="hl">
              <span className="hl__in">
                <span className="serif hero__owned">
                  owned
                  <svg className="hero__swash" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M4 20 C 60 6, 140 4, 296 14" />
                  </svg>
                </span>{' '}
                end to end.
              </span>
            </span>
          </h1>
          <div className="hero__left">
            <p className="lead hero__lead">
              Our trucks. Our hubs. Our warehouses. Our people on the ground. All run on <b>eCarry</b>, the logistics system
              we built in-house, so you get one accountable operator and live visibility from first mile to doorstep.
            </p>
            <div className="hero__ctas">
              <Button variant="mint" href="#contact">Talk to a logistics expert</Button>
              <Button variant="ghost" href="#network" icon={ArrowDown}>
                See the network
              </Button>
            </div>
          </div>

          {/* The wrapper takes the scroll-exit so it never fights the card's own intro tween */}
          <div className="hero__trackwrap">
            <TrackCard />
          </div>
        </div>
      </div>

      <div className="hero__chapters container">
        {SLIDES.map((s, i) => (
          <button key={s.k} className={`hero__chapter ${i === idx ? 'is-on' : ''}`} onClick={() => setIdx(i)}>
            <span className="hero__thumb" aria-hidden="true">
              <Img src={s.img} sizes="170px" loading="lazy" />
            </span>
            <span className="hero__bar">
              <i style={{ animationDuration: `${DUR}s` }} key={i === idx ? `on-${idx}` : 'off'} />
            </span>
            <span className="mono">0{i + 1} — {s.k}</span>
            <span className="hero__chapter-v">{s.v}</span>
          </button>
        ))}
        <span className="hero__cue mono" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </span>
      </div>
    </section>
  );
}

const TABS = ['AWB', 'Mobile', 'Order ID'];
const STEPS = [
  { icon: Package, t: 'Picked up', s: 'Sitapura, Jaipur · 06:12' },
  { icon: CheckCircle, t: 'Sorted at hub', s: 'Jaipur mother hub · 08:40' },
  { icon: Truck, t: 'Linehaul', s: 'NH-21 via Agra · on time' },
  { icon: CheckCircle, t: 'Out for delivery', s: 'Lucknow · ETA 18:40' },
];

function TrackCard() {
  const [tab, setTab] = useState('AWB');
  const [val, setVal] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | found
  const [run, setRun] = useState(0);
  const tabsRef = useRef(null);
  const ind = useRef(null);

  const timer = useRef();

  // Sliding tab indicator — re-measured once the web font lands and on resize,
  // since both change the tab widths.
  useLayoutEffect(() => {
    const place = () => {
      const btn = tabsRef.current?.querySelector(`[data-tab="${tab}"]`);
      if (!btn || !ind.current) return;
      ind.current.style.width = `${btn.offsetWidth}px`;
      ind.current.style.transform = `translateX(${btn.offsetLeft - 3}px)`;
    };
    place();
    let live = true;
    document.fonts?.ready.then(() => live && place());
    window.addEventListener('resize', place);
    return () => {
      live = false;
      window.removeEventListener('resize', place);
    };
  }, [tab]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    timer.current = setTimeout(() => {
      setState('found');
      setRun((r) => r + 1);
    }, 1100);
  };

  const valid = val.replace(/\s/g, '').length >= 6;
  const id = state === 'found' && val ? val.toUpperCase().slice(0, 16) : 'SVGX 2408 1173';

  return (
    <div className="track bezel bezel--dark">
      <div className="bezel__core track__core">
        <div className="track__head">
          <span className="mono track__label">
            <span className="pulse" /> Track a consignment
          </span>
          <div className="track__tabs" role="tablist" ref={tabsRef}>
            <span className="track__ind" ref={ind} aria-hidden="true" />
            {TABS.map((t) => (
              <button key={t} data-tab={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <form className={`track__form ${valid ? 'is-valid' : ''}`} onSubmit={submit}>
          <MagnifyingGlass size={18} weight="light" className="track__glass" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={tab === 'AWB' ? 'Enter AWB number' : tab === 'Mobile' ? '10-digit mobile number' : 'Enter order ID'}
            aria-label="Tracking input"
          />
          <span className="track__ok" aria-hidden="true">
            <Check size={12} weight="bold" />
          </span>
          <button type="submit" className={`track__go is-${state}`}>
            <span className="track__go-t">Track</span>
            <span className="track__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </form>

        <div className={`track__live ${state === 'found' ? 'is-found' : ''}`} key={run}>
          <div className="track__row">
            <span className="mono muted-d">{id}</span>
            <span className="track__status">
              <span className="pulse pulse--signal" /> {state === 'found' ? 'Located · in transit' : 'In transit'}
            </span>
          </div>
          <div className="track__route">
            <b>JAI</b>
            <span className="track__line">
              <i className="track__fill" />
              <span className="track__truck">
                <Truck size={14} weight="fill" />
              </span>
            </span>
            <b>LKO</b>
          </div>
          <ul className="track__steps">
            {STEPS.map((s, i) => (
              <li key={s.t} className={i < 3 ? 'done' : ''} style={{ '--d': `${i * 90}ms` }}>
                <s.icon size={15} weight={i < 3 ? 'fill' : 'light'} />
                <span>
                  <b>{s.t}</b>
                  <small>{s.s}</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="track__foot mono">
            <span>RJ14 · 32 ft FTL</span>
            <span className="track__owned">Owned vehicle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
