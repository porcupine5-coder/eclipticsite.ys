import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export function scrollToSection(sectionId, offset = 80) {
  if (typeof window === 'undefined') return;

  if (sectionId === 'home') {
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 1.2,
      ease: 'power2.inOut',
    });
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

  gsap.to(window, {
    scrollTo: { y: targetPosition, autoKill: false },
    duration: 1.2,
    ease: 'power2.inOut',
  });
}
