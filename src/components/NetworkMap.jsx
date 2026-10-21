import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion';
import { STATES, MAP_W, MAP_H, project } from '../data/indiaMap.js';
import './NetworkMap.css';

const HUBS = [
  { id: 'jai', name: 'Jaipur', lon: 75.79, lat: 26.91, type: 'mother', g: 'origin', note: 'Mother hub · HQ' },
  { id: 'jdh', name: 'Jodhpur', lon: 73.02, lat: 26.24, type: 'hub', g: 'rj' },
  { id: 'udr', name: 'Udaipur', lon: 73.71, lat: 24.58, type: 'hub', g: 'rj' },
  { id: 'kta', name: 'Kota', lon: 75.86, lat: 25.18, type: 'hub', g: 'rj' },
  { id: 'ajm', name: 'Ajmer', lon: 74.64, lat: 26.45, type: 'hub', g: 'rj' },
  { id: 'bkn', name: 'Bikaner', lon: 73.31, lat: 28.02, type: 'hub', g: 'rj' },
  { id: 'skr', name: 'Sikar', lon: 75.14, lat: 27.61, type: 'hub', g: 'rj' },
  { id: 'alw', name: 'Alwar', lon: 76.6, lat: 27.55, type: 'hub', g: 'rj' },
  { id: 'del', name: 'Delhi NCR', lon: 77.1, lat: 28.6, type: 'hub', g: 'ni' },
  { id: 'chd', name: 'Chandigarh', lon: 76.78, lat: 30.73, type: 'hub', g: 'ni' },
  { id: 'ldh', name: 'Ludhiana', lon: 75.85, lat: 30.9, type: 'hub', g: 'ni' },
  { id: 'lko', name: 'Lucknow', lon: 80.95, lat: 26.85, type: 'hub', g: 'ni' },
  { id: 'agr', name: 'Agra', lon: 78.0, lat: 27.18, type: 'hub', g: 'ni' },
  { id: 'amd', name: 'Ahmedabad', lon: 72.57, lat: 23.02, type: 'reach', g: 'in' },
  { id: 'ind', name: 'Indore', lon: 75.86, lat: 22.72, type: 'reach', g: 'in' },
  { id: 'hyd', name: 'Hyderabad', lon: 78.48, lat: 17.39, type: 'reach', g: 'in' },
  { id: 'gau', name: 'Guwahati', lon: 91.74, lat: 26.14, type: 'reach', g: 'in' },
  { id: 'bom', name: 'Mumbai', lon: 72.88, lat: 19.07, type: 'reach', g: 'in' },
  { id: 'blr', name: 'Bengaluru', lon: 77.59, lat: 12.97, type: 'reach', g: 'in' },
  { id: 'ccu', name: 'Kolkata', lon: 88.36, lat: 22.57, type: 'reach', g: 'in' },
  { id: 'pat', name: 'Patna', lon: 85.14, lat: 25.6, type: 'reach', g: 'in' },
];

// [from, to, group]
const ROUTES = [
  ['jai', 'jdh', 'rj'], ['jai', 'udr', 'rj'], ['jai', 'kta', 'rj'], ['jai', 'ajm', 'rj'], ['jai', 'bkn', 'rj'], ['jai', 'skr', 'rj'], ['jai', 'alw', 'rj'],
  ['jai', 'del', 'ni'], ['del', 'chd', 'ni'], ['chd', 'ldh', 'ni'], ['del', 'agr', 'ni'], ['agr', 'lko', 'ni'],
  ['lko', 'pat', 'in'], ['pat', 'gau', 'in'], ['jai', 'amd', 'in'], ['amd', 'bom', 'in'], ['jai', 'ind', 'in'], ['ind', 'hyd', 'in'], ['hyd', 'blr', 'in'], ['pat', 'ccu', 'in'],
];
const TRUCK_ROUTES = [0, 2, 5, 7, 11, 14, 16];

const CORE = ['Rajasthan'];
const STRONG = ['Uttar Pradesh', 'Punjab', 'Haryana', 'NCT of Delhi', 'Chandigarh'];
const PRESENCE = ['Gujarat', 'Madhya Pradesh', 'Assam', 'Telangana', 'Uttarakhand', 'Himachal Pradesh'];
const FILL = { base: '#ece9df', presence: '#d7e6dc', strong: '#a9cdb6', core: '#06331d' };

const STEPS = [
  { k: 'origin', label: '2002 · Jaipur', h: 'It began in Jaipur.', d: 'Solving bulk distribution for telecom companies, from one city in Rajasthan.', box: [74.6, 25.9, 77.0, 27.9], at: 0.4 },
  { k: 'rj', label: 'Rajasthan core', h: 'Then every district of Rajasthan.', d: 'One mother hub and seven regional hubs, all owned and run by our own teams.', box: [68.8, 23.0, 78.6, 30.4], at: 3.3 },
  { k: 'ni', label: 'North India', h: 'Then across North India.', d: 'Delhi NCR, Uttar Pradesh, Punjab and Haryana, served from 200+ branches.', box: [68.5, 22.0, 85.5, 32.6], at: 6.1 },
  { k: 'in', label: 'Pan-India reach', h: 'Today, 19,000+ PIN codes.', d: 'Scheduled linehaul and network partners carry your freight to the rest of India.', box: null, at: 8.9 },
];

const RJ_HUBS = HUBS.filter((h) => h.g === 'rj' || h.g === 'origin').map((h) => h.id);

const boxToView = (box) => {
  if (!box) return `0 0 ${MAP_W} ${MAP_H}`;
  const [x0, y0] = project(box[0], box[3]);
  const [x1, y1] = project(box[2], box[1]);
  const w = x1 - x0, h = y1 - y0;
  const ar = MAP_W / MAP_H;
  let vw = w, vh = h;
  if (w / h > ar) vh = w / ar;
  else vw = h * ar;
  return `${(x0 - (vw - w) / 2).toFixed(1)} ${(y0 - (vh - h) / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`;
};

export default function NetworkMap() {
  const root = useRef(null);
  const svg = useRef(null);
  const core = useRef(null);
  const tlRef = useRef(null);
  const [step, setStep] = useState(3);
  const [hover, setHover] = useState(null);
  const tip = useRef(null); // state-name tooltip, moved directly (no React re-render per mousemove)

  const pts = useMemo(() => Object.fromEntries(HUBS.map((h) => [h.id, project(h.lon, h.lat)])), []);
  const routes = useMemo(
    () =>
      ROUTES.map(([a, b, g]) => {
        const [x0, y0] = pts[a];
        const [x1, y1] = pts[b];
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        const dx = x1 - x0, dy = y1 - y0;
        const k = 0.18;
        return { g, d: `M${x0.toFixed(1)},${y0.toFixed(1)} Q${(mx - dy * k).toFixed(1)},${(my + dx * k).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}` };
      }),
    [pts]
  );

  // --z keeps markers/labels a constant on-screen size. Only touch the style when the
  // zoom actually changed — rewriting it every scroll frame restyles the whole SVG.
  const lastZ = useRef('');
  const syncZoom = () => {
    const z = (svg.current.viewBox.baseVal.width / MAP_W).toFixed(3);
    if (z === lastZ.current) return;
    lastZ.current = z;
    svg.current.style.setProperty('--z', z);
  };

  // Click a chapter: on desktop scroll the story there, otherwise just zoom.
  const goStep = (i) => {
    const tl = tlRef.current;
    if (tl && tl.scrollTrigger && window.__lenis) {
      const st = tl.scrollTrigger;
      window.__lenis.scrollTo(st.start + (st.end - st.start) * (STEPS[i].at / tl.duration()), { duration: 1.6 });
      return;
    }
    setStep(i);
    gsap.to(svg.current, { attr: { viewBox: boxToView(STEPS[i].box) }, duration: 1.4, ease: 'svg.cine', onUpdate: syncZoom });
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1001px) and (min-height: 680px)', () => {
        const q = gsap.utils.selector(root);
        setStep(0);
        gsap.set(svg.current, { attr: { viewBox: boxToView(STEPS[0].box) } });
        syncZoom();
        gsap.set(q('.map__state'), { fill: FILL.base });
        gsap.set(q('.map__route'), { drawSVG: '0%' });
        gsap.set(q('.map__flow, .map__truck'), { opacity: 0 });
        gsap.set(q('.map__hub:not(.g-origin)'), { scale: 0, transformOrigin: '50% 50%' });
        gsap.set(q('.map__label:not(.g-origin)'), { opacity: 0 });
        gsap.set(q('.map__stats > div'), { opacity: 0.25 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=340%',
            pin: true,
            refreshPriority: 2, // pinned scenes refresh in page order, even if re-created
            scrub: 1,
          },
          onUpdate: () => {
            syncZoom();
            const t = tl.time();
            setStep(t < 1.9 ? 0 : t < 4.7 ? 1 : t < 7.5 ? 2 : 3);
          },
        });
        tlRef.current = tl;

        const chapter = (g, at, box, fills) => {
          tl.to(svg.current, { attr: { viewBox: boxToView(box) }, duration: 2, ease: 'power2.inOut' }, at);
          fills.forEach(([names, color]) =>
            tl.to(q('.map__state').filter((p) => names.includes(p.dataset.name)), { fill: color, duration: 1, stagger: 0.05 }, at + 0.3)
          );
          tl.to(q(`.map__route.g-${g}`), { drawSVG: '100%', duration: 1, stagger: 0.08, ease: 'power1.inOut' }, at + 0.6)
            .to(q(`.map__flow.g-${g}, .map__truck.g-${g}`), { opacity: 1, duration: 0.4 }, at + 1.4)
            .to(q(`.map__hub.g-${g}`), { scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2.5)' }, at + 0.9)
            .to(q(`.map__label.g-${g}`), { opacity: 1, duration: 0.5, stagger: 0.04 }, at + 1.1);
        };

        tl.to({}, { duration: 1 }); // hold on Jaipur
        chapter('rj', 1, STEPS[1].box, [[CORE, FILL.core]]);
        tl.to(q('.map__stats > div:nth-child(1)'), { opacity: 1, duration: 0.5 }, 2.6);
        chapter('ni', 3.8, STEPS[2].box, [[STRONG, FILL.strong]]);
        tl.to(q('.map__stats > div:nth-child(2), .map__stats > div:nth-child(3)'), { opacity: 1, duration: 0.5 }, 5.4);
        chapter('in', 6.6, STEPS[3].box, [[PRESENCE, FILL.presence]]);
        tl.to(q('.map__stats > div:nth-child(4)'), { opacity: 1, duration: 0.5 }, 8.2).to({}, { duration: 0.9 }, 8.6);
        return () => {
          tlRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const fillCls = (n) => (CORE.includes(n) ? 'core' : STRONG.includes(n) ? 'strong' : PRESENCE.includes(n) ? 'presence' : '');
  const hov = hover && HUBS.find((h) => h.id === hover);

  const onStateMove = (e, name) => {
    const t = tip.current;
    if (!t) return;
    const r = core.current.getBoundingClientRect();
    if (t.textContent !== name) t.textContent = name;
    t.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
    t.style.opacity = '1';
  };
  const hideTip = () => tip.current && (tip.current.style.opacity = '0');

  return (
    <section id="network" className="map lines" ref={root} data-nav="light" data-chapter="Network">
      <div className="container map__grid">
        <div className="map__copy">
          <span className="eyebrow">04 · Distribution network</span>
          <h2 className="h1 map__title" data-split>
            Rooted in Rajasthan. <span className="serif">Running</span> across India.
          </h2>

          <div className="map__story" aria-live="polite">
            <span className="mono map__story-k" key={`k${step}`}>{STEPS[step].label}</span>
            <p className="map__story-h" key={`h${step}`}>{STEPS[step].h}</p>
            <p className="map__story-d" key={`d${step}`}>{STEPS[step].d}</p>
          </div>

          <ol className="map__steps" role="tablist">
            {STEPS.map((s, i) => (
              <li key={s.k}>
                <button role="tab" aria-selected={step === i} className={`map__step ${step === i ? 'is-on' : ''} ${i < step ? 'is-past' : ''}`} onClick={() => goStep(i)}>
                  <span className="mono">0{i + 1}</span>
                  <span className="map__step-t">{s.label}</span>
                  <i className="map__step-bar" />
                </button>
              </li>
            ))}
          </ol>

          <ul className="map__legend mono">
            <li><i className="lg lg--mother" /> Mother hub</li>
            <li><i className="lg lg--hub" /> Owned hub</li>
            <li><i className="lg lg--reach" /> Network reach</li>
            <li><i className="lg lg--route" /> Linehaul</li>
          </ul>
        </div>

        <div className="map__card bezel">
          <div className="bezel__core map__core" ref={core} onMouseLeave={hideTip}>
            <div className="map__hud mono">
              <span><span className="pulse" /> Live network view</span>
              <span className="muted">{hov ? `${hov.lat.toFixed(2)}° N · ${hov.lon.toFixed(2)}° E` : 'Hover a hub'}</span>
            </div>

            <svg ref={svg} style={{ '--z': 1 }} className="map__svg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of SVG Express hubs and linehaul routes across India">
              <defs>
                <radialGradient id="glow">
                  <stop offset="0" stopColor="#f28c28" stopOpacity=".28" />
                  <stop offset="1" stopColor="#f28c28" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g>
                {STATES.map((s) => (
                  <path key={s.name} d={s.d} data-name={s.name} className={`map__state ${fillCls(s.name)}`} onMouseMove={(e) => onStateMove(e, s.name)} />
                ))}
              </g>
              <circle cx={pts.jai[0]} cy={pts.jai[1]} fill="url(#glow)" className="map__glow" />
              <g>
                {routes.map((r, i) => (
                  <path key={i} id={`rt-${i}`} d={r.d} className={`map__route g-${r.g}`} />
                ))}
                {routes.map((r, i) => (
                  <path key={`f${i}`} d={r.d} className={`map__flow g-${r.g}`} style={{ animationDelay: `${-i * 0.37}s` }} />
                ))}
              </g>
              <g>
                {TRUCK_ROUTES.map((ri, i) => (
                  <circle key={ri} className={`map__truck g-${routes[ri].g}`}>
                    <animateMotion dur={`${4 + (i % 3) * 1.5}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#rt-${ri}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>
              <g>
                {[0, 1, 2].map((i) => (
                  <circle key={i} cx={pts.jai[0]} cy={pts.jai[1]} className="map__radar" style={{ animationDelay: `${i}s` }} />
                ))}
                {HUBS.map((h) => {
                  const [x, y] = pts[h.id];
                  return (
                    <g key={h.id} className={`map__hub map__hub--${h.type} g-${h.g} ${hover === h.id ? 'is-hover' : ''}`} onMouseEnter={() => setHover(h.id)} onMouseLeave={() => setHover(null)}>
                      <circle cx={x} cy={y} className="map__hit" />
                      <circle cx={x} cy={y} className="map__dot" />
                    </g>
                  );
                })}
              </g>
              <g className="map__labels">
                {HUBS.map((h) => {
                  const [x, y] = pts[h.id];
                  return (
                    <text key={h.id} x={x} y={y} dx="1em" dy="0.36em" className={`map__label g-${h.g} ${h.type === 'mother' ? 'is-mother' : ''} ${RJ_HUBS.includes(h.id) ? 'on-core' : ''}`}>
                      {h.name}
                    </text>
                  );
                })}
              </g>
            </svg>

            <span className={`map__stip mono ${hov ? 'is-hidden' : ''}`} ref={tip} aria-hidden="true" />

            {hov && (
              <div className="map__tip">
                <span className="mono">{hov.type === 'mother' ? 'Mother hub' : hov.type === 'hub' ? 'Owned hub' : 'Network reach'}</span>
                <b>{hov.name}</b>
                <small>{hov.note || (hov.type === 'reach' ? 'Scheduled linehaul + partners' : 'Owned dock · sort · dispatch')}</small>
              </div>
            )}

            <div className="map__stats">
              <div><b data-count="20">0</b><span className="mono">Offices</span></div>
              <div><b><span data-count="200">0</span>+</b><span className="mono">Branches</span></div>
              <div><b><span data-count="400">0</span>+</b><span className="mono">Active routes</span></div>
              <div><b><span data-count="19000">0</span>+</b><span className="mono">PIN codes</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
