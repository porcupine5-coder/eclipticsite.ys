'use client';

export default function ServicesSection() {
  const services = [
    {
      icon: 'fa-shopping-cart',
      title: 'E-COMMERCE DOMINANCE',
      description: 'Complete online store domination with AI-powered payment integration and intelligent inventory warfare',
    },
    {
      icon: 'fa-chart-line',
      title: 'ANALYTICS WARFARE',
      description: 'Battle-tested reporting and performance tracking for data-driven market domination',
    },
    {
      icon: 'fa-mobile-alt',
      title: 'MOBILE OPTIMIZATION',
      description: 'Lightning-fast responsive warfare across all devices - mobile, tablet, and desktop battlefields',
    },
  ];

  return (
    <section className="services-section" id="services">
      <div className="services-header">
        <h2 className="section-title">Our Services</h2>
        <p className="services-subtitle">Elevate your digital presence with our premium solutions</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">
              <i className={`fas ${service.icon}`}></i>
            </div>
            <h3 className="cyber-heading">{service.title}</h3>
            <p className="font-primary">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
