import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion, isLite } from '../lib/motion';
import { Truck, Warehouse, Package, MapPin, IdentificationBadge, SealCheck } from '@phosphor-icons/react';
import './Infrastructure.css';
import Img from './ui/Img.jsx';

const PIN_MQ = '(min-width: 901px)';

const PANELS = [
  {
    k: 'Fleet',
    icon: Truck,
    title: 'Linehaul to last mile, on our own wheels.',
    body: 'A dedicated, owned fleet with elastic capacity on top, so peak season never means a phone call to a broker.',
    img: '/img/highway-fleet.webp',
    alt: 'SVG Express trucks on a highway',
    specs: [['Owned vehicles', '200+'], ['Body types', '19–32 ft closed'], ['Modes', 'FTL · PTL · Express'], ['Telemetry', 'GPS + geofence']],
  },
  {
    k: 'Hubs',
    icon: MapPin,
    title: 'Hub and spoke, 100% owned.',
    body: 'A Jaipur mother hub feeds spokes across Jodhpur, Udaipur, Kota, Sikar and Alwar, with no third-party hands in between.',
    img: '/img/hub-sunset.webp',
    alt: 'SVG Express hub at sunset',
    specs: [['Owned hubs', '50+'], ['Mother hub', 'Jaipur'], ['Offices', '20'], ['Branches', '200+ in North India']],
  },
  {
    k: 'Warehousing',
    icon: Warehouse,
    title: 'Storage that moves with demand.',
    body: 'Integrated 3PL, warehouse-as-a-service and kitting. Inventory sits next to the docks that ship it.',
    img: '/img/racks.webp',
    alt: 'Racked warehouse interior',
    specs: [['Model', '3PL · WaaS'], ['Services', 'Pick · pack · kit'], ['Inventory', 'Live SKU sync'], ['Billing', 'Per pallet, per cycle']],
  },
  {
    k: 'Last mile',
    icon: Package,
    title: 'Beyond the highways.',
    body: 'Big carriers stop at the city limits. Our local teams know the exact roads into Tier-2, Tier-3 and rural India.',
    img: '/img/rural-truck.webp',
    alt: 'SVG Express truck on a rural road',
    specs: [['PIN codes', '19,000+'], ['Rural SLA', '98%+'], ['EV last mile', 'Dedicated fleet'], ['Proof', 'OTP + photo POD']],
  },
  {
    k: 'Field force',
    icon: IdentificationBadge,
    title: '500+ people who show up in person.',
    body: 'Trained executives for appointment deliveries, document collection and verification, every visit geo-tagged.',
    img: '/img/field.webp',
    alt: 'SVG Express field executive verifying documents',
    specs: [['Field executives', '500+'], ['Partners', '3,000+'], ['Evidence', 'GPS + timestamp'], ['Reports', 'Audit-ready']],
  },
];

export default function Infrastructure() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(() => !prefersReducedMotion() && window.matchMedia(PIN_MQ).matches);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_MQ, () => {
        setPinned(true);
        const track = root.current.querySelector('.infra__track');
        const lean = gsap.quickTo(root.current.querySelector('.road__truck i'), 'rotate', { duration: 0.4, ease: 'power2' });
        const dist = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            pin: true,
            refreshPriority: 3, // pinned scenes refresh in page order, even if re-created
            scrub: 1,
            end: () => '+=' + dist(),
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              setActive(Math.min(PANELS.length - 1, Math.round(s.progress * (PANELS.length - 0.6))));
              gsap.set('.road__truck', { left: `${s.progress * 100}%` });
              gsap.set('.road__done', { scaleX: s.progress });
              // Truck leans into the direction of travel
              lean(gsap.utils.clamp(-12, 12, s.getVelocity() / -120));
            },
          },
        });
        gsap.utils.toArray('.infra__panel').forEach((p) => {
          const img = p.querySelector('.infra__img img');
          const st = { trigger: p, containerAnimation: tween, start: 'left 95%', end: 'left 35%', scrub: true };
          if (isLite()) gsap.fromTo(p.querySelector('.infra__img'), { opacity: 0.25 }, { opacity: 1, ease: 'none', scrollTrigger: st });
          else gsap.fromTo(p.querySelector('.infra__img'), { clipPath: 'inset(8% 40% 8% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: st });
          gsap.fromTo(img, { xPercent: -10, scale: 1.2 }, { xPercent: 10, scale: 1, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left' } });
          gsap.from(p.querySelectorAll('.infra__spec, .infra__h, .infra__p, .infra__kicker'), {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 65%' },
          });
          gsap.from(p.querySelector('.infra__num'), { yPercent: 100, duration: 1.2, scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%' } });
        });
        return () => setPinned(false);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="infrastructure" className={`infra dark ${pinned ? 'is-pinned' : ''}`} ref={root} data-nav="dark" data-chapter="Assets">
      <div className="infra__head container">
        <div>
          <span className="eyebrow">03 · Owned infrastructure</span>
          <h2 className="h1 infra__title" data-split>
            The network is <span className="serif">physical.</span>
          </h2>
        </div>
        <div className="infra__meta">
          <p className="lead">Five layers, one owner. Scroll through what actually moves your freight.</p>
          <div className="infra__counter mono">
            <span className="infra__count">
              <span className="infra__digits" style={{ transform: `translateY(${-active * 26}px)` }}>
                {PANELS.map((_, i) => (
                  <span key={i}>0{i + 1}</span>
                ))}
              </span>
            </span>
            <span className="muted-d">/ 0{PANELS.length}</span>
            <span className="infra__k" key={active}>
              {PANELS[active].k}
            </span>
          </div>
        </div>
      </div>

      <div className="infra__track">
        {PANELS.map((p, i) => (
          <article key={p.k} className={`infra__panel bezel ${!pinned || i === active ? 'is-active' : ''}`}>
            <div className="bezel__core infra__core spot">
              <div className="infra__img">
                <Img src={p.img} alt={p.alt} sizes="(max-width: 900px) 100vw, 46vw" loading="lazy" />
                <span className="infra__badge mono">
                  <SealCheck size={14} weight="fill" /> Owned & operated
                </span>
              </div>
              <div className="infra__body">
                <div className="infra__top">
                  <span className="infra__num-m">
                    <span className="infra__num">0{i + 1}</span>
                  </span>
                  <span className="infra__ico">
                    <p.icon size={22} weight="light" />
                  </span>
                </div>
                <span className="mono infra__kicker">{p.k}</span>
                <h3 className="infra__h">{p.title}</h3>
                <p className="infra__p">{p.body}</p>
                <dl className="infra__specs">
                  {p.specs.map(([a, b]) => (
                    <div className="infra__spec" key={a}>
                      <dt className="mono">{a}</dt>
                      <dd>{b}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
        <div className="infra__end">
          <span className="mono muted-d">Next chapter</span>
          <p>
            See where it all <span className="serif">connects</span> ↓
          </p>
        </div>
      </div>

      <div className="road container" aria-hidden="true">
       <div className="road__in">
        <div className="road__line">
          <i className="road__done" />
        </div>
        {PANELS.map((p, i) => (
          <span key={p.k} className={`road__stop ${i <= active ? 'is-on' : ''}`} style={{ left: `${(i / (PANELS.length - 1)) * 100}%` }}>
            <i />
            <em className="mono">{p.k}</em>
          </span>
        ))}
        <span className="road__truck">
          <i>
            <Truck size={14} weight="fill" />
          </i>
        </span>
       </div>
      </div>
    </section>
  );
}
