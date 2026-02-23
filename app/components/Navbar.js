'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { scrollToSection } from '../../lib/scrollToSection';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (sectionId) => {
    if (pathname !== '/') {
      router.push(sectionId === 'home' ? '/' : `/#${sectionId}`);
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <nav className="navbar">
      <a href="#" className="logo">
        <Image src="/logo.png" alt="Eclipticsite Logo" className="logo-img" width={60} height={58} />
        <span className="logo-text">Eclipticsite</span>
      </a>
      <button
        className="mobile-menu-toggle"
        aria-label="Toggle navigation menu"
        aria-controls="site-nav-links"
        aria-expanded="false"
        type="button"
      >
        <i className="fas fa-bars"></i>
      </button>
      <div className="nav-links" id="site-nav-links">
        <div className="nav-glitch-container">
          {/* Home */}
          <div className="radio-wrapper">
            <input type="radio" id="nav-home" name="nav-group" className="input" defaultChecked onClick={() => handleNavClick('home')} />
            <div className="btn">
              Home
              <span className="btn__glitch" aria-hidden="true">_Home_</span>
              
            </div>
          </div>

          {/* Services */}
          <div className="radio-wrapper">
            <input type="radio" id="nav-services" name="nav-group" className="input" onClick={() => handleNavClick('services')} />
            <div className="btn">
              Services
              <span className="btn__glitch" aria-hidden="true">_Services_</span>
          
            </div>
          </div>

          {/* Features */}
          <div className="radio-wrapper">
            <input type="radio" id="nav-features" name="nav-group" className="input" onClick={() => handleNavClick('features')} />
            <div className="btn">
              Features
              <span className="btn__glitch" aria-hidden="true">_Features_</span>
              
            </div>
          </div>

          {/* Pricing */}
          <div className="radio-wrapper">
            <input type="radio" id="nav-pricing" name="nav-group" className="input" onClick={() => handleNavClick('pricing')} />
            <div className="btn">
              Pricing
              <span className="btn__glitch" aria-hidden="true">_Pricing_</span>
              
            </div>
          </div>

          {/* Contact */}
          <div className="radio-wrapper">
            <input type="radio" id="nav-contact" name="nav-group" className="input" onClick={() => handleNavClick('contact')} />
            <div className="btn">
              Contact
              <span className="btn__glitch" aria-hidden="true">_Contact_</span>
              
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
}
