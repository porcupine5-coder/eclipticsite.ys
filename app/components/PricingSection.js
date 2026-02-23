'use client';

import TextType from './TextType';
import QuoteFormPopover from './QuoteFormPopover';

export default function PricingSection() {
  const openCustomQuote = (packageName) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('open-quote-modal', { detail: { packageType: packageName } });
      window.dispatchEvent(event);
    }
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-header">
        <h2 className="section-title">Pricing Plans</h2>
        <p className="pricing-subtitle">Transparent, flexible pricing for every budget</p>
      </div>
      <div className="currency-selector">
        <label htmlFor="currency">Select Currency:</label>
        <select
          id="currency"
          onChange={() => {
            if (typeof window !== 'undefined' && window.updatePrices) {
              window.updatePrices();
            }
          }}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="NPR">NPR (रू)</option>
          <option value="INR">INR (₹)</option>
        </select>
      </div>
      <div className="pricing-grid">
        <div className="pricing-card" data-parallax="0.02">
          <div className="pricing-header">
            <TextType
              text="Basic Website"
              fontVariant="secondary"
              as="h3"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="price">
              <span className="currency-symbol">$</span>
              <TextType
                text="25"
                fontVariant="mono"
                className="amount"
                showCursor={false}
                startOnVisible={true}
                loop={false}
                hideCursorOnComplete={true}
              />
            </div>
            <p className="negotiable">Price is negotiable</p>
          </div>
          <ul className="features">
            <li><i className="fas fa-check"></i> Responsive Design</li>
            <li><i className="fas fa-check"></i> 5 Pages</li>
            <li><i className="fas fa-check"></i> Contact Form</li>
            <li><i className="fas fa-check"></i> Basic SEO</li>
          </ul>
          <button
            className="pricing-cta"
            onClick={() => openCustomQuote('Basic Website')}
          >
            Get Custom Quote
          </button>
        </div>

        <div className="pricing-card popular" data-parallax="0.04">
          <div className="popular-badge">Most Popular</div>
          <div className="pricing-header">
            <TextType
              text="E-commerce Website"
              fontVariant="secondary"
              as="h3"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="price">
              <span className="currency-symbol">$</span>
              <TextType
                text="75"
                fontVariant="mono"
                className="amount"
                showCursor={false}
                startOnVisible={true}
                loop={false}
                hideCursorOnComplete={true}
              />
            </div>
            <p className="negotiable">Price is negotiable</p>
          </div>
          <ul className="features">
            <li><i className="fas fa-check"></i> All Basic Features</li>
            <li><i className="fas fa-check"></i> E-commerce Integration</li>
            <li><i className="fas fa-check"></i> Payment Gateway</li>
            <li><i className="fas fa-check"></i> Product Management</li>
          </ul>
          <button
            className="pricing-cta"
            onClick={() => openCustomQuote('E-commerce Website')}
          >
            Get Custom Quote
          </button>
        </div>

        <div className="pricing-card" data-parallax="0.02">
          <div className="pricing-header">
            <TextType
              text="Custom Web App"
              fontVariant="secondary"
              as="h3"
              showCursor={false}
              startOnVisible={true}
              loop={false}
              hideCursorOnComplete={true}
            />
            <div className="price">
              <span className="currency-symbol">$</span>
              <TextType
                text="199"
                fontVariant="mono"
                className="amount"
                showCursor={false}
                startOnVisible={true}
                loop={false}
                hideCursorOnComplete={true}
              />
            </div>
            <p className="negotiable">Price is negotiable</p>
          </div>
          <ul className="features">
            <li><i className="fas fa-check"></i> Custom Development</li>
            <li><i className="fas fa-check"></i> Advanced Features</li>
            <li><i className="fas fa-check"></i> Database Integration</li>
            <li><i className="fas fa-check"></i> API Development</li>
          </ul>
          <button
            className="pricing-cta"
            onClick={() => openCustomQuote('Custom Web App')}
          >
            Get Custom Quote
          </button>
        </div>
      </div>



      <QuoteFormPopover />
    </section >
  );
}
