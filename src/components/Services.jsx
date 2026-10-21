import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import Button from './ui/Button.jsx';
import Roll from './ui/Roll.jsx';
import './Services.css';
import Img from './ui/Img.jsx';

const SERVICES = [
  { t: 'B2B Freight', s: 'FTL & PTL', d: 'Dedicated or shared trucks on owned linehaul. Your goods go factory to destination with no cross-docking at a stranger\'s yard.', tags: ['19–32 ft', 'E-way bill', 'Live GPS'], img: '/img/trailer.webp' },
  { t: 'D2C Express', s: 'Brands & marketplaces', d: 'From pickup and hub sorting to last mile and doorstep confirmation, all in one network with Shopify and WooCommerce sync.', tags: ['NDR workflow', 'COD', 'Up to 40% lower RTO'], img: '/img/d2c.webp' },
  { t: 'Intra-State Express', s: 'Time-bound regional', d: 'Fast, scheduled distribution across Rajasthan and North India on 400+ routes that run every day.', tags: ['Next-day', 'Route-level SLA'], img: '/img/intra.webp' },
  { t: 'Warehousing & 3PL', s: 'Store · pick · pack', d: 'Integrated storage, inventory management and order fulfilment, sitting right next to the docks that ship it.', tags: ['WMS', 'Kitting', 'Cycle counts'], img: '/img/scan.webp' },
  { t: 'Warehouse-as-a-Service', s: 'Flexible capacity', d: 'Turn fixed real-estate commitments into operating cost. Pay only for the pallet space and fulfilment you use.', tags: ['Per pallet', 'Multi-node'], img: '/img/racks-2.webp' },
  { t: 'Reverse Logistics', s: 'Returns & recalls', d: 'Doorstep pickups, quality checks, refurbishment and restocking, with every step visible to your team.', tags: ['QC at pickup', 'Mass recall'], img: '/img/unload.webp' },
  { t: 'Dedicated EV Fleet', s: 'Branded electric', d: 'Electric vehicles with trained drivers in your livery, sized for city lanes and ready to deploy.', tags: ['Zero tailpipe', 'Your branding'], img: '/img/ev-row.webp' },
  { t: 'Project & Tender Rollouts', s: 'Government & enterprise', d: 'Centralised kitting, permits and multi-route dispatch to hundreds of sites at once, closed out with a signed digital ledger.', tags: ['Kitting', 'Permits', 'Sign-off ledger'], img: '/img/kitting.webp' },
  { t: 'Field Verification', s: 'BFSI & enterprise', d: 'Contact point verification, personal discussions and merchant due diligence, all geo-tagged and audit-ready.', tags: ['CPV', 'PD', 'Due diligence'], img: '/img/field.webp' },
];

export default function Services() {
  const root = useRef(null);
  const media = useRef(null);
  const [cur, setCur] = useState(-1);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = media.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const list = root.current.querySelector('.svc__list');
    const move = (e) => {
      const r = list.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    list.addEventListener('pointermove', move);
    return () => list.removeEventListener('pointermove', move);
  }, []);

  return (
    <section id="solutions" className="section svc lines" ref={root} data-nav="light" data-chapter="Solutions">
      <div className="container">
        <div className="shead">
          <div>
            <span className="eyebrow">06 · Solutions</span>
            <h2 className="h1" data-split>
              One operator for <span className="serif">every</span> leg of the chain.
            </h2>
          </div>
          <div>
            <p className="lead" data-reveal>
              Pick a single service or hand us the whole chain. Either way it runs on the same owned network and the same
              live data.
            </p>
            <div data-reveal>
              <Button variant="ghost-ink" size="sm" href="#contact">
                Build a custom solution
              </Button>
            </div>
          </div>
        </div>

        <div className={`svc__list ${cur > -1 ? 'is-hovering' : ''}`} onMouseLeave={() => setCur(-1)}>
          <div className={`svc__media ${cur > -1 ? 'is-on' : ''}`} ref={media} aria-hidden="true">
            {SERVICES.map((s, i) => (
              <Img key={s.t} src={s.img} sizes="300px" className={i === cur ? 'is-on' : i < cur ? 'is-up' : ''} loading="lazy" />
            ))}
          </div>
          {SERVICES.map((s, i) => (
            <a key={s.t} style={{ '--n': i }} href="#contact" className={`svc__row roll-host ${i === cur ? 'is-on' : ''}`} onMouseEnter={() => setCur(i)} data-reveal>
              <span className="svc__i mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="svc__t">
                <b>
                  <Roll>{s.t}</Roll>
                </b>
                <small className="mono">{s.s}</small>
              </span>
              <span className="svc__d">
                {s.d}
                <span className="svc__tags">
                  {s.tags.map((t) => (
                    <em key={t}>{t}</em>
                  ))}
                </span>
              </span>
              <span className="svc__go">
                <ArrowUpRight size={20} weight="light" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
