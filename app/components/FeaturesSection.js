'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'fa-rocket',
      title: 'BLAZING DEPLOYMENT',
      description: 'Rapid deployment warfare with quality code artillery and modern development ammunition',
    },
    {
      icon: 'fa-mobile-alt',
      title: 'RESPONSIVE ARMOR',
      description: 'Perfectly armored optimization for all devices - mobile, tablet, and desktop battlefields',
    },
    {
      icon: 'fa-code',
      title: 'CLEAN CODE PROTOCOL',
      description: 'Well-structured, maintainable, and efficient codebase fortress built for scale',
    },
    {
      icon: 'fa-search',
      title: 'SEO DOMINANCE',
      description: 'Search engine warfare with battle-tested optimization tactics and ranking artillery',
    },
    {
      icon: 'fa-shield-alt',
      title: 'SECURITY FORTRESS',
      description: 'Enhanced security measures protecting your digital empire from all threat vectors',
    },
    {
      icon: 'fa-hand-holding-usd',
      title: 'FLEXIBLE ARSENAL',
      description: 'Negotiable rates and customizable packages to fit your budget warfare',
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-header">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="features-subtitle">Premium features designed for your success</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <i className={`fas ${feature.icon}`}></i>
            </div>
            <h3 className="cyber-heading">{feature.title}</h3>
            <p className="font-primary">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
