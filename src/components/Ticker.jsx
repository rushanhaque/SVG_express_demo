import { useRef } from 'react';
import useMarquee from '../lib/useMarquee';
import './Ticker.css';

const ITEMS = [
  ['live', '1,284 consignments in motion'],
  ['', '212 owned vehicles on road'],
  ['', 'Jaipur mother hub · sort accuracy 99.6%'],
  ['signal', 'NH-48 Jaipur → Delhi linehaul · on schedule'],
  ['', '19,000+ PIN codes serviceable'],
  ['', 'Digital POD captured · 4,912 today'],
  ['live', 'Udaipur spoke · 38 dispatches since 06:00'],
  ['', '99.8% SLA compliance · trailing 90 days'],
];

export default function Ticker() {
  const track = useRef(null);
  useMarquee(track, { duration: 60 });
  const row = (k) => (
    <div className="ticker__row" key={k} aria-hidden={k > 0}>
      {ITEMS.map(([t, s], i) => (
        <span key={i} className="ticker__item">
          {t ? <span className={`pulse ${t === 'signal' ? 'pulse--signal' : ''}`} /> : <span className="ticker__dot" />}
          {s}
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker night mono" data-nav="dark">
      <span className="ticker__badge">
        <span className="pulse" /> Network · live
      </span>
      <div className="ticker__viewport">
        <div className="ticker__track" ref={track}>
          {row(0)}
          {row(1)}
        </div>
      </div>
    </div>
  );
}
