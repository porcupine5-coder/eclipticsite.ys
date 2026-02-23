'use client';

import { useState, useEffect } from 'react';

const CyberpunkAlert = ({ isOpen, message, onClose }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDisplayedText('');
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText((prev) => {
                    if (i < message.length) {
                        return prev + message.charAt(i);
                    }
                    clearInterval(interval);
                    return prev;
                });
                i++;
            }, 50); // Typing speed
            return () => clearInterval(interval);
        }
    }, [isOpen, message]);

    if (!isOpen) return null;

    return (
        <div className={`cyberpunk-overlay ${isOpen ? 'active' : ''}`}>
            <div className="cyberpunk-alert-box">
                <div className="cyberpunk-text glitch-text" data-text={displayedText}>
                    {displayedText}
                </div>
                <button className="cyberpunk-btn" onClick={onClose}>
                    ACKNOWLEDGE
                </button>
            </div>
        </div>
    );
};

export default CyberpunkAlert;
