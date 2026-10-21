/**
 * Per-character "roll" label: on hover of the closest `.roll-host`, each letter
 * flips up to an identical copy, staggered left to right. The copy is drawn by a
 * CSS pseudo-element, so the text exists once in the DOM (clean copy/paste, SEO
 * and screen readers).
 */
export default function Roll({ children, className = '' }) {
  const text = String(children);
  return (
    <span className={`roll ${className}`}>
      {[...text].map((c, i) => (
        // white-space: pre on .roll__c keeps spaces from collapsing
        <span key={i} className="roll__c" style={{ '--i': i }} data-c={c}>
          {c}
        </span>
      ))}
    </span>
  );
}
