import { Truck, Warehouse, MapPin, ShieldCheck, Path, UsersThree, Package } from '@phosphor-icons/react';
import { gsap } from '../lib/motion';
import './Scale.css';
import Img from './ui/Img.jsx';

// Hovering a card re-decodes its figure like an odometer flick.
const flick = (e) => {
  const n = e.currentTarget.querySelector('[data-count]');
  if (!n) return;
  const final = Number(n.dataset.count).toLocaleString('en-IN', { minimumFractionDigits: (n.dataset.count.split('.')[1] || '').length });
  gsap.to(n, { duration: 0.7, scrambleText: { text: final, chars: '0123456789', speed: 1 }, ease: 'none', overwrite: true });
};

const Stat = ({ n, suffix = '', dec }) => (
  <span className="stat__n">
    <span data-count={n}>{dec ? '0.0' : '0'}</span>
    <sup>{suffix}</sup>
  </span>
);

export default function Scale() {
  return (
    <section className="section scale lines" data-nav="light" data-chapter="Scale">
      <div className="container">
        <div className="shead">
          <div>
            <span className="eyebrow" data-reveal>
              02 · Scale you can audit
            </span>
            <h2 className="h1" data-split>
              Measured in <span className="serif">steel,</span> square feet and people.
            </h2>
          </div>
          <p className="lead" data-reveal>
            Every number here is something we own and run ourselves. Nothing is resold from a partner and hoped for on the
            day.
          </p>
        </div>

        <div className="scale__grid">
          <article onMouseEnter={flick} className="bezel spot-ring scale__a" data-reveal>
            <div className="bezel__core scale__img">
              <Img src="/img/fleet-docks.webp" alt="SVG Express owned trucks lined up at warehouse docks" sizes="(max-width: 1100px) 100vw, 56vw" data-parallax="8" loading="lazy" />
              <div className="scale__img-shade" />
              <div className="scale__a-body">
                <span className="chip chip--glass">
                  <Truck size={15} weight="light" /> Owned fleet
                </span>
                <div>
                  <Stat n="200" suffix="+" />
                  <p className="stat__l">Active owned vehicles, from 32 ft linehaul trucks to EV three-wheelers.</p>
                  <div className="scale__specs mono">
                    <span>19–32 ft closed body</span>
                    <span>FTL · PTL</span>
                    <span>GPS on every unit</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__b" data-reveal>
            <div className="bezel__core spot stat">
              <div className="stat__top">
                <span className="stat__ico">
                  <Warehouse size={20} weight="light" />
                </span>
                <span className="mono muted">Hub & spoke</span>
              </div>
              <div className="scale__b-row">
                <div>
                  <Stat n="50" suffix="+" />
                  <p className="stat__l">Owned hubs. No third-party handling between your dock and theirs.</p>
                </div>
                <div className="scale__b-img">
                  <Img src="/img/hub-sunset.webp" alt="Owned SVG hub" sizes="260px" loading="lazy" />
                </div>
              </div>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__c" data-reveal>
            <div className="bezel__core spot stat">
              <div className="stat__top">
                <span className="stat__ico">
                  <MapPin size={20} weight="light" />
                </span>
              </div>
              <Stat n="19000" suffix="+" />
              <p className="stat__l">PIN codes reached, with full Tier-2 and Tier-3 coverage.</p>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__d" data-reveal>
            <div className="bezel__core spot stat stat--ink">
              <div className="stat__top">
                <span className="stat__ico">
                  <ShieldCheck size={20} weight="light" />
                </span>
              </div>
              <Stat n="99.8" suffix="%" dec />
              <p className="stat__l">SLA compliance across every PIN code we serve.</p>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__e" data-reveal data-inview>
            <div className="bezel__core spot stat">
              <div className="stat__top">
                <span className="stat__ico">
                  <Package size={20} weight="light" />
                </span>
                <span className="mono muted">Monthly throughput</span>
              </div>
              <div className="bars" aria-hidden="true">
                {[38, 52, 46, 61, 58, 72, 66, 80, 77, 92].map((h, i) => (
                  <i key={i} style={{ '--h': `${h}%`, '--d': `${i * 60}ms` }} />
                ))}
              </div>
              <Stat n="10000" suffix="+ t" />
              <p className="stat__l">Tons of freight moved every month.</p>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__f" data-reveal>
            <div className="bezel__core spot stat">
              <div className="stat__top">
                <span className="stat__ico">
                  <Path size={20} weight="light" />
                </span>
                <span className="mono muted">Daily linehaul</span>
              </div>
              <svg className="routes" viewBox="0 0 300 80" aria-hidden="true">
                <path d="M4 60 C 60 10, 90 70, 150 36 S 240 6, 296 30" />
                <path d="M4 70 C 70 50, 120 76, 170 56 S 250 40, 296 64" />
                <circle r="4" className="routes__dot">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M4 60 C 60 10, 90 70, 150 36 S 240 6, 296 30" />
                </circle>
                <circle r="4" className="routes__dot routes__dot--s">
                  <animateMotion dur="7s" repeatCount="indefinite" path="M4 70 C 70 50, 120 76, 170 56 S 250 40, 296 64" />
                </circle>
              </svg>
              <Stat n="400" suffix="+" />
              <p className="stat__l">Active regional routes running on fixed schedules.</p>
            </div>
          </article>

          <article onMouseEnter={flick} className="bezel spot-ring scale__g" data-reveal>
            <div className="bezel__core spot stat">
              <div className="stat__top">
                <span className="stat__ico">
                  <UsersThree size={20} weight="light" />
                </span>
                <span className="mono muted">On the ground</span>
              </div>
              <div className="avatars" aria-hidden="true">
                {['team-3', 'team-5', 'team-8', 'team-9', 'team-6'].map((t) => (
                  <Img key={t} src={`/img/${t}.webp`} sizes="48px" loading="lazy" />
                ))}
                <span>+500</span>
              </div>
              <Stat n="500" suffix="+" />
              <p className="stat__l">Trained field executives, drivers and hub crews on our own payroll.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
