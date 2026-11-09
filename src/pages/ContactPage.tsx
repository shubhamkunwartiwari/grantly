import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, Copy, Check, Send, AlertCircle, Clock } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_CONFIG } from '../config/site';
import { Button } from '../components/ui/Button';
import { useGrantlyStore } from '../lib/store';
import { track } from '../lib/analytics';

interface FormState {
  name: string;
  email: string;
  topic: string;
  message: string;
  honeypot: string; // Spam trap
}

interface FormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useGrantlyStore((state) => state.addToast);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    topic: 'general',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  usePageMeta({
    title: 'Contact Grantly Support | Grantly',
    description:
      'Get in touch with the Grantly team for scholarship index suggestions, platform feedback, or partnership questions.',
  });

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SITE_CONFIG.contact.email);
      setCopied(true);
      addToast({
        title: 'Email Copied',
        message: 'Support email copied to your clipboard.',
        variant: 'success',
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Please provide your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!form.topic) {
      errs.topic = 'Please select an inquiry topic.';
    }

    if (!form.message.trim() || form.message.trim().length < 20) {
      errs.message = 'Message must be at least 20 characters in length.';
    } else if (form.message.length > 2000) {
      errs.message = 'Message exceeds the 2,000 character maximum.';
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Move focus to first invalid element
      const firstFieldId = Object.keys(errs)[0];
      const el = document.getElementById(`contact-${firstFieldId}`);
      el?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Spam honeypot trap check
    if (form.honeypot) {
      console.warn('Spam detected via honeypot.');
      navigate('/thank-you', { state: { confirmed: true, name: form.name } });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const endpoint = (import.meta as any).env?.VITE_FORM_ENDPOINT;
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            topic: form.topic,
            message: form.message,
            timestamp: new Date().toISOString(),
          }),
        });
        if (!response.ok) {
          throw new Error('Server returned an error status.');
        }
      } else {
        // Realistic simulated network submission
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      track('contact_submitted', { topic: form.topic });
      navigate('/thank-you', { state: { confirmed: true, name: form.name, email: form.email } });
    } catch (err: any) {
      setSubmissionError('Unable to send your message right now. Your text has been preserved below. Please retry or contact directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12 w-full">
      {/* 1. Header */}
      <div className="space-y-3 pb-6 border-b border-border-hairline">
        <div className="text-xs font-mono text-ink-muted">Inquiry Desk</div>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink-primary font-normal tracking-tight">
          Contact Grantly
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-xl font-body">
          Have questions regarding our eligibility model, want to suggest a new scholarship program, or need assistance? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Contact Details (From SITE_CONFIG) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 space-y-6">
            <h2 className="font-serif text-xl text-ink-primary font-medium">
              Direct Contact
            </h2>

            {/* Email Address with Copy Button */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block">
                Primary Support Email
              </span>
              <div className="p-3 bg-surface-raised rounded-[10px] border border-border-subtle flex items-center justify-between gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="font-medium text-xs sm:text-sm text-brand-primary hover:underline truncate"
                >
                  {SITE_CONFIG.contact.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy support email address"
                  className="p-1.5 rounded-[6px] text-ink-muted hover:text-ink-primary hover:bg-surface-card transition-colors shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-semantic-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* City / Country */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block">
                Operating Location
              </span>
              <div className="flex items-center gap-2 text-sm text-ink-primary">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.location}</span>
              </div>
            </div>

            {/* Office Hours & Response */}
            <div className="pt-4 border-t border-border-subtle space-y-2 text-xs text-ink-muted">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-ink-faint shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-ink-primary">Response Window</div>
                  <div>{SITE_CONFIG.contact.supportResponseTime}</div>
                  <div className="text-[11px] text-ink-faint mt-0.5">{SITE_CONFIG.contact.officeHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-surface-card border border-border-hairline rounded-[16px] p-6 sm:p-8 space-y-5 shadow-xs"
          >
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-medium">
              Send a Message
            </h2>

            {/* Submission Error Alert */}
            {submissionError && (
              <div
                role="alert"
                className="p-4 rounded-[10px] bg-semantic-danger-bg border border-semantic-danger/30 text-semantic-danger text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submissionError}</span>
              </div>
            )}

            {/* Honeypot field (hidden from assistive tech and humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-phone">Leave this blank</label>
              <input
                id="contact-phone"
                type="text"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-ink-primary mb-1">
                Your Full Name <span className="text-semantic-danger">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-err' : undefined}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3.5 py-2.5 text-sm bg-surface-raised border rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.name ? 'border-semantic-danger' : 'border-border-subtle'
                }`}
              />
              {errors.name && (
                <p id="contact-name-err" className="text-xs text-semantic-danger mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-ink-primary mb-1">
                Email Address <span className="text-semantic-danger">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-err' : undefined}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@university.edu"
                className={`w-full px-3.5 py-2.5 text-sm bg-surface-raised border rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.email ? 'border-semantic-danger' : 'border-border-subtle'
                }`}
              />
              {errors.email && (
                <p id="contact-email-err" className="text-xs text-semantic-danger mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="contact-topic" className="block text-xs font-medium text-ink-primary mb-1">
                Inquiry Topic <span className="text-semantic-danger">*</span>
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="general">General Question</option>
                <option value="scholarship_correction">Scholarship Criteria Update</option>
                <option value="suggest_program">Suggest a Scholarship Program</option>
                <option value="technical">Technical Support or Bug Report</option>
                <option value="privacy">Privacy & Local Data Inquiry</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="contact-message" className="text-xs font-medium text-ink-primary">
                  Your Message <span className="text-semantic-danger">*</span>
                </label>
                <span className="text-[11px] font-mono text-ink-muted">
                  {form.message.length}/2000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={5}
                required
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-err' : undefined}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Share your feedback or questions in detail..."
                className={`w-full px-3.5 py-2.5 text-sm bg-surface-raised border rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y ${
                  errors.message ? 'border-semantic-danger' : 'border-border-subtle'
                }`}
              />
              {errors.message && (
                <p id="contact-message-err" className="text-xs text-semantic-danger mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Send message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
