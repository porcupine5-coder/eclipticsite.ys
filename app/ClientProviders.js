'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import InteractionHandler from '../lib/interactions';
import HeroScene from '../lib/three-scene';
import GSAPAnimations from '../lib/gsap-animations';
import FormSecurity from '../lib/security';
import emailjs from '@emailjs/browser';
import SkeletonLoader from './components/SkeletonLoader';

export default function ClientProviders({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    // Liquid/fluid background - only on landing page
    useEffect(() => {
        if (typeof window === 'undefined' || pathname !== '/') return;
        const heroScene = new HeroScene('.hero');
        return () => {
            if (typeof heroScene.destroy === 'function') {
                heroScene.destroy();
            }
        };
    }, [pathname]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize EmailJS
            emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

            // Initialize Core Logic
            new InteractionHandler();
            const gsapAnimations = new GSAPAnimations();
            new FormSecurity();

            // Simulate loading and then fade out skeletons
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, 800);

            // Initialize animations
            gsapAnimations.initializeHeroAnimation();
            gsapAnimations.initializeServiceCardsAnimation();
            gsapAnimations.initializeFeatureCardsAnimation();
            gsapAnimations.initializePricingAnimation();
            gsapAnimations.initializeFormAnimation();
            gsapAnimations.initializeOrbitalAnimation();

            return () => {
                clearTimeout(loadingTimer);
            };

            // Global functions for inline HTML compatibility
            window.updatePrices = () => {
                const currency = document.getElementById('currency')?.value;
                if (!currency) return;

                // Save preference
                localStorage.setItem('preferred_currency', currency);

                const rates = {
                    USD: 1,
                    EUR: 0.85,
                    GBP: 0.73,
                    NPR: 132.50,
                    INR: 83.20
                };
                const symbols = {
                    USD: '$',
                    EUR: '€',
                    GBP: '£',
                    NPR: 'रू',
                    INR: '₹'
                };

                // Loading state with smooth fade
                const priceElements = document.querySelectorAll('.price .amount');
                priceElements.forEach(el => el.classList.add('loading'));

                // Quick smooth transition (300ms instead of 500ms for snappier feel)
                setTimeout(() => {
                    document.querySelectorAll('.price').forEach(price => {
                        const amountElement = price.querySelector('.amount');
                        const symbolElement = price.querySelector('.currency-symbol');

                        if (!amountElement || !symbolElement) return;

                        // Get base price
                        let basePrice = amountElement.getAttribute('data-base-price');
                        if (!basePrice) {
                            basePrice = amountElement.innerText;
                            amountElement.setAttribute('data-base-price', basePrice);
                        }
                        basePrice = parseInt(basePrice, 10);

                        const newAmount = Math.round(basePrice * rates[currency]);
                        const newSymbol = symbols[currency];

                        // Remove loading state
                        amountElement.classList.remove('loading');

                        // Animate symbol and amount together smoothly
                        gsapAnimations.animatePriceChange(amountElement, newAmount);

                        // Animate symbol change with same timing
                        gsap.to(symbolElement, {
                            opacity: 0,
                            duration: 0.25,
                            ease: 'cubic.inOut',
                            onComplete: () => {
                                symbolElement.textContent = newSymbol;
                                gsap.fromTo(symbolElement,
                                    { opacity: 0 },
                                    { opacity: 1, duration: 0.35, ease: 'cubic.out' }
                                );
                            }
                        });
                    });
                }, 300);
            };

            window.openCustomQuote = (packageType) => {
                const event = new CustomEvent('open-quote-modal', { detail: { packageType } });
                window.dispatchEvent(event);
            };

            window.sendQuoteEmail = (event) => {
                event.preventDefault();

                const form = event.target;
                const formData = new FormData(form);

                // Basic Validation
                const validation = formSecurity.validateForm(formData);
                if (!validation.isValid) {
                    alert(validation.errors.join('\n'));
                    return;
                }

                const submitBtn = form.querySelector('.submit-quote');
                if (!submitBtn) return;

                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                emailjs.sendForm(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                    form
                )
                    .then(() => {
                        gsapAnimations.showSuccessAnimation('.submit-quote');
                        submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
                        submitBtn.style.background = '#10B981';
                        form.reset();

                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.background = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    })
                    .catch((error) => {
                        console.error('FAILED...', error);
                        alert('Failed to send. Please try again.');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
            };

            window.sendContactEmail = (event) => {
                event.preventDefault();

                const form = event.target;
                const submitBtn = document.getElementById('submit-btn');
                if (!submitBtn) return;

                const buttonText = submitBtn.querySelector('.button-text');
                const buttonLoader = submitBtn.querySelector('.button-loader');

                if (buttonText) buttonText.classList.add('hidden');
                if (buttonLoader) buttonLoader.classList.remove('hidden');
                submitBtn.disabled = true;

                emailjs.sendForm(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                    form
                )
                    .then(() => {
                        gsapAnimations.showSuccessAnimation('#submit-btn');
                        const successMsg = document.getElementById('success-message');
                        if (successMsg) {
                            successMsg.classList.remove('hidden');
                            setTimeout(() => successMsg.classList.add('hidden'), 5000);
                        }
                        form.reset();
                    })
                    .catch((error) => {
                        console.error('FAILED...', error);
                        const errorMsg = document.getElementById('error-message');
                        if (errorMsg) {
                            errorMsg.classList.remove('hidden');
                            setTimeout(() => errorMsg.classList.add('hidden'), 5000);
                        }
                    })
                    .finally(() => {
                        if (buttonText) buttonText.classList.remove('hidden');
                        if (buttonLoader) buttonLoader.classList.add('hidden');
                        submitBtn.disabled = false;
                    });
            };

            // Initialize currency if saved
            const savedCurrency = localStorage.getItem('preferred_currency');
            if (savedCurrency) {
                const currencySelect = document.getElementById('currency');
                if (currencySelect) {
                    currencySelect.value = savedCurrency;
                    setTimeout(() => window.updatePrices(), 100);
                }
            }
        }
    }, []);

    return (
        <>
            {isLoading && (
                <div className="skeleton-loading-overlay">
                    <div className="skeleton-loading-container">
                        <SkeletonLoader type="hero" />
                        <div style={{ marginTop: '3rem' }}>
                            <SkeletonLoader type="section" />
                            <SkeletonLoader type="card" count={3} />
                        </div>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
