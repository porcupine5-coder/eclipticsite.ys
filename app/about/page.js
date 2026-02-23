'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import LiquidBackground from '../components/LiquidBackground';
import Hyperspeed, { hyperspeedPresets } from '../components/Hyperspeed';
import ThemeToggle from '../components/ThemeToggle';
import TextType from '../components/TextType';
import styles from './page.module.css';

export default function AboutPage() {
  const [isDark, setIsDark] = useState(false);
  const statsRef = useRef(null);
  const autoScrollRafRef = useRef(null);
  const autoScrollStartedRef = useRef(false);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRafRef.current) {
      window.cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollStartedRef.current) return;
    autoScrollStartedRef.current = true;

    let lastTimestamp = 0;
    const pixelsPerSecond = 90;

    const tick = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      const nextScrollTop = Math.min(
        window.scrollY + pixelsPerSecond * deltaSeconds,
        maxScroll
      );

      window.scrollTo({ top: nextScrollTop, behavior: 'auto' });

      if (nextScrollTop >= maxScroll - 1) {
        stopAutoScroll();
        return;
      }

      autoScrollRafRef.current = window.requestAnimationFrame(tick);
    };

    autoScrollRafRef.current = window.requestAnimationFrame(tick);
  }, [stopAutoScroll]);

  // Use useLayoutEffect to check theme synchronously before paint
  useLayoutEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.scroll-float-card');
    if (!cards.length) return;

    const timeouts = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;

          const timeoutId = window.setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);

          timeouts.push(timeoutId);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const interruptAutoScroll = () => stopAutoScroll();
    window.addEventListener('wheel', interruptAutoScroll, { passive: true });
    window.addEventListener('touchstart', interruptAutoScroll, { passive: true });
    window.addEventListener('keydown', interruptAutoScroll);

    return () => {
      window.removeEventListener('wheel', interruptAutoScroll);
      window.removeEventListener('touchstart', interruptAutoScroll);
      window.removeEventListener('keydown', interruptAutoScroll);
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  // ... stats animation logic ...

  return (
    <main className={styles.aboutPage}>
      <div className={styles.themeToggleContainer}>
        <ThemeToggle />
      </div>

      {/* Render Liquid Background in both themes (palette handled in CSS) */}
      <div className={styles.liquidLayer}>
        <LiquidBackground />
      </div>

      <div className={styles.hyperContainer}>
        <Hyperspeed effectOptions={isDark ? hyperspeedPresets.one : hyperspeedPresets.five} />
      </div>

      <div className={styles.contentOverlay} aria-hidden="true" />

      <div className={styles.content}>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              <TextType
                as="span"
                text="EST. 2024"
                fontVariant="mono"
                loop={false}
                showCursor={false}
                typingSpeed={50}
                startOnVisible={true}
              />
            </p>
            <h1 className={styles.title}>
              <TextType
                as="span"
                text="Eclipticsite"
                fontVariant="cyber"
                loop={false}
                hideCursorOnComplete={true}
                typingSpeed={100}
                startOnVisible={true}
                onTypingComplete={startAutoScroll}
              />
              <span className={styles.titleGlow}></span>
            </h1>
            <p className={styles.subtitle}>
              <TextType
                as="span"
                text="We don't just build websites. We engineer digital dominance."
                fontVariant="primary"
                loop={false}
                hideCursorOnComplete={true}
                typingSpeed={30}
                startOnVisible={true}
                initialDelay={1000}
              />
            </p>
          </div>

          <div className={styles.missionGrid}>
            <div className={`${styles.glassCard} scroll-float-card`}>
              <div className={styles.cardHeader}>
                <i className="fa-solid fa-rocket" aria-hidden="true"></i>
                <h2>
                  <TextType as="span" text="Mission" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h2>
              </div>
              <p>
                To shatter the boundaries of conventional web design, fusing AI intelligence with artistic brilliance.
              </p>
            </div>
            <div className={`${styles.glassCard} scroll-float-card`}>
              <div className={styles.cardHeader}>
                <i className="fa-solid fa-eye" aria-hidden="true"></i>
                <h2>
                  <TextType as="span" text="Vision" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h2>
              </div>
              <p>
                A web where speed, beauty, and functionality coexist without compromise.
              </p>
            </div>
          </div>
        </section>

        {/* APPROACH SECTION (BENTO STYLE) */}
        <section className={styles.approach}>
          <h2 className={styles.sectionTitle}>
            <TextType as="span" text="The Ecliptic Standard" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
          </h2>
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoItem} ${styles.bentoLarge} scroll-float-card`}>
              <div className={styles.bentoIcon}><i className="fa-solid fa-microchip"></i></div>
              <h3>
                <TextType as="span" text="Next-Gen Tech" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Powered by the latest frameworks and AI-driven optimizations.
              </p>
            </div>
            <div className={`${styles.bentoItem} scroll-float-card`}>
              <div className={styles.bentoIcon}><i className="fa-solid fa-palette"></i></div>
              <h3>
                <TextType as="span" text="Artistic Soul" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Hand-crafted designs that tell your unique story.
              </p>
            </div>
            <div className={`${styles.bentoItem} scroll-float-card`}>
              <div className={styles.bentoIcon}><i className="fa-solid fa-shield-halved"></i></div>
              <h3>
                <TextType as="span" text="Ironclad Security" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Enterprise-grade protection for peace of mind.
              </p>
            </div>
            <div className={`${styles.bentoItem} ${styles.bentoWide} scroll-float-card`}>
              <div className={styles.bentoIcon}><i className="fa-solid fa-bolt"></i></div>
              <h3>
                <TextType as="span" text="Blazing Performance" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Optimized for speed. Because every millisecond counts in the digital race.
              </p>
            </div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className={styles.story}>
          <h2 className={styles.sectionTitle}>
            <TextType as="span" text="Our Story" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
          </h2>
          <div className={styles.storyContent}>
            <div className={`${styles.storyBlock} scroll-float-card`}>
              <h3>
                <TextType as="span" text="The Genesis" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Eclipticsite was born from a simple observation: the web was becoming increasingly generic. Cookie-cutter templates, bloated frameworks, and uninspired designs were flooding the digital landscape. We saw businesses struggling to stand out, their unique stories buried under layers of mediocrity. That&apos;s when we decided to change the game.
              </p>
            </div>
            <div className={`${styles.storyBlock} scroll-float-card`}>
              <h3>
                <TextType as="span" text="The Revolution" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                We assembled a team of digital rebels—designers who think like artists, developers who code like poets, and strategists who see the web as a canvas for innovation. Together, we crafted a new approach: one that combines cutting-edge technology with timeless design principles, where every pixel serves a purpose and every interaction tells a story.
              </p>
            </div>
            <div className={`${styles.storyBlock} scroll-float-card`}>
              <h3>
                <TextType as="span" text="The Mission Today" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Today, we&apos;re not just building websites—we&apos;re architecting digital experiences that captivate, convert, and leave lasting impressions. From startups disrupting industries to established brands reinventing themselves, we partner with visionaries who refuse to settle for ordinary. Our work has been featured across the web, not because we chase trends, but because we create them.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className={styles.whyChoose}>
          <h2 className={styles.sectionTitle}>
            <TextType as="span" text="Why Choose Eclipticsite" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
          </h2>
          <div className={styles.reasonsGrid}>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="01" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Unmatched Expertise" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Our team brings together decades of combined experience in web development, UI/UX design, and digital strategy. We&apos;ve mastered the latest technologies—React, Next.js, Node.js, AI integration—and we know how to wield them to create experiences that are both beautiful and blazingly fast. We don&apos;t just follow best practices; we define them.
              </p>
            </div>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="02" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Obsessive Attention to Detail" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                We believe that excellence lives in the details. Every animation timing, every color gradient, every micro-interaction is meticulously crafted. We spend hours perfecting elements that users might only see for seconds, because we know that&apos;s what separates good from extraordinary. Our quality assurance process is rigorous—we test across devices, browsers, and scenarios to ensure flawless performance.
              </p>
            </div>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="03" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Results-Driven Approach" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Beautiful design is worthless if it doesn&apos;t drive results. That&apos;s why we anchor every decision in data and business objectives. We optimize for conversions, engagement, and user retention. Our clients typically see 3x improvements in key metrics within the first quarter. We track everything, analyze relentlessly, and iterate continuously to ensure your investment delivers measurable ROI.
              </p>
            </div>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="04" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Future-Proof Solutions" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Technology evolves at lightning speed, and we stay ahead of the curve. We build with scalability in mind, using modular architectures that grow with your business. Our code is clean, documented, and maintainable. We leverage serverless infrastructure, progressive web app capabilities, and AI-powered features to ensure your site remains cutting-edge for years to come.
              </p>
            </div>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="05" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Collaborative Partnership" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                We don&apos;t believe in the traditional client-vendor relationship. We become an extension of your team, invested in your success. You&apos;ll have direct access to our designers and developers, regular progress updates, and complete transparency throughout the project. We listen to your vision, challenge assumptions when needed, and work together to create something truly exceptional.
              </p>
            </div>
            <div className={`${styles.reasonCard} scroll-float-card`}>
              <TextType as="span" text="06" fontVariant="mono" className={styles.reasonNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              <h3>
                <TextType as="span" text="Comprehensive Support" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Our relationship doesn&apos;t end at launch. We provide ongoing maintenance, security updates, performance monitoring, and strategic guidance. Need to add new features? We&apos;re here. Experiencing technical issues? We respond within hours. Want to optimize for a new market? We&apos;ll help you strategize. Consider us your long-term digital partner, committed to your continued growth and success.
              </p>
            </div>
          </div>
        </section>

        {/* OUR PROCESS SECTION */}
        <section className={styles.process}>
          <h2 className={styles.sectionTitle}>
            <TextType as="span" text="Our Process" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
          </h2>
          <div className={styles.processTimeline}>
            <div className={`${styles.processStep} scroll-float-card`}>
              <div className={styles.stepIndicator}>
                <TextType as="span" text="1" fontVariant="mono" className={styles.stepNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <h3>
                  <TextType as="span" text="Discovery & Strategy" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h3>
                <p>
                  We begin by diving deep into your business, goals, and target audience. Through comprehensive research and stakeholder interviews, we uncover insights that inform every design decision. We analyze your competitors, identify market opportunities, and develop a strategic roadmap that aligns technology with your business objectives. This phase sets the foundation for everything that follows.
                </p>
              </div>
            </div>
            <div className={`${styles.processStep} scroll-float-card`}>
              <div className={styles.stepIndicator}>
                <TextType as="span" text="2" fontVariant="mono" className={styles.stepNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <h3>
                  <TextType as="span" text="Design & Prototyping" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h3>
                <p>
                  Armed with insights, our designers craft stunning visual concepts that bring your brand to life. We create detailed wireframes, interactive prototypes, and high-fidelity mockups that let you experience the site before a single line of code is written. We iterate based on your feedback, refining every element until it&apos;s pixel-perfect. This collaborative process ensures the final design exceeds your expectations.
                </p>
              </div>
            </div>
            <div className={`${styles.processStep} scroll-float-card`}>
              <div className={styles.stepIndicator}>
                <TextType as="span" text="3" fontVariant="mono" className={styles.stepNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <h3>
                  <TextType as="span" text="Development & Engineering" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h3>
                <p>
                  This is where the magic happens. Our developers transform designs into living, breathing digital experiences using the latest frameworks and best practices. We write clean, efficient code that&apos;s optimized for performance and scalability. Every component is built with accessibility in mind, ensuring your site works flawlessly for all users. We implement robust backend systems, integrate third-party services, and add sophisticated features that set you apart.
                </p>
              </div>
            </div>
            <div className={`${styles.processStep} scroll-float-card`}>
              <div className={styles.stepIndicator}>
                <TextType as="span" text="4" fontVariant="mono" className={styles.stepNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <h3>
                  <TextType as="span" text="Testing & Optimization" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h3>
                <p>
                  Before launch, we put your site through rigorous testing. We check functionality across devices and browsers, optimize load times, validate accessibility compliance, and stress-test under various conditions. We use real user testing to identify friction points and make data-driven improvements. Our QA process is exhaustive because we know that quality is non-negotiable. Only when everything is perfect do we proceed to launch.
                </p>
              </div>
            </div>
            <div className={`${styles.processStep} scroll-float-card`}>
              <div className={styles.stepIndicator}>
                <TextType as="span" text="5" fontVariant="mono" className={styles.stepNumber} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
              </div>
              <div className={styles.stepContent}>
                <h3>
                  <TextType as="span" text="Launch & Beyond" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
                </h3>
                <p>
                  Launch day is just the beginning. We handle deployment with precision, ensuring zero downtime and smooth transitions. Post-launch, we monitor performance metrics, gather user feedback, and make continuous improvements. We provide training so your team can manage content confidently. And we remain available for ongoing support, updates, and strategic guidance as your business evolves. Your success is our success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className={styles.stats} ref={statsRef}>
          <div className={styles.statItem}>
            <TextType text="500+" fontVariant="mono" className={styles.statValue} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
            <div className={styles.statLabel}>Projects</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <TextType text="99%" fontVariant="mono" className={styles.statValue} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
            <div className={styles.statLabel}>Satisfaction</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <TextType text="24/7" fontVariant="mono" className={styles.statValue} showCursor={false} startOnVisible={true} loop={false} hideCursorOnComplete={true} />
            <div className={styles.statLabel}>Support</div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className={styles.values}>
          <h2 className={styles.sectionTitle}>
            <TextType as="span" text="Our DNA" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
          </h2>
          <div className={styles.valuesGrid}>
            <div className={`${styles.valueCard} scroll-float-card`}>
              <h3>
                <TextType as="span" text="Obsession with Quality" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                We don&apos;t ship &quot;good enough&quot;. We ship perfection.
              </p>
            </div>
            <div className={`${styles.valueCard} scroll-float-card`}>
              <h3>
                <TextType as="span" text="Radical Transparency" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Open processes. clear timelines. No black boxes.
              </p>
            </div>
            <div className={`${styles.valueCard} scroll-float-card`}>
              <h3>
                <TextType as="span" text="Client-Centric" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
              </h3>
              <p>
                Your growth is the only metric that matters to us.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={styles.cta}>
          <div className={styles.ctaGlass}>
            <h2>
              <TextType as="span" text="Ready to Evolve?" fontVariant="cyber" loop={false} hideCursorOnComplete={true} startOnVisible={true} />
            </h2>
            <div className={styles.ctaButtons}>
              <Link href="/" className="animated-button animated-button-primary">
                <span>Back to home</span>
              </Link>
              <Link href="/#contact" className="animated-button animated-button-secondary">
                <span>Start Project</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
