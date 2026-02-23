'use client';

import Link from 'next/link';
import TextType from './TextType';
import { scrollToSection } from '../../lib/scrollToSection';

export default function HeroSection() {
  const scrollToPricing = () => {
    scrollToSection('pricing');
  };

  return (
    <section className="hero" id="home">
      {/* Canvas will be injected here by three-scene.js */}
      <div className="hero-decor hero-orbit" aria-hidden="true">
        <div className="hero-orbit-ring"></div>
        <div className="hero-orbit-core"></div>
      </div>
      <div className="hero-decor hero-glow" aria-hidden="true"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <TextType
            text="Next-Gen Commerce with AI"
            fontVariant="cyber"
            typingSpeed={40}
            showCursor={false}
            startOnVisible={true}
            loop={false}
            hideCursorOnComplete={true}
          />
        </div>
        <h1 className="hero-title">
          <TextType
            text={[
              "We Make Websites That Convert",
              "Transform Your E-commerce Vision",
              "Elevate Your Digital Presence",
              "Empowering Your Online Success",
              "Crafting Digital Experiences That Sell",
              "Your E-commerce Journey Starts Here",
            ]}
            typingSpeed={60}
            deletingSpeed={40}
            pauseDuration={2500}
            showCursor
            cursorCharacter="|"
            cursorBlinkDuration={0.5}
            loop={true}
            as="span"
            className="hero-title-typing"
            fontVariant="cyber"
          />
        </h1>
        <p className="hero-subtitle">
          Powerful solutions for modern online businesses. We build the infrastructure for your
          digital future with speed and precision.
        </p>
        <div className="hero-actions">
          <button
            className="animated-button animated-button-primary"
            onClick={scrollToPricing}
          >
            <span>Get Started</span>
          </button>
          <Link className="animated-button animated-button-secondary" href="/about">
            <span>About Us</span>
          </Link>
        </div>

        <div className="hero-stats">
          <div>
            <TextType
              text="90%"
              fontVariant="mono"
              className="hero-stat-value"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="hero-stat-label">Uptime</div>
          </div>
          <div>
            <TextType
              text="AI"
              fontVariant="mono"
              className="hero-stat-value"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="hero-stat-label">Integration</div>
          </div>
          <div>
            <TextType
              text="24/7"
              fontVariant="mono"
              className="hero-stat-value"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="hero-stat-label">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
