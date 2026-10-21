import { useEffect, useRef, useState } from 'react';
import { gsap, Draggable, prefersReducedMotion } from '../lib/motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, HandGrabbing } from '@phosphor-icons/react';
import './Projects.css';
import Img from './ui/Img.jsx';

const PROJECTS = [
  { tag: 'Government tender', t: 'Rural school meal kits', m: '60,000+', mu: 'kits delivered', d: 'Kitted centrally, then delivered to rural schools across Rajasthan under strict tender SLAs.', img: '/img/mealkits.webp' },
  { tag: 'Law enforcement', t: 'Police station tech rollout', m: '100s', mu: 'stations, one window', d: 'Complete PC workstations kitted and dispatched to police stations at the same time.', img: '/img/police.webp' },
  { tag: 'Education', t: 'Government lab deployments', m: 'Install-ready', mu: 'lab kits', d: 'Lab kits delivered, unloaded and signed off at government schools, with digital proof for audit.', img: '/img/lab.webp' },
  { tag: 'Specialised cargo', t: 'An ATM, up a mountain', m: 'Remote', mu: 'high-altitude site', d: 'High-value, fragile cargo taken where no truck can go, with permits arranged in advance.', img: '/img/atm.webp' },
  { tag: 'Where we began', t: 'Telecom bulk distribution', m: 'Since 2002', mu: 'across Rajasthan', d: 'The problem SVG Express was founded to solve: bulk distribution that reaches every district.', img: '/img/bulk.webp' },
  { tag: 'Dedicated fleet', t: 'Branded EV last mile', m: 'Zero', mu: 'tailpipe emissions', d: 'Electric three-wheelers in client livery with trained drivers, deployed on dense urban lanes.', img: '/img/ev-fleet.webp' },
];

export default function Projects() {
  const viewport = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const drag = useRef(null);
  const [used, setUsed] = useState(false);

  const setBar = (x) => {
    const minX = Math.min(0, viewport.current.clientWidth - track.current.scrollWidth);
    const p = minX ? gsap.utils.clamp(0, 1, x / minX) : 0;
    bar.current.style.transform = `scaleX(${0.08 + p * 0.92})`;
  };

  useEffect(() => {
    const el = track.current;
    const vp = viewport.current;
    const bounds = () => ({ minX: Math.min(0, vp.clientWidth - el.scrollWidth), maxX: 0 });
    const sync = function () {
      setBar(this.x);
    };
    const [d] = Draggable.create(el, {
      type: 'x',
      bounds: bounds(),
      inertia: !prefersReducedMotion(),
      edgeResistance: 0.85,
      onPress() {
        el.classList.add('is-drag');
      },
      onDragStart: () => setUsed(true),
      onDrag: sync,
      onThrowUpdate: sync,
      onRelease() {
        el.classList.remove('is-drag');
      },
    });
    drag.current = d;
    const onResize = () => d.applyBounds(bounds());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      d.kill();
    };
  }, []);

  const nudge = (dir) => {
    const d = drag.current;
    const el = track.current;
    const card = el.querySelector('.pj__card');
    const minX = Math.min(0, viewport.current.clientWidth - el.scrollWidth);
    const x = gsap.utils.clamp(minX, 0, gsap.getProperty(el, 'x') - dir * (card.offsetWidth + 16));
    setUsed(true);
    setBar(x);
    gsap.to(el, { x, duration: 1.1, ease: 'svg.out', onComplete: () => d.update() });
  };

  const flick = (e) => {
    const b = e.currentTarget.querySelector('.pj__metric b');
    gsap.to(b, { duration: 0.6, scrambleText: { text: b.dataset.v, chars: '0123456789+', speed: 1 }, ease: 'none', overwrite: true });
  };

  return (
    <section id="projects" className="section pj lines" data-nav="light" data-chapter="Proof">
      <div className="container pj__head">
        <div>
          <span className="eyebrow">08 · Projects & proof</span>
          <h2 className="h1" data-split>
            Built for the deliveries <span className="serif">others</span> turn down.
          </h2>
        </div>
        <div className="pj__ctrl" data-reveal>
          <span className={`pj__hint mono ${used ? 'is-gone' : ''}`}>
            <HandGrabbing size={16} weight="light" /> Drag to explore
          </span>
          <div className="pj__progress">
            <i ref={bar} />
          </div>
          <button className="pj__btn" onClick={() => nudge(-1)} aria-label="Previous project">
            <ArrowLeft size={18} weight="light" />
          </button>
          <button className="pj__btn" onClick={() => nudge(1)} aria-label="Next project">
            <ArrowRight size={18} weight="light" />
          </button>
        </div>
      </div>

      <div className="pj__viewport" ref={viewport}>
        <div className="pj__track" ref={track}>
          {PROJECTS.map((p, i) => (
            <article key={p.t} className="pj__card" onMouseEnter={flick}>
              <div className="pj__img">
                <Img src={p.img} alt={p.t} sizes="(max-width: 720px) 80vw, 440px" loading="lazy" draggable="false" />
                <span className="pj__tag mono">{p.tag}</span>
                <span className="pj__n mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="pj__over">
                  <p>{p.d}</p>
                  <span className="pj__view mono">
                    View project <ArrowUpRight size={14} weight="light" />
                  </span>
                </div>
              </div>
              <div className="pj__body">
                <div className="pj__metric">
                  <b data-v={p.m}>{p.m}</b>
                  <span className="mono">{p.mu}</span>
                </div>
                <h3 className="pj__t">{p.t}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
