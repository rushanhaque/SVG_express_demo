import { ArrowUpRight, Briefcase, Truck } from '@phosphor-icons/react';
import './People.css';
import Img from './ui/Img.jsx';

const COLS = [
  ['team-1', 'scan', 'team-4', 'rider-city'],
  ['field', 'team-7', 'control', 'team-2'],
  ['team-6', 'b2b', 'team-3', 'planning'],
];

export default function People() {
  return (
    <section id="people" className="section ppl" data-nav="light" data-chapter="People">
      <div className="container ppl__grid">
        <div className="ppl__copy">
          <span className="eyebrow">09 · People & partners</span>
          <h2 className="h1" data-split>
            Real trucks. Real people. <span className="serif">Real</span> accountability.
          </h2>
          <p className="lead" data-reveal>
            Drivers, hub crews, field executives and engineers, built up over 24 years around one way of working: take
            ownership, coordinate early and solve it on the ground.
          </p>

          <div className="ppl__cards">
            <a href="#contact" className="ppl__card bezel spot-ring" data-reveal>
              <div className="bezel__core spot ppl__core">
                <span className="ppl__ico">
                  <Briefcase size={20} weight="light" />
                </span>
                <div>
                  <b>Build a career with SVG</b>
                  <small>Operations, field, tech and corporate roles across our network.</small>
                </div>
                <span className="ppl__go">
                  <ArrowUpRight size={18} weight="light" />
                  <ArrowUpRight size={18} weight="light" />
                </span>
              </div>
            </a>
            <a href="#contact" className="ppl__card bezel spot-ring" data-reveal>
              <div className="bezel__core spot ppl__core">
                <span className="ppl__ico ppl__ico--o">
                  <Truck size={20} weight="light" />
                </span>
                <div>
                  <b>Attach your vehicle</b>
                  <small>Consistent daily loads, payment cycles we honour, and no onboarding fees.</small>
                </div>
                <span className="ppl__go">
                  <ArrowUpRight size={18} weight="light" />
                  <ArrowUpRight size={18} weight="light" />
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="ppl__wall" aria-hidden="true">
          {COLS.map((c, i) => (
            <div key={i} className={`ppl__col ppl__col--${i}`}>
              {[...c, ...c].map((img, j) => (
                <div key={j} className="ppl__ph">
                  <Img src={`/img/${img}.webp`} sizes="(max-width: 960px) 33vw, 16vw" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
