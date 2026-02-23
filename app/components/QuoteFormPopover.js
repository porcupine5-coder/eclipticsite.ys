'use client';

import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';
import CyberpunkAlert from './CyberpunkAlert';

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/json',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.json'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Input length limits
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  budget: 100,
  requirements: 2000,
};

const QuoteFormPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        packageType: '',
        budget: '',
        requirements: '',
        timeline: new Date(),
        files: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const popoverRef = useRef(null);

    // Listen for global open event
    useEffect(() => {
        const handleOpen = (e) => {
            const { packageType } = e.detail || {};
            setFormData(prev => ({ ...prev, packageType: packageType || '' }));
            setIsOpen(true);
            setStep(1);
            setErrors({});
            setSubmissionStatus(null);
        };

        window.addEventListener('open-quote-modal', handleOpen);
        return () => window.removeEventListener('open-quote-modal', handleOpen);
    }, []);

    // Handle Entrance Animation
    useEffect(() => {
        if (isOpen && popoverRef.current) {
            gsap.fromTo(popoverRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        gsap.to(popoverRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            onComplete: () => setIsOpen(false)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Enforce length limits
        let newValue = value;
        if (name === 'name' && value.length > MAX_LENGTHS.name) {
            newValue = value.slice(0, MAX_LENGTHS.name);
        } else if (name === 'email' && value.length > MAX_LENGTHS.email) {
            newValue = value.slice(0, MAX_LENGTHS.email);
        } else if (name === 'budget' && value.length > MAX_LENGTHS.budget) {
            newValue = value.slice(0, MAX_LENGTHS.budget);
        } else if (name === 'requirements' && value.length > MAX_LENGTHS.requirements) {
            newValue = value.slice(0, MAX_LENGTHS.requirements);
        }
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        // Clear error when user types
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, timeline: date }));
    };

    const validateFile = (file) => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 10MB';
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
        if (!hasValidExtension) {
            return 'File type not allowed. Allowed: JPG, PNG, GIF, WEBP, PDF, TXT, JSON';
        }

        // Check MIME type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'File type not allowed. Please upload a valid file.';
        }

        return null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setErrors(prev => ({ ...prev, files: validationError }));
                e.target.value = ''; // Clear the file input
                return;
            }
            setFormData(prev => ({ ...prev, files: file }));
            setErrors(prev => ({ ...prev, files: null }));
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.name || formData.name.length < 2) {
                newErrors.name = 'Name is required (min 2 chars)';
                isValid = false;
            }
            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Valid email is required';
                isValid = false;
            }
        } else if (currentStep === 2) {
            if (!formData.budget) {
                newErrors.budget = 'Budget range is required';
                isValid = false;
            }
            if (!formData.requirements || formData.requirements.length < 5) {
                newErrors.requirements = 'Brief requirements needed';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        try {
            const emailParams = {
                to_email: 'ytsshrts@gmail.com',
                from_name: formData.name,
                from_email: formData.email,
                package_type: formData.packageType,
                budget: formData.budget,
                timeline: formData.timeline ? formData.timeline.toLocaleDateString() : 'Not specified',
                requirements: formData.requirements,
                attachment_name: formData.files ? formData.files.name : 'No file attached',
            };

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                emailParams
            );

            setSubmissionStatus('success');

            setTimeout(() => {
                handleClose();
                setTimeout(() => setShowAlert(true), 300);
            }, 500);

        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionStatus('error');
            // Generic error message - don't expose internal details
            alert('Failed to send. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="quote-popover-overlay">
                    <div className="quote-popover glass-panel" ref={popoverRef}>
                        <button className="close-btn" onClick={handleClose}>&times;</button>

                        {/* Progress Indicators */}
                        <div className="wizard-steps">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
                            ))}
                        </div>

                        <div className="step-content">
                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="step-slide">
                                    <h3>Let&apos;s Start</h3>
                                    <div className="form-group">
                                        <label>What interests you?</label>
                                        <input type="text" value={formData.packageType} readOnly className="input-readonly" />
                                    </div>
                                    <div className="form-group">
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            maxLength={MAX_LENGTHS.name}
                                            className={errors.name ? 'error' : ''}
                                        />
                                        {errors.name && <span className="error-msg">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            maxLength={MAX_LENGTHS.email}
                                            className={errors.email ? 'error' : ''}
                                        />
                                        {errors.email && <span className="error-msg">{errors.email}</span>}
                                    </div>
                                    <button className="btn-next" onClick={nextStep}>Next <i className="fas fa-arrow-right"></i></button>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="step-slide">
                                    <h3>Project Details</h3>
                                    <div className="form-group">
                                        <label>Budget Range</label>
                                        <input
                                            type="text"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            placeholder="$1000 - $5000"
                                            maxLength={MAX_LENGTHS.budget}
                                            className={errors.budget ? 'error' : ''}
                                        />
                                        {errors.budget && <span className="error-msg">{errors.budget}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Timeline Goal</label>
                                        <DatePicker
                                            selected={formData.timeline}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            className="datepicker-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Key Requirements</label>
                                        <textarea
                                            name="requirements"
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Describe your vision..."
                                            maxLength={MAX_LENGTHS.requirements}
                                            className={errors.requirements ? 'error' : ''}
                                        />
                                        {errors.requirements && <span className="error-msg">{errors.requirements}</span>}
                                    </div>
                                    <div className="btn-group">
                                        <button className="btn-prev" onClick={prevStep}>Back</button>
                                        <button className="btn-next" onClick={nextStep}>Next <i className="fas fa-arrow-right"></i></button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="step-slide">
                                    <h3>Review & Send</h3>

                                    <div className="review-summary">
                                        <p><strong>Package:</strong> {formData.packageType}</p>
                                        <p><strong>Contact:</strong> {formData.name} ({formData.email})</p>
                                        <p><strong>Budget:</strong> {formData.budget}</p>
                                        <p><strong>Timeline:</strong> {formData.timeline.toDateString()}</p>
                                    </div>

                                    <div className="form-group file-upload">
                                        <label>Attachments (Optional)</label>
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.json"
                                        />
                                        {formData.files && <p className="file-name">{formData.files.name}</p>}
                                        {errors.files && <span className="error-msg">{errors.files}</span>}
                                    </div>

                                    <div className="btn-group">
                                        <button className="btn-prev" onClick={prevStep}>Back</button>
                                        <button
                                            className={`btn-submit ${isSubmitting ? 'loading' : ''} ${submissionStatus === 'success' ? 'success' : ''}`}
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : submissionStatus === 'success' ? 'Sent!' : 'Submit Quote'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <CyberpunkAlert
                isOpen={showAlert}
                message="Your request has been submitted. Thank you for collaboration with us."
                onClose={() => setShowAlert(false)}
            />
        </>
    );
};

export default QuoteFormPopover;
