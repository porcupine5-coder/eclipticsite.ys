import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

class InteractionHandler {
  constructor() {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollToPlugin);
    this.lastScrollY = 0;
    this.throttleTimeout = null;
    this.isScrolling = false;

    this.setupDarkMode();
    this.setupScrollNavbar();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupMouseEffects();
    this.setupScrollFloat();
  }

    setupMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggleBtn || !navLinks) return;
    if (toggleBtn.dataset.mobileMenuBound === 'true') return;

    const icon = toggleBtn.querySelector('i');

    const closeMenu = () => {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    };

    const openMenu = () => {
      navLinks.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    };

    const toggleMenu = () => {
      if (navLinks.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggleBtn.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('.input').forEach((input) => {
      input.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.classList.contains('active')) return;
      if (!navLinks.contains(event.target) && !toggleBtn.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });

    toggleBtn.dataset.mobileMenuBound = 'true';
  }

  setupDarkMode() {
    const toggleSwitch = document.getElementById('theme-toggle-switch');
    const htmlElement = document.documentElement;
    
    if (!toggleSwitch || !htmlElement) return;
    if (toggleSwitch.dataset.reactThemeToggle === 'true') return;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      htmlElement.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
    } else {
        toggleSwitch.checked = false;
        htmlElement.removeAttribute('data-theme');
    }

    // Track click coordinates for ripple
    let lastClickX = window.innerWidth / 2;
    let lastClickY = window.innerHeight / 2;

    const label = document.querySelector('.theme-toggle-wrapper .theme-toggle');
    if (label) {
      label.addEventListener('click', (e) => {
        lastClickX = e.clientX;
        lastClickY = e.clientY;
      });
    }

    toggleSwitch.addEventListener('change', () => {
      const isChecked = toggleSwitch.checked; // Checked = Dark Mode
      const nextTheme = isChecked ? 'dark' : 'light';
      
      // Ripple Effect
      const ripple = document.createElement('div');
      ripple.classList.add('theme-ripple');
      
      // Calculate size to cover screen
      const maxDim = Math.max(window.innerWidth, window.innerHeight);
      const size = maxDim * 2.8;
      
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${lastClickX - size / 2}px`;
      ripple.style.top = `${lastClickY - size / 2}px`;
      ripple.style.position = 'fixed';
      ripple.style.borderRadius = '50%';
      ripple.style.zIndex = '9999';
      ripple.style.pointerEvents = 'none';
      
      // Set color based on NEXT theme
      ripple.style.backgroundColor = nextTheme === 'dark' ? '#0F172A' : '#F9FAFB';
      
      document.body.appendChild(ripple);
      
      // Animate with GSAP
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Switch Theme on HTML element
            if (!isChecked) { // Unchecked = Light
              htmlElement.removeAttribute('data-theme');
              localStorage.setItem('theme', 'light');
            } else { // Checked = Dark
              htmlElement.setAttribute('data-theme', 'dark');
              localStorage.setItem('theme', 'dark');
            }
            
            // Fade out ripple faster to reveal content
            gsap.to(ripple, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                ripple.remove();
              }
            });
          }
        }
      );
    });
  }

  setupScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // ScrollSpy Logic
    const sections = ['home', 'services', 'features', 'pricing', 'contact'];
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Glassmorphism effect
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/Show logic
      if (Math.abs(currentScrollY - this.lastScrollY) > 10) { // Threshold
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
          // Scrolling down
          navbar.classList.add('hidden');
        } else {
          // Scrolling up
          navbar.classList.remove('hidden');
        }
        this.lastScrollY = currentScrollY;
      }

      // ScrollSpy: Update active radio button
      if (!this.isScrolling) {
        let currentSection = '';
        
        // Find which section is currently in view
        for (const sectionId of sections) {
          const section = document.getElementById(sectionId);
          if (section) {
            const rect = section.getBoundingClientRect();
            // Check if section top is near the top of viewport (considering navbar height ~80px)
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = sectionId;
            }
          }
        }

        if (currentSection) {
          const navInput = document.getElementById(`nav-${currentSection}`);
          if (navInput && !navInput.checked) {
            navInput.checked = true;
          }
        }
      }
    });
  }

  setupSmoothScroll() {
    // Handle Radio Buttons
    const navInputs = document.querySelectorAll('.nav-glitch-container .input');
    navInputs.forEach(input => {
      input.addEventListener('click', () => {
        const targetId = input.id.replace('nav-', '');
        const target = document.getElementById(targetId);
        
        if (target) {
            this.isScrolling = true;
            
            gsap.to(window, {
                scrollTo: {
                    y: target,
                    offsetY: 80, // Offset for navbar
                    autoKill: false
                },
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    this.isScrolling = false;
                }
            });
        }
      });
    });

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        
        try {
          const target = document.querySelector(href);
          
          if (target) {
            this.isScrolling = true;
            gsap.to(window, {
              scrollTo: {
                y: target,
                offsetY: 80,
                autoKill: false
              },
              duration: 1,
              ease: 'power2.inOut',
              onComplete: () => {
                  this.isScrolling = false;
              }
            });
          }
        } catch {
          console.error('Invalid selector:', href);
        }
      });
    });
  }

  setupMouseEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    document.addEventListener('mousemove', (e) => {
      if (this.throttleTimeout) return;
      
      this.throttleTimeout = setTimeout(() => {
        this.throttleTimeout = null;
      }, 16); // 60fps cap
      
      const mouseX = (e.clientX - window.innerWidth / 2) / 100;
      const mouseY = (e.clientY - window.innerHeight / 2) / 100;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;

        // Layered effect: foreground moves faster if speed > 0.1
        const depth = speed > 0.1 ? 2 : 1;

        gsap.to(el, {
          x: mouseX * speed * 50 * depth,
          y: mouseY * speed * 50 * depth,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    });
  }

  setupScrollFloat() {
    if (typeof window === 'undefined') return;

    const floatCards = document.querySelectorAll('.scroll-float-card');
    if (!floatCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered delay based on index
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    floatCards.forEach(card => observer.observe(card));
  }
}

export default InteractionHandler;










