import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ImagePlus, Loader2, Mail, Phone, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CONTACT, SERVICE_OPTIONS, SURFACE_OPTIONS } from '../content';
import { submitLead, type Lead } from '../lib/leads';
import { Heading, Reveal, ease } from './ui';

type Fields = Omit<Lead, 'property_type'> & { property_type: '' | Lead['property_type'] };
const EMPTY: Fields = { full_name: '', phone: '', email: '', service: '', surface_type: '', property_type: '', location: '', description: '' };
const MAX_FILES = 6, MAX_MB = 10;
const RATE_KEY = 'ironwood:last-submit';

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.full_name.trim().length < 2) e.full_name = 'Please enter your full name.';
  if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.service) e.service = 'Select a service.';
  if (!f.surface_type) e.surface_type = 'Select a surface type.';
  if (!f.property_type) e.property_type = 'Select a property type.';
  if (f.location.trim().length < 2) e.location = 'Please enter the project location.';
  if (f.description.trim().length < 10) e.description = 'Tell us a little more about your project (10+ characters).';
  return e;
}

export default function Estimate() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const mountedAt = useRef(Date.now());
  const firstName = useRef('');

  useEffect(() => {
    const on = (e: Event) => setF((x) => ({ ...x, service: (e as CustomEvent<string>).detail }));
    window.addEventListener('ironwood:service', on);
    return () => window.removeEventListener('ironwood:service', on);
  }, []);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const set = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFileError('');
    const next = [...files];
    for (const file of Array.from(list)) {
      if (!file.type.startsWith('image/')) { setFileError('Only image files can be uploaded.'); continue; }
      if (file.size > MAX_MB * 1024 * 1024) { setFileError(`Each photo must be under ${MAX_MB} MB.`); continue; }
      if (next.length >= MAX_FILES) { setFileError(`Up to ${MAX_FILES} photos.`); break; }
      next.push(file);
    }
    setFiles(next);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(f);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(`f-${Object.keys(v)[0]}`)?.focus();
      return;
    }
    // spam protection: honeypot, minimum fill time, client-side rate limit
    if (hp || Date.now() - mountedAt.current < 3000) { setState('done'); return; }
    let last = 0;
    try { last = Number(localStorage.getItem(RATE_KEY) || 0); } catch { /* storage unavailable */ }
    if (Date.now() - last < 60_000) { setServerError('Your request was just sent. Please wait a minute before submitting another.'); setState('error'); return; }

    setState('sending'); setServerError('');
    try {
      await submitLead({ ...f, property_type: f.property_type as Lead['property_type'] }, files);
      try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch { /* ignore */ }
      firstName.current = f.full_name.trim().split(/\s+/)[0];
      setState('done'); setF(EMPTY); setFiles([]);
    } catch (err) {
      setServerError((err as Error).message); setState('error');
    }
  };

  const err = (k: keyof Fields) => errors[k] && <p id={`e-${k}`} className="mt-2 text-[11px] text-[#d9a38a]">{errors[k]}</p>;
  const aria = (k: keyof Fields) => ({ id: `f-${k}`, 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  return (
    <section id="estimate" className="relative overflow-hidden bg-charcoal px-5 py-28 md:px-10 md:py-40">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[160px]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <Heading eyebrow="Free Estimate" title={<>Let’s restore<br />your surfaces.</>}
            intro="Tell us about your project. Our team will help you explore the right restoration solution for your surfaces." />
          <Reveal delay={0.2} className="mt-12 space-y-5 border-t border-ivory/10 pt-10 text-sm text-ivory/60">
            <p className="text-[10px] uppercase tracking-luxe text-gold">What happens next</p>
            {['We review your details and photos', 'We contact you to discuss your surfaces', 'We arrange an assessment if needed'].map((s, i) => (
              <p key={s} className="flex items-center gap-4"><span className="font-serif italic text-gold">0{i + 1}</span>{s}</p>
            ))}
            <div className="flex flex-col gap-3 pt-6">
              <a href={CONTACT.phoneHref} className="flex items-center gap-3 hover:text-gold"><Phone size={14} strokeWidth={1.2} className="text-gold" />{CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all hover:text-gold"><Mail size={14} strokeWidth={1.2} className="shrink-0 text-gold" />{CONTACT.email}</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative border border-ivory/10 bg-obsidian/60 p-6 backdrop-blur md:p-12">
          <span className="absolute -left-px -top-px h-10 w-10 border-l border-t border-gold" />
          <span className="absolute -bottom-px -right-px h-10 w-10 border-b border-r border-gold" />
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="flex min-h-[520px] flex-col items-start justify-center" role="status">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold"><Check size={22} strokeWidth={1.2} /></span>
                <h3 className="mt-8 font-serif text-4xl font-light uppercase tracking-[0.05em]">Thank you{firstName.current ? `, ${firstName.current}` : ''}.</h3>
                <div className="gold-rule mt-6" />
                <p className="mt-6 max-w-md leading-relaxed text-ivory/65">
                  Your estimate request has been received. Our team will review your project details and reach out to discuss your surfaces and next steps.
                </p>
                <p className="mt-4 max-w-md text-xs leading-relaxed text-ivory/40">Please note: an estimate is provided only after our team has reviewed your project.</p>
                <button onClick={() => { setState('idle'); mountedAt.current = Date.now(); }} className="btn-ghost mt-10">Submit another request</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="grid gap-x-8 gap-y-8 md:grid-cols-2" aria-label="Free estimate request">
                <div>
                  <label htmlFor="f-full_name" className="label">Full Name *</label>
                  <input {...aria('full_name')} className="field" autoComplete="name" value={f.full_name} onChange={set('full_name')} placeholder="Your name" />
                  {err('full_name')}
                </div>
                <div>
                  <label htmlFor="f-phone" className="label">Phone Number *</label>
                  <input {...aria('phone')} className="field" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} placeholder="(000) 000-0000" />
                  {err('phone')}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="f-email" className="label">Email Address *</label>
                  <input {...aria('email')} className="field" type="email" autoComplete="email" value={f.email} onChange={set('email')} placeholder="you@example.com" />
                  {err('email')}
                </div>
                <div>
                  <label htmlFor="f-service" className="label">Service Needed *</label>
                  <select {...aria('service')} className="field" value={f.service} onChange={set('service')}>
                    <option value="" disabled>Select a service</option>
                    {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {err('service')}
                </div>
                <div>
                  <label htmlFor="f-surface_type" className="label">Surface Type *</label>
                  <select {...aria('surface_type')} className="field" value={f.surface_type} onChange={set('surface_type')}>
                    <option value="" disabled>Select a surface</option>
                    {SURFACE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {err('surface_type')}
                </div>
                <fieldset className="md:col-span-2">
                  <legend className="label">Property Type *</legend>
                  <div className="mt-2 flex gap-3" id="f-property_type" tabIndex={-1}>
                    {(['Residential', 'Commercial'] as const).map((p) => (
                      <label key={p} className={`flex-1 cursor-pointer border px-4 py-3 text-center text-[11px] uppercase tracking-wide2 transition-colors ${f.property_type === p ? 'border-gold bg-gold/10 text-gold' : 'border-ivory/15 text-ivory/60 hover:border-ivory/40'}`}>
                        <input type="radio" name="property_type" value={p} checked={f.property_type === p} onChange={set('property_type')} className="sr-only" />
                        {p}
                      </label>
                    ))}
                  </div>
                  {err('property_type')}
                </fieldset>
                <div className="md:col-span-2">
                  <label htmlFor="f-location" className="label">Project Location *</label>
                  <input {...aria('location')} className="field" autoComplete="address-level2" value={f.location} onChange={set('location')} placeholder="City / neighborhood" />
                  {err('location')}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="f-description" className="label">Project Description *</label>
                  <textarea {...aria('description')} className="field min-h-[110px] resize-y" value={f.description} onChange={set('description')} placeholder="Approximate area, the surfaces involved, and what you'd like to improve." maxLength={2000} />
                  {err('description')}
                </div>
                <div className="md:col-span-2">
                  <span className="label">Upload Project Photos <span className="normal-case tracking-normal text-ivory/30">(optional · up to {MAX_FILES} images, {MAX_MB} MB each)</span></span>
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                    className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-ivory/20 px-6 py-8 text-center text-sm text-ivory/50 transition-colors hover:border-gold hover:text-ivory/80">
                    <ImagePlus size={22} strokeWidth={1.1} className="text-gold" />
                    <span>Drag photos here or <span className="text-gold underline underline-offset-4">browse</span></span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                  </label>
                  {fileError && <p className="mt-2 text-[11px] text-[#d9a38a]">{fileError}</p>}
                  {previews.length > 0 && (
                    <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {previews.map((p, i) => (
                        <li key={p.url} className="group relative aspect-square overflow-hidden bg-charcoal">
                          <img src={p.url} alt={p.file.name} className="h-full w-full object-cover" />
                          <button type="button" onClick={() => setFiles(files.filter((_, k) => k !== i))} aria-label={`Remove ${p.file.name}`}
                            className="absolute right-1 top-1 bg-obsidian/80 p-1 text-ivory"><X size={12} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label>Company website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
                </div>
                <div className="md:col-span-2">
                  {state === 'error' && <p className="mb-4 text-sm text-[#d9a38a]" role="alert">{serverError}</p>}
                  <button type="submit" disabled={state === 'sending'} className="btn-gold group w-full disabled:opacity-60">
                    {state === 'sending' ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <>Request My Free Estimate <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></>}
                  </button>
                  <p className="mt-4 text-center text-[11px] text-ivory/35">Your details are used only to respond to your inquiry.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
