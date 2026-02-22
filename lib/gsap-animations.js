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

  // Service cards scroll animation
  initializeServiceCardsAnimation() {
    const serviceCards = gsap.utils.toArray('.service-card');

    serviceCards.forEach((card, index) => {
      // Entrance
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'back.out(1.2)'
      });

      const icon = card.querySelector('.service-icon');
      if (icon) {
        gsap.to(icon, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }

  // Feature cards entrance animation
  initializeFeatureCardsAnimation() {
    const featureCards = gsap.utils.toArray('.feature-card');

    featureCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'back.out(1.2)'
      });
    });
  }

  // Pricing card animations
  initializePricingAnimation() {
    const pricingCards = gsap.utils.toArray('.pricing-card');

    pricingCards.forEach((card, index) => {
      const isPopular = card.classList.contains('popular');
      
      gsap.from(card, {
        scrollTrigger: {
          trigger: '.pricing-section',
          start: 'top 70%'
        },
        opacity: 0,
        y: 60,
        scale: isPopular ? 0.8 : 0.9,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'back.out(1.2)'
      });
    });
  }

  animatePriceChange(element, newText) {
      gsap.to(element, {
          opacity: 0,
          scale: 0.8,
          rotateY: 90,
          duration: 0.3,
          ease: 'back.in',
          onComplete: () => {
              element.innerText = newText;
              gsap.fromTo(element, 
                  { opacity: 0, scale: 0.8, rotateY: -90 },
                  { opacity: 1, scale: 1, rotateY: 0, duration: 0.3, ease: 'back.out' }
              );
          }
      });
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
