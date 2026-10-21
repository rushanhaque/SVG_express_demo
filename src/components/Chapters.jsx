import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import scrollToSection, { trackSections } from '../lib/scrollTo';
import './Chapters.css';

/**
 * Film-style chapter rail. Any element with data-chapter="Name" becomes a chapter.
 * Shows a tick per chapter, a rolling chapter counter, and total page progress.
 */
export default function Chapters({ ready }) {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const fill = useRef(null);

  useEffect(() => {
    if (!ready) return;
    const els = [...document.querySelectorAll('[data-chapter]')];
    setList(els.map((el) => el.dataset.chapter));
    // Positions are cached (pin spacers included) and refreshed with ScrollTrigger.
    const sec = trackSections(els, ScrollTrigger);
    const prog = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (s) => {
        if (fill.current) fill.current.style.transform = `scaleY(${s.progress})`;
        setVisible(s.scroll() > window.innerHeight * 0.6);
        const mid = window.scrollY + window.innerHeight / 2;
        let a = 0;
        sec.spans.forEach(([top], i) => {
          if (top <= mid) a = i;
        });
        setActive(a);
      },
    });
    return () => {
      prog.kill();
      sec.stop();
    };
  }, [ready]);

  const go = (i) => scrollToSection(document.querySelectorAll('[data-chapter]')[i], { duration: 1.8 });

  // Hover a tick → tiny elastic bump on its neighbours.
  const bump = (e) => {
    const t = e.currentTarget;
    gsap.fromTo(t.querySelector('i'), { scaleX: 1 }, { scaleX: 1.6, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
  };

  return (
    <aside className={`chap ${visible ? 'is-on' : ''}`} aria-label="Page chapters">
      <div className="chap__count mono" aria-hidden="true">
        <span className="chap__digits" style={{ transform: `translateY(${-active * 14}px)` }}>
          {list.map((_, i) => (
            <span key={i}>{String(i + 1).padStart(2, '0')}</span>
          ))}
        </span>
      </div>
      <ul className="chap__ticks">
        {list.map((name, i) => (
          <li key={name}>
            <button className={`chap__tick ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`} onClick={() => go(i)} onMouseEnter={bump} aria-label={`Go to ${name}`}>
              <i />
              <span className="chap__label mono">{name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="chap__name mono" aria-live="polite">
        <span key={active}>{list[active]}</span>
      </div>
      <div className="chap__prog" aria-hidden="true">
        <i ref={fill} />
      </div>
    </aside>
  );
}
