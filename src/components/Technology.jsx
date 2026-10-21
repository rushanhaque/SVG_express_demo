import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion';
import {
  SquaresFour, Package, Truck, Warehouse, MapPin, Receipt, ChartLineUp, Camera, Plugs, ArrowsCounterClockwise,
  Barcode, CheckCircle, WarningCircle, Lightning, Gauge, Code, FileText, Broadcast, Signature,
} from '@phosphor-icons/react';
import { STATES } from '../data/indiaMap.js';
import './Technology.css';
import Img from './ui/Img.jsx';

const PIN_MQ = '(min-width: 1101px) and (min-height: 740px)';

const CAPS = [
  { t: 'Every owned truck reports in', d: 'GPS and geofence from all 212 vehicles on the road' },
  { t: 'Every hub reports throughput', d: 'Sort and dispatch load across our own hubs' },
  { t: 'Every consignment, live', d: 'Lane, vehicle, status and ETA, refreshed every 15s' },
  { t: 'Exceptions surface first', d: 'POD, ERP sync, geofence and RTO alerts as they happen' },
];

const ROWS = [
  ['SVGX 2408 1173', 'Havells', 'JAI → LKO', 'RJ14 GT 4471', 'In transit', '18:40'],
  ['SVGX 2408 1188', 'Panasonic', 'JAI → JDH', 'RJ14 KC 2290', 'Out for delivery', '13:15'],
  ['SVGX 2408 1204', 'Apollo', 'JAI → UDR', 'RJ27 GB 8812', 'Delivered', 'POD ✓'],
  ['SVGX 2408 1219', 'Vestige', 'DEL → CHD', 'HR55 AK 1033', 'At hub', '21:05'],
];

function rajasthan() {
  const s = STATES.find((x) => x.name === 'Rajasthan');
  const nums = s.d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return { d: s.d, vb: `${x0 - 6} ${y0 - 6} ${x1 - x0 + 12} ${y1 - y0 + 12}`, x0, y0, w: x1 - x0, h: y1 - y0 };
}

export default function Technology() {
  const root = useRef(null);
  const rj = useMemo(rajasthan, []);

  const [cap, setCap] = useState(-1);
  // Caption rail only "plays" while the scene is pinned; start in the right mode to avoid a layout shift.
  const [pinned, setPinned] = useState(() => !prefersReducedMotion() && window.matchMedia(PIN_MQ).matches);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Desktop: a pinned scene where the control tower assembles, one signal at a time.
      mm.add(PIN_MQ, () => {
        const stage = q('.tech__stage')[0];
        const fit = () => {
          const d = q('.dash')[0];
          const avail = window.innerHeight - 200;
          const sc = Math.min(1, avail / d.offsetHeight);
          stage.style.setProperty('--fit', sc.toFixed(3));
        };
        fit();
        setPinned(true);
        window.addEventListener('resize', fit);
        gsap.set(q('.dash__panel, .dash__kpis'), { opacity: 0.18 });
        gsap.set(q('.float'), { opacity: 0, scale: 0.7, y: 30 });
        gsap.set(q('.dash__area-line'), { drawSVG: '0%' });
        gsap.set(q('.dash__hubbar i'), { scaleX: 0, transformOrigin: 'left' });
        gsap.set(q('.dash__tr'), { opacity: 0, x: -24 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=300%',
            pin: true,
            refreshPriority: 1, // pinned scenes refresh in page order, even if re-created
            scrub: 1,
          },
          onUpdate: () => {
            const t = tl.time();
            setCap(t < 1 ? -1 : t < 2.6 ? 0 : t < 4.2 ? 1 : t < 5.8 ? 2 : 3);
          },
        });
        tl.fromTo(q('.dash'), { rotateX: 28, scale: 0.84, y: 90, opacity: 0.4 }, { rotateX: 0, scale: 1, y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
          .to(q('.dash__kpis'), { opacity: 1, duration: 0.4 }, 0.6)
          // 01 — fleet
          .to(q('.dash__map'), { opacity: 1, duration: 0.4 }, 1)
          .fromTo(q('.dash__map'), { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1)
          .to(q('.cap:nth-child(1) .cap__bar i'), { scaleX: 1, duration: 1.6 }, 1)
          // 02 — hubs
          .to(q('.dash__map'), { opacity: 0.55, duration: 0.3 }, 2.6)
          .to(q('.dash__chart'), { opacity: 1, duration: 0.4 }, 2.6)
          .to(q('.dash__area-line'), { drawSVG: '100%', duration: 1, ease: 'power1.inOut' }, 2.7)
          .to(q('.dash__hubbar i'), { scaleX: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 3)
          .to(q('.cap:nth-child(2) .cap__bar i'), { scaleX: 1, duration: 1.6 }, 2.6)
          // 03 — consignments
          .to(q('.dash__chart'), { opacity: 0.55, duration: 0.3 }, 4.2)
          .to(q('.dash__table'), { opacity: 1, duration: 0.4 }, 4.2)
          .to(q('.dash__tr'), { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out' }, 4.3)
          .to(q('.cap:nth-child(3) .cap__bar i'), { scaleX: 1, duration: 1.6 }, 4.2)
          // 04 — exceptions
          .to(q('.dash__panel'), { opacity: 1, duration: 0.4 }, 5.8)
          .to(q('.float'), { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.25, ease: 'back.out(1.8)' }, 5.9)
          .to(q('.cap:nth-child(4) .cap__bar i'), { scaleX: 1, duration: 1.6 }, 5.8)
          .to({}, { duration: 0.6 });
        return () => {
          window.removeEventListener('resize', fit);
          setPinned(false);
          setCap(-1);
        };
      });

      // Smaller screens: simple scroll reveals.
      mm.add('(max-width: 1100px), (max-height: 739px)', () => {
        gsap.fromTo(q('.dash'), { rotateX: 20, scale: 0.92, y: 50 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: q('.dash-wrap')[0], start: 'top 95%', end: 'top 35%', scrub: 1 } });
        gsap.from(q('.dash__area-line'), { drawSVG: '0%', duration: 2, scrollTrigger: { trigger: q('.dash')[0], start: 'top 60%', once: true } });
        gsap.from(q('.dash__hubbar i'), { scaleX: 0, transformOrigin: 'left', duration: 1.4, stagger: 0.1, scrollTrigger: { trigger: q('.dash')[0], start: 'top 60%', once: true } });
        gsap.from(q('.dash__tr'), { opacity: 0, x: -20, duration: 1, stagger: 0.1, scrollTrigger: { trigger: q('.dash__table')[0], start: 'top 90%', once: true } });
      });

      // A soft glare follows the pointer across the dashboard glass (no tilt), rAF-throttled.
      const wrap = q('.dash-wrap')[0];
      const dash = q('.dash__tilt')[0];
      let frame = 0;
      let last;
      const paint = () => {
        frame = 0;
        const r = wrap.getBoundingClientRect();
        dash.style.setProperty('--gx', `${((last.clientX - r.left) / r.width) * 100}%`);
        dash.style.setProperty('--gy', `${((last.clientY - r.top) / r.height) * 100}%`);
      };
      const move = (e) => {
        last = e;
        if (!frame) frame = requestAnimationFrame(paint);
      };
      wrap.addEventListener('pointermove', move);
      return () => {
        cancelAnimationFrame(frame);
        wrap.removeEventListener('pointermove', move);
        mm.revert();
      };
    },
    { scope: root }
  );

  // Fixed demo points inside Rajasthan (relative to its bbox)
  const dots = [
    [0.62, 0.42], [0.38, 0.5], [0.42, 0.78], [0.6, 0.7], [0.5, 0.45], [0.32, 0.25], [0.55, 0.3], [0.72, 0.38],
  ].map(([u, v]) => [rj.x0 + u * rj.w, rj.y0 + v * rj.h]);
  const jai = dots[0];

  return (
    <section id="technology" className="section tech night" ref={root} data-nav="dark" data-chapter="Technology" data-sheet>
      <div className="tech__glow" aria-hidden="true" />
      <div className="container">
        <div className="shead">
          <div>
            <span className="eyebrow">05 · eCarry, built in-house</span>
            <h2 className="h1" data-split>
              Technology is how we <span className="serif">run.</span> Not what we sell.
            </h2>
          </div>
          <p className="lead" data-reveal>
            Our own engineers built eCarry to dispatch our trucks, sort our hubs and prove every delivery. Connect your ERP
            or storefront and you see exactly what our control tower sees.
          </p>
        </div>

        {/* ---------------- Dashboard stage (pinned on desktop) ---------------- */}
        <div className="tech__stage">
          <ol className={`caps ${pinned ? '' : 'caps--static'}`}>
            {CAPS.map((c, i) => (
              <li key={c.t} className={`cap ${cap === i ? 'is-on' : ''} ${cap > i ? 'is-past' : ''}`}>
                <span className="cap__bar"><i /></span>
                <span className="mono cap__n">0{i + 1}</span>
                <b className="cap__t">{c.t}</b>
                <small className="cap__d">{c.d}</small>
              </li>
            ))}
          </ol>
        <div className="dash-wrap">
          <div className="float float--a" data-speed="0.6">
            <span className="float__ico"><Camera size={16} weight="light" /></span>
            <span><b>Digital POD captured</b><small>Photo + OTP · Udaipur · 14:02</small></span>
          </div>
          <div className="float float--b" data-speed="1.1">
            <span className="float__ico"><Plugs size={16} weight="light" /></span>
            <span><b>ERP sync complete</b><small>SAP S/4HANA · 1,240 orders</small></span>
          </div>
          <div className="float float--c" data-speed="0.3">
            <span className="float__ico float__ico--s"><WarningCircle size={16} weight="light" /></span>
            <span><b>Geofence alert resolved</b><small>RJ14 GT 4471 · NH-48 · 2 min</small></span>
          </div>
          <div className="float float--d" data-speed="0.9">
            <span className="float__ico"><ArrowsCounterClockwise size={16} weight="light" /></span>
            <span><b>RTO risk flagged</b><small>Re-attempt booked · 10:00 slot</small></span>
          </div>

          <div className="dash">
            <div className="dash__tilt">
              <div className="dash__frame">
                <span className="dash__glare" aria-hidden="true" />
                <div className="dash__bar">
                  <span className="dash__dots"><i /><i /><i /></span>
                  <span className="dash__url mono">ecarry.svgjpr.com / control-tower</span>
                  <span className="dash__sync mono"><span className="pulse" /> Synced 2s ago</span>
                </div>
                <div className="dash__body">
                  <aside className="dash__side">
                    <img src="/img/logo-white.png" alt="" className="dash__logo" />
                    {[SquaresFour, Package, Truck, Warehouse, MapPin, Receipt, ChartLineUp].map((I, i) => (
                      <span key={i} className={`dash__nav ${i === 0 ? 'is-on' : ''}`}><I size={18} weight="light" /></span>
                    ))}
                  </aside>
                  <div className="dash__main">
                    <div className="dash__title">
                      <div>
                        <span className="mono dim">Control tower · Rajasthan + North</span>
                        <b>Good afternoon, Operations</b>
                      </div>
                      <div className="dash__filters mono">
                        <span className="is-on">Today</span><span>7D</span><span>30D</span>
                      </div>
                    </div>

                    <div className="dash__kpis">
                      <Kpi icon={Package} label="Consignments today" val="12768" delta="+8.2%" />
                      <Kpi icon={Gauge} label="On-time delivery" val="96.3" suf="%" delta="+1.4 pts" />
                      <Kpi icon={Truck} label="Owned vehicles live" val="212" suf=" / 228" delta="93% util." />
                      <Kpi icon={Lightning} label="Open exceptions" val="23" delta="−41% WoW" good />
                    </div>

                    <div className="dash__mid">
                      <div className="dash__panel dash__map">
                        <div className="dash__ph"><span>Live fleet</span><span className="mono dim">212 vehicles</span></div>
                        <svg viewBox={rj.vb} className="dash__rj" aria-hidden="true">
                          <path d={rj.d} className="dash__rj-shape" />
                          {dots.slice(1).map((p, i) => (
                            <path key={i} d={`M${jai[0]},${jai[1]} L${p[0]},${p[1]}`} className="dash__rj-route" />
                          ))}
                          {dots.slice(1).map((p, i) => (
                            <circle key={`t${i}`} r={rj.w / 90} className="dash__rj-truck">
                              <animateMotion dur={`${3 + (i % 4)}s`} repeatCount="indefinite" path={`M${jai[0]},${jai[1]} L${p[0]},${p[1]}`} />
                            </circle>
                          ))}
                          {dots.map((p, i) => (
                            <circle key={`h${i}`} cx={p[0]} cy={p[1]} r={i === 0 ? rj.w / 45 : rj.w / 70} className={i === 0 ? 'dash__rj-hq' : 'dash__rj-hub'} />
                          ))}
                        </svg>
                      </div>
                      <div className="dash__panel dash__chart">
                        <div className="dash__ph"><span>Throughput · tons</span><span className="mono up">▲ 12.4%</span></div>
                        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="dash__area" aria-hidden="true">
                          <defs>
                            <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0" stopColor="#7ee2a8" stopOpacity=".35" />
                              <stop offset="1" stopColor="#7ee2a8" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[30, 60, 90].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} className="dash__grid" />)}
                          <path className="dash__area-fill" d="M0,96 C30,90 40,70 70,74 S120,52 150,58 S200,30 230,38 S275,18 300,14 L300,120 L0,120Z" fill="url(#ar)" />
                          <path className="dash__area-line" d="M0,96 C30,90 40,70 70,74 S120,52 150,58 S200,30 230,38 S275,18 300,14" />
                          <path className="dash__area-fc" d="M230,38 S275,18 300,14" />
                        </svg>
                        <div className="dash__hubs">
                          {[['Jaipur', 92], ['Jodhpur', 74], ['Udaipur', 61], ['Kota', 55]].map(([h, v]) => (
                            <div key={h} className="dash__hub">
                              <span className="mono dim">{h}</span>
                              <span className="dash__hubbar"><i style={{ width: `${v}%` }} /></span>
                              <span className="mono">{v}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="dash__panel dash__table">
                      <div className="dash__ph"><span>Live consignments</span><span className="mono dim">Auto-refresh · 15s</span></div>
                      <div className="dash__thead mono">
                        <span>AWB</span><span>Client</span><span>Lane</span><span>Vehicle</span><span>Status</span><span>ETA</span>
                      </div>
                      {ROWS.map((r) => (
                        <div key={r[0]} className="dash__tr">
                          <span className="mono">{r[0]}</span>
                          <span>{r[1]}</span>
                          <span className="mono">{r[2]}</span>
                          <span className="mono dim">{r[3]}</span>
                          <span><em className={`st st--${r[4].split(' ')[0].toLowerCase()}`}>{r[4]}</em></span>
                          <span className="mono">{r[5]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

        {/* ---------------- Bento ---------------- */}
        <div className="tbento">
          <article className="bezel spot-ring tb tb--track" data-reveal>
            <div className="bezel__core spot tb__core">
              <div className="tb__vis tb__vis--track" aria-hidden="true">
                <svg viewBox="0 0 400 140" className="tb__road">
                  <path id="road" d="M10 110 C 90 110, 110 40, 200 50 S 330 110, 390 30" />
                  <path d="M10 110 C 90 110, 110 40, 200 50 S 330 110, 390 30" className="tb__road-done" />
                  <circle cx="10" cy="110" r="5" className="tb__pin" />
                  <circle cx="390" cy="30" r="5" className="tb__pin tb__pin--end" />
                  <g className="tb__veh">
                    <circle r="11" />
                    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#road" />
                    </animateMotion>
                  </g>
                </svg>
                <span className="tb__eta mono">
                  <Broadcast size={13} weight="light" />
                  <span className="tb__eta-roll">
                    <span>ETA from the truck · ±6 min</span>
                    <span>Live · 42 km/h · NH-48</span>
                  </span>
                </span>
              </div>
              <h3 className="tb__h">Live tracking on every owned vehicle</h3>
              <p className="tb__p">GPS and geofencing are fitted at our depot, not bolted on by a sub-vendor. Your ETA comes straight from the truck.</p>
            </div>
          </article>

          <article className="bezel spot-ring tb tb--orbit" data-reveal>
            <div className="bezel__core spot tb__core">
              <div className="orbit" aria-hidden="true">
                <div className="orbit__ring orbit__ring--1">
                  {['SAP', 'Oracle', 'Shopify'].map((t, i) => <span key={t} className="orbit__chip" style={{ '--a': `${i * 120}deg` }}><i>{t}</i></span>)}
                </div>
                <div className="orbit__ring orbit__ring--2">
                  {['WooCommerce', 'Tally', 'REST API', 'Webhooks'].map((t, i) => <span key={t} className="orbit__chip" style={{ '--a': `${i * 90 + 45}deg` }}><i>{t}</i></span>)}
                </div>
                <span className="orbit__core"><img src="/img/logo-white.png" alt="" /></span>
              </div>
              <h3 className="tb__h">Plugs into the stack you already run</h3>
              <p className="tb__p">SAP, Oracle, Shopify, WooCommerce or a custom legacy system. Orders flow in and status flows back, with no manual uploads.</p>
            </div>
          </article>

          <article className="bezel spot-ring tb tb--pod" data-reveal>
            <div className="bezel__core spot tb__core">
              <div className="pod" aria-hidden="true">
                <div className="pod__card pod__card--1"><Img src="/img/d2c.webp" sizes="200px" loading="lazy" /></div>
                <div className="pod__card pod__card--2">
                  <span className="mono dim">OTP verified</span>
                  <b className="mono">4 · 8 · 1 · 7</b>
                </div>
                <div className="pod__card pod__card--3">
                  <Signature size={16} weight="light" />
                  <svg viewBox="0 0 120 40"><path d="M4 30 C 14 6, 22 34, 32 18 S 48 10, 52 26 S 70 8, 78 22 S 98 30, 116 12" /></svg>
                  <span className="mono dim">26.91°N 75.78°E · 14:02</span>
                </div>
              </div>
              <h3 className="tb__h">Digital POD with an audit trail</h3>
              <p className="tb__p">Photo, OTP, signature and geo-stamp on every drop, synced to your ERP before the vehicle leaves the street.</p>
            </div>
          </article>

          <article className="bezel spot-ring tb tb--rto" data-reveal data-inview>
            <div className="bezel__core spot tb__core">
              <div className="rto" aria-hidden="true">
                <div className="rto__col"><span className="rto__bar rto__bar--b" /><span className="mono dim">Before</span></div>
                <div className="rto__col"><span className="rto__bar rto__bar--a" /><span className="mono">With SVG</span></div>
                <div className="rto__big">
                  <b>40%</b>
                  <span className="mono dim">lower RTO, up to</span>
                </div>
              </div>
              <h3 className="tb__h">NDR & RTO control</h3>
              <p className="tb__p">Custom escalation workflows and verified re-attempts, so more orders are accepted on the first try.</p>
            </div>
          </article>

          <article className="bezel spot-ring tb tb--inv" data-reveal data-inview>
            <div className="bezel__core spot tb__core">
              <div className="inv" aria-hidden="true">
                {[['SKU-HV-2201', 'Fans · 12 cartons', 82], ['SKU-PN-0418', 'Microwaves · 6 pallets', 54], ['KIT-EDU-60K', 'School kits · batch 14', 96]].map(([a, b, v]) => (
                  <div key={a} className="inv__row">
                    <Barcode size={16} weight="light" />
                    <span><b className="mono">{a}</b><small>{b}</small></span>
                    <span className="inv__bar"><i style={{ '--w': `${v}%` }} /></span>
                  </div>
                ))}
              </div>
              <h3 className="tb__h">Inventory & kitting sync</h3>
              <p className="tb__p">Stock levels, kitting batches and dispatch readiness update live across every warehouse we run for you.</p>
            </div>
          </article>

          <article className="bezel spot-ring tb tb--pred" data-reveal>
            <div className="bezel__core spot tb__core">
              <svg viewBox="0 0 300 110" className="pred" aria-hidden="true">
                <path className="pred__band" d="M190,46 C220,36 250,30 296,14 L296,46 C250,58 220,62 190,62Z" />
                <path className="pred__line" d="M4,90 C30,84 50,92 76,74 S120,70 140,60 S175,52 190,54" />
                <path className="pred__fc" d="M190,54 C220,48 250,42 296,30" />
                <line x1="190" x2="190" y1="10" y2="104" className="pred__now" />
                <text x="196" y="18" className="pred__t">Forecast</text>
              </svg>
              <h3 className="tb__h">Predictive capacity planning</h3>
              <p className="tb__p">Demand forecasts feed straight into fleet and dock plans, so festive peaks are planned weeks before they hit.</p>
            </div>
          </article>
        </div>

        <div className="tech__band" data-reveal>
          <p>
            We don't license eCarry. <span className="serif">It ships with every consignment.</span>
          </p>
          <div className="tech__chips">
            <span className="chip"><SquaresFour size={15} weight="light" /> Client portal</span>
            <span className="chip"><Code size={15} weight="light" /> REST API & webhooks</span>
            <span className="chip"><FileText size={15} weight="light" /> MIS & SLA reports</span>
            <span className="chip"><CheckCircle size={15} weight="light" /> POD archive</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ icon: I, label, val, suf = '', delta, good }) {
  const dec = val.includes('.');
  return (
    <div className="dash__kpi">
      <div className="dash__kpi-top">
        <span className="dim">{label}</span>
        <I size={15} weight="light" />
      </div>
      <b>
        <span data-count={val}>{dec ? '0.0' : '0'}</span>
        <small>{suf}</small>
      </b>
      <span className={`mono dash__delta ${good ? 'good' : ''}`}>{delta}</span>
    </div>
  );
}
