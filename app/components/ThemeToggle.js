'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function ThemeToggle() {
  useEffect(() => {
    const htmlElement = document.documentElement;
    const toggleSwitch = document.getElementById('theme-toggle-switch');
    const toggleLabel = document.querySelector('.theme-toggle-wrapper .theme-toggle');

    if (!toggleSwitch) return;

    // Sync toggle state with current theme (already set by inline script)
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    toggleSwitch.checked = isDark;

    let lastClickX = window.innerWidth / 2;
    let lastClickY = window.innerHeight / 2;

    const handlePointer = (event) => {
      lastClickX = event.clientX;
      lastClickY = event.clientY;
    };

    const handleToggle = () => {
      const isDarkMode = toggleSwitch.checked;
      const nextTheme = isDarkMode ? 'dark' : 'light';

      const ripple = document.createElement('div');
      ripple.classList.add('theme-ripple');

      const maxDim = Math.max(window.innerWidth, window.innerHeight);
      const size = maxDim * 2.8;

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${lastClickX - size / 2}px`;
      ripple.style.top = `${lastClickY - size / 2}px`;
      ripple.style.backgroundColor = nextTheme === 'dark' ? '#0F172A' : '#F9FAFB';

      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            if (isDarkMode) {
              htmlElement.setAttribute('data-theme', 'dark');
              localStorage.setItem('theme', 'dark');
            } else {
              htmlElement.removeAttribute('data-theme');
              localStorage.setItem('theme', 'light');
            }

            gsap.to(ripple, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => ripple.remove(),
            });
          },
        }
      );
    };

    toggleLabel?.addEventListener('pointerdown', handlePointer);
    toggleSwitch.addEventListener('change', handleToggle);

    return () => {
      toggleLabel?.removeEventListener('pointerdown', handlePointer);
      toggleSwitch.removeEventListener('change', handleToggle);
    };
  }, []);

  return (
    <div className="theme-toggle-wrapper">
      <label className="theme-toggle" htmlFor="theme-toggle-switch" aria-label="Toggle dark mode">
        <input className="toggle-checkbox" type="checkbox" id="theme-toggle-switch" data-react-theme-toggle="true" />
        <div className="toggle-slot" aria-hidden="true">
          <div className="toggle-button"></div>
        </div>
      </label>
    </div>
  );
}
