import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, Draggable, InertiaPlugin, CustomEase, useGSAP);

// House curves: a heavy, "machined" deceleration and a cinematic in-out.
CustomEase.create('svg.out', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('svg.cine', 'M0,0 C0.7,0 0.15,1 1,1');
gsap.defaults({ ease: 'svg.out', duration: 1.2 });

// Mobile browsers resize the viewport when the address bar shows/hides; refreshing
// every trigger on that is the #1 source of scroll jank on Android. Ignore it.
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

// `?static` renders the page with motion off (handy for screenshots and reviews).
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('static'));

/**
 * "Lite" tier: phones, tablets, low-core / low-RAM machines and Data Saver users.
 * The design stays identical; only expensive *rendering* (full-screen clip-path
 * scrubs, backdrop blur, blur filters, film grain, smooth-scroll emulation) is swapped
 * for cheap equivalents. Decided before first paint in main.jsx, and can be switched
 * on later by the frame-rate probe for slow PCs that pass the hardware checks.
 */
export const detectLite = () => {
  if (typeof window === 'undefined') return false;
  const n = navigator;
  if (new URLSearchParams(location.search).has('full')) return false;
  if (new URLSearchParams(location.search).has('lite')) return true;
  return (
    !!n.connection?.saveData ||
    (n.deviceMemory && n.deviceMemory <= 4) ||
    (n.hardwareConcurrency && n.hardwareConcurrency <= 4) ||
    window.matchMedia('(pointer: coarse)').matches
  );
};
export const isLite = () => typeof document !== 'undefined' && document.documentElement.classList.contains('lite');

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

// Dev-only handle for debugging timelines from the console.
if (import.meta.env.DEV && typeof window !== 'undefined') window.__gsap = { gsap, ScrollTrigger };
