import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

class InteractionHandler {
  constructor() {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollToPlugin);
    this.lastScrollY = 0;
    this.throttleTimeout = null;
    this.isScrolling = false; // Flag to prevent ScrollSpy conflicts
    
    this.setupDarkMode();
    this.setupScrollNavbar();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupMouseEffects();
  }

  setupMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggleBtn || !navLinks) return;

    // Remove existing listeners to prevent duplicates if re-initialized
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
    
    newToggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = newToggleBtn.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a radio input (selection made)
    navLinks.querySelectorAll('.input').forEach(input => {
      input.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = newToggleBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }

  setupDarkMode() {
    const toggleSwitch = document.getElementById('theme-toggle-switch');
    if (!toggleSwitch) return;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.setAttribute('data-theme', 'dark');
      toggleSwitch.checked = true;
    } else {
        toggleSwitch.checked = false;
        document.body.removeAttribute('data-theme');
    }

    // Track click coordinates for ripple
    let lastClickX = window.innerWidth / 2;
    let lastClickY = window.innerHeight / 2;

    const label = document.querySelector('.theme-toggle-wrapper .label');
    if (label) {
        label.addEventListener('click', (e) => {
            lastClickX = e.clientX;
            lastClickY = e.clientY;
        });
    }

    toggleSwitch.addEventListener('change', (e) => {
      const isChecked = toggleSwitch.checked; // Checked = Dark Mode
      const nextTheme = isChecked ? 'dark' : 'light';
      
      // Ripple Effect
      const ripple = document.createElement('div');
      ripple.classList.add('theme-ripple');
      
      // Calculate size to cover screen
      const rect = document.body.getBoundingClientRect();
      const maxDim = Math.max(rect.width, rect.height);
      const size = maxDim * 2.5; // Ensure it covers corners
      
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${lastClickX - size / 2}px`;
      ripple.style.top = `${lastClickY - size / 2}px`;
      
      // Set color based on NEXT theme
      // Using the variables from CSS
      ripple.style.backgroundColor = nextTheme === 'dark' ? '#111827' : '#F9FAFB';
      
      document.body.appendChild(ripple);
      
      // Animate with GSAP
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            // Switch Theme
            if (!isChecked) { // Unchecked = Light
              document.body.removeAttribute('data-theme');
              localStorage.setItem('theme', 'light');
            } else { // Checked = Dark
              document.body.setAttribute('data-theme', 'dark');
              localStorage.setItem('theme', 'dark');
            }
            
            // Fade out ripple
            gsap.to(ripple, {
              opacity: 0,
              duration: 0.2,
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
      input.addEventListener('click', (e) => {
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
        } catch (error) {
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
}

export default InteractionHandler;
