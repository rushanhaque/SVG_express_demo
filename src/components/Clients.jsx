import { useRef } from 'react';
import useMarquee from '../lib/useMarquee';
import './Clients.css';

const LOGOS_A = ['jio', 'sony', 'panasonic', 'havells', 'godrej', 'dish-tv', 'vestige'];
const LOGOS_B = ['apollo-pharmacy', 'alkem', 'modicare', 'forever-living', 'karma-healthcare', 'modern-laboratories', 'jawa-pharmaceuticals'];

const label = (s) => s.replace(/-/g, ' ');

function Row({ logos, reverse, duration }) {
  const ref = useRef(null);
  useMarquee(ref, { duration, reverse });
  const set = (k) => (
    <div className="clients__set" key={k} aria-hidden={k > 0}>
      {logos.map((l) => (
        <span className="clients__logo" key={l}>
          <img src={`/logos/mono/${l}.webp`} decoding="async" alt={k === 0 ? label(l) : ''} loading="lazy" />
          <i className="clients__sheen" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="clients__lane">
      <div className="clients__row" ref={ref}>
        {[set(0), set(1)]}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section className="clients" data-nav="light">
      <div className="container clients__head">
        <p className="clients__lede" data-reveal>
          <span className="mono muted">Trusted by 250+ brands</span>
          <span>
            Electronics, telecom, pharma and FMCG leaders move with us, from <em className="serif">factory floor</em> to the
            last village on the route.
          </span>
        </p>
        <div className="clients__sectors mono" data-reveal>
          {['Consumer electronics', 'Telecom', 'Pharma & healthcare', 'FMCG & direct selling', 'BFSI', 'Government'].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
      <div className="clients__marquee" data-reveal>
        <Row logos={LOGOS_A} duration={46} />
        <Row logos={LOGOS_B} duration={52} reverse />
      </div>
    </section>
  );
}
