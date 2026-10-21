import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion';
import { ArrowUpRight, MagnifyingGlass, Truck, Package, Warehouse, ArrowsCounterClockwise, Lightning, MapTrifold, ShieldCheck, Storefront, Cube } from '@phosphor-icons/react';
import Roll from './ui/Roll.jsx';
import scrollToSection, { trackSections } from '../lib/scrollTo';
import './Nav.css';
import Img from './ui/Img.jsx';

const SOLUTIONS = [
  { group: 'Move', items: [
    { icon: Truck, t: 'B2B Freight · FTL & PTL', d: 'Owned linehaul, 19–32 ft closed body' },
    { icon: Lightning, t: 'Intra-State Express', d: 'Time-bound regional distribution' },
    { icon: Package, t: 'D2C Express', d: 'First mile to doorstep, one network' },
  ] },
  { group: 'Store', items: [
    { icon: Warehouse, t: 'Warehousing & 3PL', d: 'Storage, pick-pack, fulfilment' },
    { icon: Cube, t: 'Warehouse-as-a-Service', d: 'Pay per pallet, scale per season' },
    { icon: ArrowsCounterClockwise, t: 'Reverse Logistics', d: 'Returns, recalls, refurbish' },
  ] },
  { group: 'Specialise', items: [
    { icon: Storefront, t: 'Dedicated EV Fleet', d: 'Branded electric last mile' },
    { icon: MapTrifold, t: 'Project & Tender Rollouts', d: 'Kitting to sign-off, statewide' },
    { icon: ShieldCheck, t: 'Field Verification', d: 'CPV, PD & due diligence' },
  ] },
];

const LINKS = [
  { label: 'Solutions', href: '#solutions', mega: true },
  { label: 'Network', href: '#network' },
  { label: 'Technology', href: '#technology' },
  { label: 'Projects', href: '#projects' },
  { label: 'Company', href: '#people' },
];

export default function Nav({ ready }) {
  const root = useRef(null);
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);
  const [track, setTrack] = useState(false);
  const closeT = useRef();
  const glider = useRef(null);
  const prog = useRef(null);

  const glide = (e) => {
    const g = glider.current;
    const t = e.currentTarget;
    if (!g) return;
    g.style.width = `${t.offsetWidth}px`;
    g.style.transform = `translateX(${t.offsetLeft}px)`;
    g.style.opacity = '1';
  };
  const unglide = () => {
    if (glider.current) glider.current.style.opacity = '0';
  };

  useEffect(() => {
    // Theme = whichever section sits under the pill. Measured from real positions
    // (pin spacers included) so pinned scenes never leave the nav in the wrong colour.
    const els = [...document.querySelectorAll('[data-nav]')];
    const sec = trackSections(els, ScrollTrigger);
    const pickTheme = () => {
      const y = window.scrollY + 44;
      for (let i = els.length - 1; i >= 0; i--) {
        const [top, bottom] = sec.spans[i];
        if (top <= y && bottom > y) return setTheme(els[i].dataset.nav);
      }
    };
    const pr = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (s) => {
        if (prog.current) prog.current.style.transform = `scaleX(${s.progress})`;
        setScrolled(s.scroll() > 120);
        pickTheme();
      },
      onRefresh: pickTheme,
    });
    pickTheme();
    return () => {
      pr.kill();
      sec.stop();
    };
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.from('.nav__pill', { y: -40, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.9 });
    },
    { dependencies: [ready], scope: root }
  );

  // Lock page scroll behind the mobile menu (Lenis when present, native otherwise).
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);

  // Escape closes whichever menu is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setMega(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Keyboard: focusing "Solutions" (or anything inside the panel) opens it; leaving closes it.
  const onBlurMega = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget) && !root.current.querySelector('.mega')?.contains(e.relatedTarget)) hideMega();
  };

  const go = (e, href) => {
    e.preventDefault();
    e.stopPropagation(); // the global anchor handler would scroll a second time
    setOpen(false);
    setMega(false);
    scrollToSection(href);
  };

  const showMega = () => {
    clearTimeout(closeT.current);
    setMega(true);
  };
  const hideMega = () => {
    closeT.current = setTimeout(() => setMega(false), 160);
  };

  return (
    <header ref={root} className={`nav nav--${theme} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__pill">
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label="SVG Express home">
          <img src="/img/logo-white.png" alt="" className="nav__logo-img nav__logo-img--w" />
          <img src="/img/logo.png" alt="" className="nav__logo-img nav__logo-img--c" />
          <span className="nav__word">
            Express<em>Since 2002</em>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary" onMouseLeave={unglide}>
          <span className="nav__glider" ref={glider} aria-hidden="true" />
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav__link"
              onClick={(e) => go(e, l.href)}
              onMouseEnter={(e) => {
                glide(e);
                l.mega ? showMega() : setMega(false);
              }}
              onMouseLeave={l.mega ? hideMega : undefined}
              onFocus={l.mega ? showMega : () => setMega(false)}
              onBlur={l.mega ? onBlurMega : undefined}
              aria-haspopup={l.mega ? 'true' : undefined}
              aria-expanded={l.mega ? mega : undefined}
            >
              <span data-t={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className={`nav__track ${track ? 'is-on' : ''}`}>
          <button className="nav__track-btn" onClick={() => setTrack((v) => !v)} aria-label="Track a shipment">
            <MagnifyingGlass size={17} weight="light" />
          </button>
          <input className="nav__track-input" placeholder="AWB / Order ID" aria-label="AWB or order ID" tabIndex={track ? 0 : -1} />
        </div>

        <a href="#contact" className="nav__cta roll-host" onClick={(e) => go(e, '#contact')}>
          <Roll>Get a quote</Roll>
          <span className="nav__cta-i">
            <ArrowUpRight size={14} weight="regular" />
          </span>
        </a>

        <span className="nav__prog" aria-hidden="true">
          <i ref={prog} />
        </span>

        <button className="nav__burger" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Menu'} aria-expanded={open} aria-controls="mobile-menu">
          <i />
          <i />
        </button>
      </div>

      {/* Mega menu */}
      <div className={`mega ${mega ? 'is-on' : ''}`} onMouseEnter={showMega} onMouseLeave={hideMega} onFocus={showMega} onBlur={onBlurMega} {...(!mega && { inert: '' })}>
        <div className="mega__inner">
          <div className="mega__cols">
            {SOLUTIONS.map((g) => (
              <div key={g.group} className="mega__col">
                <span className="mono mega__group">{g.group}</span>
                {g.items.map((it) => (
                  <a key={it.t} href="#solutions" className="mega__item" onClick={(e) => go(e, '#solutions')}>
                    <span className="mega__ico">
                      <it.icon size={20} weight="light" />
                    </span>
                    <span>
                      <b>{it.t}</b>
                      <small>{it.d}</small>
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
          <a href="#network" className="mega__feature" onClick={(e) => go(e, '#network')}>
            <Img src="/img/hub-sunset.webp" alt="SVG Express owned hub at sunset" sizes="300px" loading="lazy" />
            <span className="mega__feature-txt">
              <span className="mono">Owned infrastructure</span>
              <b>50+ hubs. One accountable operator.</b>
            </span>
          </a>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className="mnav" id="mobile-menu" {...(!open && { inert: '' })}>
        <div className="mnav__inner">
          {LINKS.map((l, i) => (
            <a key={l.label} href={l.href} className="mnav__link" style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }} onClick={(e) => go(e, l.href)}>
              <span className="mono">0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <div className="mnav__foot" style={{ transitionDelay: open ? '480ms' : '0ms' }}>
            <a href="#contact" className="btn btn--mint" onClick={(e) => go(e, '#contact')}>
              <span>Get a quote</span>
              <span className="btn__icon">
                <ArrowUpRight size={18} weight="light" />
              </span>
            </a>
            <span className="mono">Head office · Jaipur, Rajasthan 302001</span>
          </div>
        </div>
      </div>
    </header>
  );
}
