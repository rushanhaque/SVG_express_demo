/**
 * Smooth-scroll to a section. Pinned sections are measured by their pin spacer,
 * so a link always lands at the start of a pinned scene, not wherever the pinned
 * element was last parked.
 */
export const sectionBox = (el) => (el?.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el);

export default function scrollToSection(target, { duration = 1.6 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const top = sectionBox(el).getBoundingClientRect().top + window.scrollY;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.start(); // a paused Lenis (e.g. mobile menu open) silently ignores scrollTo
    lenis.scrollTo(top, { duration });
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }
}

/**
 * Absolute [top, bottom] of each element (pin spacers included), cached and
 * re-measured only when ScrollTrigger refreshes — so per-frame scroll handlers
 * compare numbers instead of forcing layout with getBoundingClientRect.
 */
export function trackSections(els, ScrollTrigger) {
  const spans = [];
  const measure = () => {
    spans.length = 0;
    const y = window.scrollY;
    els.forEach((el) => {
      const r = sectionBox(el).getBoundingClientRect();
      spans.push([r.top + y, r.bottom + y]);
    });
  };
  measure();
  ScrollTrigger.addEventListener('refresh', measure);
  return { spans, measure, stop: () => ScrollTrigger.removeEventListener('refresh', measure) };
}
