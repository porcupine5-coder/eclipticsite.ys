'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function FeatureCard({ icon, title, description }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Smooth 3D tilt with reduced intensity
      const rotX = ((y - centerY) / centerY) * 6;
      const rotY = ((x - centerX) / centerX) * -10;

      gsap.to(card, {
        rotationX: rotX,
        rotationY: rotY,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // Icon follows mouse with subtle movement
      if (icon) {
        gsap.to(icon, {
          x: (x - centerX) * 0.1,
          y: (y - centerY) * 0.1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'cubic.out',
      });

      if (icon) {
        gsap.to(icon, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'cubic.out',
        });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="feature-card"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div ref={iconRef} className="feature-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
