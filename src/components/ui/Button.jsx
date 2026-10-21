import { useRef } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import Roll from './Roll.jsx';

/**
 * Island pill button: per-letter roll label, liquid fill that enters from the
 * pointer's side, nested kinetic icon well, and a gentle magnetic pull.
 */
export default function Button({ children, variant = '', size = '', href = '#', icon: Icon = ArrowUpRight, magnetic = true, className = '', ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!magnetic || !ref.current || window.matchMedia('(pointer: coarse)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.16;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onEnter = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--fx', `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty('--fy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onLeave = (e) => {
    onEnter(e);
    if (ref.current) ref.current.style.transform = '';
  };

  const cls = ['btn roll-host', variant && `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ');
  return (
    <a ref={ref} href={href} className={cls} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave} {...rest}>
      <span className="btn__clip" aria-hidden="true">
        <span className="btn__fill" />
      </span>
      <Roll>{children}</Roll>
      <span className="btn__icon" aria-hidden="true">
        <Icon size={18} weight="light" />
        <Icon size={18} weight="light" />
      </span>
    </a>
  );
}
