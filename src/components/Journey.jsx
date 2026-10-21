import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion';
import { HardHat, Cpu, Truck } from '@phosphor-icons/react';
import { prefersReducedMotion } from '../lib/motion';
import './Journey.css';
import Img from './ui/Img.jsx';

const WIPES = ['inset(100% 0 0 0)', 'inset(0 0 0 100%)', 'inset(0 0 100% 0)', 'inset(0 100% 0 0)', 'inset(50% 50% 50% 50%)', 'inset(100% 0 0 0)'];

const STEPS = [
  { t: 'Pickup', img: '/img/dock-load.webp', g: 'An owned vehicle is dispatched from the nearest SVG hub, with a crew trained on your SOP.', d: 'Pickup scan, auto-generated e-way bill and a dock slot confirmed to your team.' },
  { t: 'Hub sort', img: '/img/kitting.webp', g: 'Consignments are consolidated and sorted at the Jaipur mother hub or a regional spoke.', d: 'Barcode sorting, with a load plan optimised for volume, weight and destination.' },
  { t: 'Linehaul', img: '/img/highway-aerial.webp', g: '32 ft closed-body trucks run fixed-schedule regional routes.', d: 'GPS and geofencing, with the ETA recalculated from the truck every 30 seconds.' },
  { t: 'Destination hub', img: '/img/storage-dock.webp', g: 'Freight is cross-docked at an owned spoke. No third party touches it.', d: 'Exception alerts fire the moment anything misses its cut-off.' },
  { t: 'Last mile', img: '/img/rider-rural.webp', g: 'Local riders, EVs and field teams who know every lane, right down to the village.', d: 'A live tracking link for your customer and an NDR workflow for failed attempts.' },
  { t: 'Proof of delivery', img: '/img/rural-drop.webp', g: 'OTP, signature and photo are captured at the door.', d: 'Digital POD is pushed to your ERP and your MIS updates in real time.' },
];

export default function Journey() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray('.jr__step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (s) => s.isActive && setActive(i),
        });
      });
      if (prefersReducedMotion()) return;
      const st = { trigger: '.jr__steps', start: 'top 55%', end: 'bottom 55%', scrub: 0.6 };
      gsap.fromTo('.jr__rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st });
      gsap.fromTo(
        '.jr__truck',
        { y: 0 },
        { y: () => root.current.querySelector('.jr__rail').offsetHeight, ease: 'none', scrollTrigger: { ...st, invalidateOnRefresh: true } }
      );
    },
    { scope: root }
  );

  return (
    <section className="section jr dark" ref={root} data-nav="dark" data-chapter="Journey" data-sheet>
      <div className="container">
        <div className="shead">
          <div>
            <span className="eyebrow">07 · How a consignment moves</span>
            <h2 className="h1" data-split>
              Every handoff is ours. Every handoff is <span className="serif">visible.</span>
            </h2>
          </div>
          <p className="lead" data-reveal>
            At each stage you'll see two things: the physical asset doing the work, and the digital signal that proves it
            happened.
          </p>
        </div>

        <div className="jr__grid">
          <div className="jr__sticky">
            <div className="jr__visual bezel">
              <div className="bezel__core jr__frame">
                {STEPS.map((s, i) => (
                  <Img key={s.t} src={s.img} alt={s.t} sizes="(max-width: 900px) 100vw, 44vw" style={{ '--from': WIPES[i % WIPES.length] }} className={i === active ? 'is-on' : i < active ? 'is-past' : ''} loading="lazy" />
                ))}
                <div className="jr__hud">
                  <span className="mono jr__odo">
                    Step 0
                    <span className="jr__odo-col">
                      <span style={{ transform: `translateY(calc(${-active} * 1.2em))` }}>
                        {STEPS.map((_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </span>
                    </span>
                    &nbsp;/ 06
                  </span>
                  <b key={active}>{STEPS[active].t}</b>
                </div>
                <div className="jr__ticks">
                  {STEPS.map((s, i) => (
                    <i key={s.t} className={i <= active ? 'is-on' : ''} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="jr__steps">
            <div className="jr__rail" aria-hidden="true">
              <i />
              <span className="jr__truck">
                <Truck size={13} weight="fill" />
              </span>
            </div>
            {STEPS.map((s, i) => (
              <article key={s.t} className={`jr__step ${i === active ? 'is-on' : ''}`}>
                <span className="jr__node" aria-hidden="true" />
                <span className="jr__num mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="jr__t">{s.t}</h3>
                <div className="jr__pair">
                  <div className="jr__col">
                    <span className="mono jr__k">
                      <HardHat size={14} weight="light" /> On the ground
                    </span>
                    <p>{s.g}</p>
                  </div>
                  <div className="jr__col jr__col--d">
                    <span className="mono jr__k">
                      <Cpu size={14} weight="light" /> On eCarry
                    </span>
                    <p>{s.d}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
