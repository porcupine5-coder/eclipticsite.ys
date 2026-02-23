'use client';

import { useState } from 'react';
import SocialCard from './SocialCard';
import ContactBackground from './ContactBackground';

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus(null);
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message')
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to send message.');
        return;
      }

      form.reset();
      setStatus('success');
      setStatusMessage('Message sent successfully!');
    } catch {
      setStatus('error');
      setStatusMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <ContactBackground />
      <div className="contact-header">
        <h2 className="section-title">Get in Touch</h2>
        <p className="contact-subtitle">Let&apos;s build something extraordinary together</p>
      </div>

      <div className="contact-main-wrapper">
        {/* Social Media Cards - Radial Orbit */}
        <div className="contact-socials-wrapper">
          <SocialCard />
        </div>
      </div>
      <div className="contact-grid-container">
        <div className="contact-info-panel glass-panel">
          <div className="info-header">
            <h3 className="cyber-subheading">Contact Intelligence</h3>
            <div className="cyber-line"></div>
          </div>

          <div className="contact-details-v2">
            <div className="contact-item-v2">
              <div className="item-icon-wrapper">
                <i className="fas fa-phone"></i>
                <div className="icon-glow"></div>
              </div>
              <div className="item-text">
                <span className="mono-label">Communication Line</span>
                <p className="mono-stat-small">+977 9703574761</p>
              </div>
            </div>

            <div className="contact-item-v2">
              <div className="item-icon-wrapper">
                <i className="fab fa-instagram"></i>
                <div className="icon-glow"></div>
              </div>
              <div className="item-text">
                <span className="mono-label">Social Frequency</span>
                <a href="https://www.instagram.com/7yathartha5_shrestha3" target="_blank" rel="noopener noreferrer">@7yathartha5_shrestha3</a>
              </div>
            </div>

            <div className="contact-item-v2">
              <div className="item-icon-wrapper">
                <i className="fas fa-envelope"></i>
                <div className="icon-glow"></div>
              </div>
              <div className="item-text">
                <span className="mono-label">Digital Correspondence</span>
                <p className="mono-stat-small">ytsshrts@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="info-footer">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="mono-label">Available for new ventures</span>
            </div>
          </div>
        </div>

        <div className="contact-form-panel glass-panel">
          <form
            className="cyber-contact-form"
            id="contactFormV2"
            onSubmit={handleContactSubmit}
          >
            <div className="form-header">
              <h3 className="cyber-subheading">Initiate Transmission</h3>
            </div>

            <div className="cyber-input-group">
              <label htmlFor="contact_name" className="mono-label">Identification</label>
              <div className="input-field-wrapper">
                <input type="text" id="contact_name" name="name" placeholder="Enter Name..." required />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="cyber-input-group">
              <label htmlFor="contact_email" className="mono-label">Coordinate Path</label>
              <div className="input-field-wrapper">
                <input type="email" id="contact_email" name="email" placeholder="Enter Email Address..." required />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="cyber-input-group">
              <label htmlFor="contact_subject" className="mono-label">Encryption Key</label>
              <div className="input-field-wrapper">
                <input type="text" id="contact_subject" name="subject" placeholder="Enter Subject..." required />
                <div className="input-focus-border"></div>
              </div>
            </div>

            <div className="cyber-input-group">
              <label htmlFor="contact_message" className="mono-label">Data Payload</label>
              <div className="input-field-wrapper">
                <textarea id="contact_message" name="message" placeholder="Awaiting your input..." rows="4" required></textarea>
                <div className="input-focus-border"></div>
              </div>
            </div>

            <button type="submit" className="cyber-submit-btn" id="submit-btn" disabled={isSubmitting}>
              <span className="button-text btn-glitch-content">Send Message</span>
              <span className="btn-tag">01</span>
              <span className={`button-loader ${isSubmitting ? '' : 'hidden'}`}>
                <i className="fas fa-spinner fa-spin"></i>
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Success/Error Messages */}
      <div id="success-message" className={`alert success ${status === 'success' ? '' : 'hidden'}`}>
        {statusMessage || 'Message sent successfully!'}
      </div>
      <div id="error-message" className={`alert error ${status === 'error' ? '' : 'hidden'}`}>
        {statusMessage || 'Something went wrong. Please try again.'}
      </div>
    </section>
  );
}
