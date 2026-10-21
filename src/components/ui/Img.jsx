import meta from '../../data/imgMeta.json';

/**
 * Responsive photo: emits a srcset from the generated -w480 / -w960 variants so
 * phones download a fraction of the bytes. Decodes off the main thread.
 * `sizes` should describe the rendered width; the default suits half-width media.
 */
export default function Img({ src, sizes = '(max-width: 900px) 100vw, 50vw', alt = '', ...rest }) {
  const m = /^\/img\/([\w-]+)\.webp$/.exec(src || '');
  const info = m && meta[m[1]];
  const srcSet = info?.v.length ? [...info.v.map((w) => `/img/${m[1]}-w${w}.webp ${w}w`), `${src} ${info.w}w`].join(', ') : undefined;
  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} decoding="async" {...rest} />;
}
