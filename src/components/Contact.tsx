import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const isFormspree = content.formAction && content.formAction.includes('formspree.io');
    const endpoint = content.formAction || '/';

    try {
      if (isFormspree) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
        } else {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to submit form');
        }
      } else {
        const params = new URLSearchParams();
        params.append('form-name', 'contact');
        params.append('name', formData.name);
        params.append('email', formData.email);
        params.append('message', formData.message);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        if (response.ok || response.status === 200 || response.type === 'opaque') {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
        } else {
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Local dev submission captured:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
          } else {
            throw new Error(`Server returned code ${response.status}`);
          }
        }
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(err.message || t.contact.form.errorMessage);
      }
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section
      id="contact"
      aria-label="Contact Section"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative bg-[#0E1110]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Huge Heading, Narrative, GitHub Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-0.5 bg-[#3DAA85]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#3DAA85] font-bold">
                Get In Touch
              </span>
            </div>

            {/* Huge Heading - Solid Color */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-heading tracking-tight uppercase text-[#E8EDE9] leading-[0.95] mb-6">
              {t.contact.heading}
            </h2>

            <p className="text-base sm:text-lg text-[#8A948E] leading-relaxed mb-8 max-w-lg">
              {t.contact.subheading}
            </p>
          </div>

          {/* Social Links & Plain Outline GitHub Button */}
          <div className="pt-6 border-t border-[#2A302D] flex flex-wrap items-center gap-4">
            <a
              href={content.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold hover:text-white"
            >
              <GithubIcon className="w-4 h-4 text-[#E8EDE9]" />
              <span>{t.contact.githubButton}</span>
            </a>

            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                <span>{content.email}</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Column: Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="bg-[#151A18] rounded-[2rem] border-2 border-[#2A302D] p-6 sm:p-10 relative">
            {status === 'success' ? (
              /* Success State */
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3DAA85]/10 border border-[#3DAA85]/30 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#3DAA85]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading uppercase text-white mb-2">
                  {t.contact.form.successTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#8A948E] max-w-md mb-8 leading-relaxed">
                  {t.contact.form.successMessage}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.contact.form.sendAnother}</span>
                </button>
              </div>
            ) : (
              /* Contact Form */
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                {/* Error Banner if submission failed */}
                {status === 'error' && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{t.contact.form.errorTitle}</div>
                      <div>{errorMessage || t.contact.form.errorMessage}</div>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono font-medium text-[#8A948E] uppercase tracking-wider mb-2"
                  >
                    {t.contact.form.nameLabel} <span className="text-[#3DAA85]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.form.namePlaceholder}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0E1110] border-2 border-[#2A302D] text-[#E8EDE9] placeholder-[#8A948E]/50 focus:border-[#3DAA85] focus:outline-none transition-colors text-sm sm:text-base font-normal"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono font-medium text-[#8A948E] uppercase tracking-wider mb-2"
                  >
                    {t.contact.form.emailLabel} <span className="text-[#3DAA85]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.form.emailPlaceholder}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0E1110] border-2 border-[#2A302D] text-[#E8EDE9] placeholder-[#8A948E]/50 focus:border-[#3DAA85] focus:outline-none transition-colors text-sm sm:text-base font-normal"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono font-medium text-[#8A948E] uppercase tracking-wider mb-2"
                  >
                    {t.contact.form.messageLabel} <span className="text-[#3DAA85]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.contact.form.messagePlaceholder}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0E1110] border-2 border-[#2A302D] text-[#E8EDE9] placeholder-[#8A948E]/50 focus:border-[#3DAA85] focus:outline-none transition-colors text-sm sm:text-base resize-none font-normal"
                  />
                </div>

                {/* Solid Flat Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-solid-accent flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <span>{t.contact.form.submitting}</span>
                    ) : (
                      <>
                        <span>{t.contact.form.submitButton}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
