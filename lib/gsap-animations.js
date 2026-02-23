import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

class GSAPAnimations {
  constructor() {
    if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }
  }

  // Hero section animations
  initializeHeroAnimation() {
    const heroTL = gsap.timeline();
    
    // Animate particles background (canvas)
    heroTL.from('#hero-canvas', {
      opacity: 0,
      duration: 1.5
    }, 0);

    // Main Title Animation
    heroTL.from('.hero-content h1', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'back.out(1.7)'
    }, 0.5);

    // Subtitle
    heroTL.from('.hero-content p', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.8);

    // CTA Button
    heroTL.from('.cta-button', {
      opacity: 0,
      scale: 0.3,
      rotateX: 90,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, 1.0);

    // Floating animation for CTA (using GSAP instead of CSS for more control)
    gsap.to('.cta-button', {
      y: -10,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 2
    });

    return heroTL;
  }

  // Service cards scroll animation with enhanced micro-interactions
  initializeServiceCardsAnimation() {
    const serviceCards = gsap.utils.toArray('.service-card');

    serviceCards.forEach((card, index) => {
      // Entrance animation with stagger on scroll
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        scale: 0.85,
        rotationX: 15,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'cubic.out'
      });

      // Icon scroll parallax effect
      const icon = card.querySelector('.service-icon');
      if (icon) {
        gsap.to(icon, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        });
      }
    });
  }

  // Feature cards entrance animation with enhanced micro-interactions
  initializeFeatureCardsAnimation() {
    const featureCards = gsap.utils.toArray('.feature-card');

    featureCards.forEach((card, index) => {
      // Entrance animation with stagger on scroll
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        scale: 0.85,
        rotationX: 15,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'cubic.out'
      });

      // Icon animations with better micro-interactions
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        // Subtle bounce and float animation on scroll
        gsap.to(icon, {
          y: -15,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });

        // Gentle pulse scale animation
        gsap.to(icon, {
          scale: 1.08,
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.5
        });
      }
    });
  }

  // Pricing card animations with enhanced micro-interactions
  initializePricingAnimation() {
    const pricingCards = gsap.utils.toArray('.pricing-card');

    pricingCards.forEach((card, index) => {
      const isPopular = card.classList.contains('popular');
      
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        scale: isPopular ? 0.85 : 0.9,
        rotationX: isPopular ? 10 : 8,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'cubic.out'
      });
    });
  }

  animatePriceChange(element, newText) {
      // Smooth cross-fade with subtle scale animation
      const tl = gsap.timeline();
      
      // Fade out and scale down current price
      tl.to(element, {
          opacity: 0,
          scale: 0.85,
          duration: 0.25,
          ease: 'cubic.inOut'
      }, 0)
      .call(() => {
          element.innerText = newText;
      }, null, 0.25)
      // Fade in and scale up new price with slight delay for smooth cross-fade
      .fromTo(element,
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'cubic.out' },
          0.25
      );
  }

  // Form field animations
  initializeFormAnimation() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
          borderColor: '#6366F1',
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          boxShadow: '0 0 0 0px rgba(99, 102, 241, 0)',
          borderColor: '#D1D5DB', // Should match variable but hardcoded here for now
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });
  }

  // Orbital animation for social cards
  initializeOrbitalAnimation() {
    const centerBtn = document.querySelector('.orbital-center-btn');
    if (!centerBtn) return;

    let isExpanded = false;

    const toggleOrbital = () => {
      const cards = document.querySelectorAll('.orbital-card');
      if (!cards.length) return;

      isExpanded = !isExpanded;

      cards.forEach((card, index) => {
        const angle = (index / cards.length) * Math.PI * 2;
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (isExpanded) {
          gsap.to(card, {
            x: x,
            y: y,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.05,
          });
        } else {
          gsap.to(card, {
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.3,
            duration: 0.5,
            ease: 'back.in(1.7)',
            delay: (cards.length - index - 1) * 0.05,
          });
        }
      });

      // Rotate center button
      gsap.to(centerBtn, {
        rotation: isExpanded ? 45 : 0,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    };

    centerBtn.addEventListener('click', toggleOrbital);
  }

  // Success animation with confetti
  showSuccessAnimation(buttonSelector) {
    const button = document.querySelector(buttonSelector);
    if (!button) return;
    
    const confettiContainer = document.createElement('div');
    document.body.appendChild(confettiContainer);

    // Get button center position dynamically
    const getButtonCenter = () => {
      const rect = button.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top
      };
    };

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const colors = ['#6366F1', '#EC4899', '#F59E0B'];
      const position = getButtonCenter();
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${position.x}px;
        top: ${position.y}px;
        pointer-events: none;
        z-index: 9999;
      `;
      confettiContainer.appendChild(confetti);

      gsap.to(confetti, {
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => confetti.remove()
      });
    }
    
    // Remove container after animation
    setTimeout(() => confettiContainer.remove(), 2500);
  }
}

export default GSAPAnimations;
