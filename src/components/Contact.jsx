import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin, Clock, ShieldCheck, Check, CheckCircle } from '@phosphor-icons/react';
import Roll from './ui/Roll.jsx';
import './Contact.css';
import Img from './ui/Img.jsx';

const SERVICES = ['FTL / PTL', 'D2C express', 'Warehousing', 'Reverse logistics', 'EV fleet', 'Project rollout', 'Verification'];

export default function Contact() {
  const [picked, setPicked] = useState(['FTL / PTL']);
  const [vol, setVol] = useState(120);
  const [sent, setSent] = useState('idle'); // idle | sending | done
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const submit = (e) => {
    e.preventDefault();
    if (sent !== 'idle') return;
    setSent('sending');
    timer.current = setTimeout(() => setSent('done'), 1400);
  };
  const toggle = (s) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <section id="contact" className="section ct night" data-nav="dark" data-chapter="Contact" data-sheet>
      <div className="ct__bg" aria-hidden="true">
        <Img src="/img/hero-dusk.webp" sizes="100vw" data-parallax="8" loading="lazy" />
      </div>
      <div className="container ct__grid">
        <div className="ct__copy">
          <span className="eyebrow">10 · Start a conversation</span>
          <h2 className="display ct__title" data-split>
            Put your freight on ground we <span className="serif">own.</span>
          </h2>
          <p className="lead" data-reveal>
            Tell us about your lanes, volumes and SLAs. A solutions lead from our Jaipur team will come back with a network
            plan, not a rate card.
          </p>
          <ul className="ct__facts" data-reveal>
            <li><MapPin size={18} weight="light" /> Head office · Jaipur, Rajasthan 302001</li>
            <li><Clock size={18} weight="light" /> We call back within 24 hours</li>
            <li><ShieldCheck size={18} weight="light" /> Pilot programmes available for enterprise lanes</li>
          </ul>
        </div>

        <form className={`ct__form bezel is-${sent}`} onSubmit={submit} data-reveal>
          <div className="bezel__core ct__core">
            <div className="ct__row">
              <Field label="Full name" name="name" />
              <Field label="Work email" name="email" type="email" />
            </div>
            <div className="ct__row">
              <Field label="Company" name="company" />
              <Field label="Phone" name="phone" type="tel" />
            </div>

            <fieldset className="ct__fs">
              <legend className="mono">What do you need moved?</legend>
              <div className="ct__chips">
                {SERVICES.map((s) => (
                  <button type="button" key={s} className={`ct__chip ${picked.includes(s) ? 'is-on' : ''}`} onClick={() => toggle(s)} aria-pressed={picked.includes(s)}>
                    <span className="ct__check" aria-hidden="true">
                      <Check size={11} weight="bold" />
                    </span>
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="ct__row">
              <Field label="Origin city" name="from" />
              <Field label="Destination(s)" name="to" />
            </div>

            <div className="ct__range">
              <div className="ct__range-top">
                <span className="mono">Monthly volume</span>
                <b key={Math.round(vol / 50)} className="ct__vol">
                  {vol >= 1000 ? '1,000+' : vol} <small>tons</small>
                </b>
              </div>
              <div className="ct__ticks mono" aria-hidden="true">
                <span>5</span><span>250</span><span>500</span><span>750</span><span>1,000+</span>
              </div>
              <input type="range" min="5" max="1000" step="5" value={vol} onChange={(e) => setVol(+e.target.value)} style={{ '--p': `${((vol - 5) / 995) * 100}%` }} aria-label="Monthly volume in tons" />
            </div>

            <button className={`ct__submit roll-host is-${sent}`} type="submit">
              <span className="ct__submit-l">
                {sent === 'done' ? (
                  <span className="ct__done">
                    <CheckCircle size={18} weight="fill" /> Received. We'll call you within 24 hours.
                  </span>
                ) : (
                  <Roll>{sent === 'sending' ? 'Sending…' : 'Request a network plan'}</Roll>
                )}
              </span>
              <span className="ct__submit-i">
                <ArrowUpRight size={18} weight="light" />
              </span>
            </button>
            <p className="ct__fine mono">By submitting you agree to our privacy policy. No spam, ever.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text' }) {
  return (
    <label className="fld">
      <input name={name} type={type} placeholder=" " />
      <span>{label}</span>
    </label>
  );
}
