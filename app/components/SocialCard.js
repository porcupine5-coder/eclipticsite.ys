'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SocialCard() {
  const router = useRouter();
  const socialLinksRef = useRef(null);
  const centerButtonRef = useRef(null);
  const [showNotAvailableAlert, setShowNotAvailableAlert] = useState(false);
  const ringText = 'ECLIPTICSITE LINKS';

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/7yathartha5_shrestha3',
      icon: 'instagram',
      color: '#EC4899',
    },
    {
      name: 'Twitter',
      url: 'not-available',
      icon: 'twitter',
      color: '#06B6D4',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/yts-shorts-88ba75360',
      icon: 'linkedin',
      color: '#0EA5E9',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1EP1Ma9gSL/',
      icon: 'facebook',
      color: '#3B82F6',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/porcupine5-coder',
      icon: 'github',
      color: '#1F2937',
    },
    {
      name: 'Discord',
      url: 'not-available',
      icon: 'discord',
      color: '#5865F2',
    },
    {
      name: 'Telegram',
      url: 'not-available',
      icon: 'telegram',
      color: '#0088CC',
    },
    {
      name: 'YouTube',
      url: 'not-available',
      icon: 'youtube',
      color: '#FF0000',
    },
  ];

  const handleSocialClick = (e, social) => {
    if (social.url === 'not-available') {
      e.preventDefault();
      setShowNotAvailableAlert(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && centerButtonRef.current) {
      const centerBtn = centerButtonRef.current;
      const orbitalWrapper = socialLinksRef.current;
      let isExpanded = false;

      const createShockwave = (gsap) => {
        const shockwave = document.createElement('div');
        shockwave.className = 'orbital-shockwave';
        orbitalWrapper.appendChild(shockwave);

        gsap.to(shockwave, {
          width: 500,
          height: 500,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => shockwave.remove()
        });
      };

      const createParticles = (gsap) => {
        const count = 16;
        for (let i = 0; i < count; i++) {
          const particle = document.createElement('div');
          particle.className = 'orbital-particle';
          const angle = (i / count) * Math.PI * 2;
          const velocity = 80 + Math.random() * 60;

          orbitalWrapper.appendChild(particle);

          gsap.set(particle, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: Math.random() * 1 + 0.5
          });

          gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0,
            duration: 0.6 + Math.random() * 0.4,
            ease: 'power3.out',
            onComplete: () => particle.remove()
          });
        }
      };

      const toggleOrbital = () => {
        if (typeof window !== 'undefined') {
          import('gsap').then(({ default: gsap }) => {
            const cards = socialLinksRef.current?.querySelectorAll('.orbital-card');
            if (!cards) return;

            isExpanded = !isExpanded;

            // Trigger "Wow" effects
            createShockwave(gsap);
            createParticles(gsap);

            // High-intensity center button animation
            gsap.to(centerBtn, {
              scale: isExpanded ? 1.2 : 0.9,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.to(centerBtn, {
                  scale: isExpanded ? 1.15 : 1,
                  rotation: isExpanded ? 360 : 0,
                  duration: 0.8,
                  ease: 'elastic.out(1, 0.5)'
                });
              }
            });

            // Accelerate ring text rotation
            const textElement = centerBtn.querySelector('.orbital-center-btn-text');
            if (textElement) {
              gsap.to(textElement, {
                timeScale: 4,
                duration: 0.3,
                onComplete: () => {
                  gsap.to(textElement, {
                    timeScale: 1,
                    duration: 1.5,
                    ease: 'power2.in'
                  });
                }
              });
            }

            cards.forEach((card, index) => {
              const angle = (index / cards.length) * Math.PI * 2;
              const radius = 130;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              if (isExpanded) {
                gsap.to(card, {
                  x: x,
                  y: y,
                  opacity: 1,
                  scale: 1,
                  rotation: index % 2 === 0 ? 10 : -10,
                  duration: 0.6,
                  ease: 'back.out(1.7)',
                  delay: index * 0.04,
                });
              } else {
                gsap.to(card, {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.3,
                  rotation: 0,
                  duration: 0.5,
                  ease: 'back.in(1.7)',
                  delay: (cards.length - index - 1) * 0.03,
                });
              }
            });
          });
        }
      };

      centerBtn.addEventListener('click', toggleOrbital);

      return () => {
        centerBtn.removeEventListener('click', toggleOrbital);
      };
    }
  }, []);

  return (
    <div className="social-cards-container">
      <div className="social-orbital-wrapper" ref={socialLinksRef}>
        {/* Center Button */}
        <button
          ref={centerButtonRef}
          className="orbital-center-btn"
          title="Toggle Social Links"
          aria-label="Toggle Social Links"
        >
          <p className="orbital-center-btn-text" aria-hidden="true">
            {ringText.split('').map((char, index) => (
              <span key={`${char}-${index}`} style={{ '--index': `${index}` }}>
                {char}
              </span>
            ))}
          </p>
          <div className="orbital-center-btn-circle">
            <Image
              src="/logo.png"
              alt="Eclipticsite"
              className="orbital-center-logo"
              width={30}
              height={30}
            />
          </div>
        </button>

        {/* Orbital Cards */}
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url === 'not-available' ? '#' : social.url}
            target={social.url === 'not-available' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="orbital-card"
            title={social.name}
            onClick={(e) => handleSocialClick(e, social)}
            style={{
              '--social-color': social.color,
            }}
          >
            <i className={`fab fa-${social.icon}`}></i>
            <span className="orbital-tooltip">{social.name}</span>
          </a>
        ))}
      </div>

      {/* Alert for unavailable profiles */}
      {showNotAvailableAlert && (
        <div className="cyberpunk-overlay active">
          <div className="cyberpunk-alert-box">
            <div className="cyberpunk-text glitch-text" data-text="Profile Not Available">
              Profile Not Available
            </div>
            <button className="cyberpunk-btn" onClick={() => setShowNotAvailableAlert(false)}>
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
