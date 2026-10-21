import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from './motion';

/**
 * Infinite marquee on `ref` (content must be duplicated so -50% loops seamlessly).
 * Reacts to scroll velocity (speeds up, follows scroll direction) and eases to a
 * crawl while hovered.
 */
export default function useMarquee(ref, { duration = 40, reverse = false } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tw = gsap.fromTo(el, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 });
    let hover = 1;
    let dir = 1;
    const tick = () => {
      const v = window.__vel || 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
      const target = dir * hover * (1 + Math.min(Math.abs(v) * 0.08, 5));
      tw.timeScale(gsap.utils.interpolate(tw.timeScale(), target, 0.08));
    };
    // Sleep (tween + ticker work) while the owning section is off-screen.
    const section = el.closest('section, .ticker');
    let awake = true;
    const onVis = (e) => {
      if (e.detail === awake) return;
      awake = e.detail;
      if (awake) {
        tw.resume();
        gsap.ticker.add(tick);
      } else {
        tw.pause();
        gsap.ticker.remove(tick);
      }
    };
    section?.addEventListener('section:visibility', onVis);
    gsap.ticker.add(tick);
    const host = el.parentElement;
    const on = () => (hover = 0.18);
    const off = () => (hover = 1);
    host.addEventListener('mouseenter', on);
    host.addEventListener('mouseleave', off);
    return () => {
      section?.removeEventListener('section:visibility', onVis);
      gsap.ticker.remove(tick);
      host.removeEventListener('mouseenter', on);
      host.removeEventListener('mouseleave', off);
      tw.kill();
    };
  }, [ref, duration, reverse]);
}
