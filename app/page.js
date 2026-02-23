import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';

export default function Home()
 {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
