import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content, getWhatsAppUrl } from '../content';

export const ContactPage: React.FC = () => {
  const { lang } = useLanguage();
  const contactT = content.texts[lang].contact;
  const whatsappUrl = getWhatsAppUrl();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const action = content.formAction || form.getAttribute('action') || '';
      const res = await fetch(action || '/', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
      <h1
        className="text-4xl sm:text-5xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {contactT.heading}
      </h1>
      <p className="mb-10 text-base" style={{ color: 'var(--color-soft)' }}>
        {contactT.subheading}
      </p>

      {/* Social links */}
      <div className="flex flex-wrap gap-3 mb-10">
        {content.github && (
          <a
            href={content.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {contactT.githubButton}
          </a>
        )}
        {content.discord && (
          <a
            href={content.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {contactT.discordButton}
          </a>
        )}
        {content.email && (
          <a
            href={`mailto:${content.email}`}
            className="btn-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {contactT.emailDirect}
          </a>
        )}
        {whatsappUrl ? (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
            {contactT.whatsappButton}
          </a>
        ) : null}
      </div>

      {/* Contact Form */}
      {status === 'success' ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
        >
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {contactT.form.successTitle}
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-soft)' }}>
            {contactT.form.successMessage}
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {contactT.form.sendAnother}
          </button>
        </div>
      ) : (
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 flex flex-col gap-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
        >
          <input type="hidden" name="form-name" value="contact" />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-name"
              className="text-sm font-medium"
              style={{ color: 'var(--color-soft)' }}
            >
              {contactT.form.nameLabel}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder={contactT.form.namePlaceholder}
              className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-surface-2)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-email"
              className="text-sm font-medium"
              style={{ color: 'var(--color-soft)' }}
            >
              {contactT.form.emailLabel}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder={contactT.form.emailPlaceholder}
              className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-surface-2)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium"
              style={{ color: 'var(--color-soft)' }}
            >
              {contactT.form.messageLabel}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder={contactT.form.messagePlaceholder}
              className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150 resize-y focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-surface-2)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {status === 'error' && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-muted)',
                color: 'var(--color-soft)',
              }}
            >
              <strong style={{ color: 'var(--color-text)' }}>{contactT.form.errorTitle}</strong>
              {' — '}
              {contactT.form.errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary w-full disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {status === 'submitting' ? contactT.form.submitting : contactT.form.submitButton}
          </button>
        </form>
      )}
    </div>
  );
};
