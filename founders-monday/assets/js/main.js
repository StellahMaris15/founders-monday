// Main JavaScript file for Founders Monday Global
// Contains core functionality for the entire website

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    setupAccessibility();
    setupNavigation();
    setupBackToTop();
    setupMobileMenu();
    setupFormValidation();
    setupCounters();
    setupSmoothScrolling();
    setupCookieConsent();
    setupLoadingOverlay();
    setupTestimonialsSlider();
    updateCurrentYear();
}

// Accessibility Features
function setupAccessibility() {
    const accessibilityMenu = document.getElementById('accessibilityMenu');
    const accessibilityBtn = document.querySelector('.accessibility-trigger');
    
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', toggleAccessibilityMenu);
    }
    
    // Skip to main content functionality
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
}

function toggleAccessibilityMenu() {
    const menu = document.getElementById('accessibilityMenu');
    menu.classList.toggle('active');
}

function increaseFontSize() {
    document.body.style.fontSize = 'larger';
    saveAccessibilitySetting('fontSize', 'larger');
}

function decreaseFontSize() {
    document.body.style.fontSize = 'smaller';
    saveAccessibilitySetting('fontSize', 'smaller');
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isEnabled = document.body.classList.contains('high-contrast');
    saveAccessibilitySetting('highContrast', isEnabled);
}

function speakCurrentPage() {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = document.body.innerText;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
}

function saveAccessibilitySetting(key, value) {
    localStorage.setItem(`accessibility_${key}`, value);
}

function loadAccessibilitySettings() {
    const fontSize = localStorage.getItem('accessibility_fontSize');
    const highContrast = localStorage.getItem('accessibility_highContrast');
    
    if (fontSize === 'larger') {
        document.body.style.fontSize = 'larger';
    } else if (fontSize === 'smaller') {
        document.body.style.fontSize = 'smaller';
    }
    
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
}

// Navigation
function setupNavigation() {
    // Handle active navigation links
    const navLinks = document.querySelectorAll('.nav a');
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '#home')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Smooth scroll for anchor links
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('show');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.nav-dropdown-menu').classList.remove('show');
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.nav-dropdown-menu').classList.remove('show');
        });
    });
}

// Mobile Menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Back to Top Button
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormErrors(this);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    let isValid = true;
    let errorMessage = '';
    
    // Check if empty
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters';
        }
    }
    
    // File validation
    if (field.type === 'file' && field.files.length > 0) {
        const file = field.files[0];
        const maxSize = parseInt(field.getAttribute('data-max-size')) || 5 * 1024 * 1024; // 5MB default
        
        if (file.size > maxSize) {
            isValid = false;
            errorMessage = `File size must be less than ${formatBytes(maxSize)}`;
        }
        
        // Check file type
        const allowedTypes = field.getAttribute('accept');
        if (allowedTypes && !isFileTypeAllowed(file, allowedTypes)) {
            isValid = false;
            errorMessage = 'File type not allowed';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }
    
    return isValid;
}

function isFileTypeAllowed(file, allowedTypes) {
    const types = allowedTypes.split(',').map(type => type.trim());
    return types.some(type => {
        if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.startsWith(type.replace('/*', ''));
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

function showFieldSuccess(field) {
    field.classList.add('success');
    
    // Remove success class after 2 seconds
    setTimeout(() => {
        field.classList.remove('success');
    }, 2000);
}

function showFormErrors(form) {
    const firstError = form.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

// Counter Animation
function setupCounters() {
    const counters = document.querySelectorAll('.live-number, .stat-number');
    
    counters.forEach(counter => {
        const target = parseCounterValue(counter.textContent);
        if (!isNaN(target) && target > 0) {
            animateCounter(counter, target);
        }
    });
}

function parseCounterValue(text) {
    // Remove non-numeric characters except plus sign
    const cleanText = text.replace(/[^0-9+]/g, '');
    const number = parseInt(cleanText);
    return isNaN(number) ? 0 : number;
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = Math.max(Math.floor(duration / (target / increment)), 30);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        const suffix = element.textContent.includes('+') ? '+' : '';
        element.textContent = displayValue + suffix;
        
        // Update data-value attribute for CSS access
        element.setAttribute('data-value', displayValue);
    }, stepTime);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, href);
            }
        });
    });
}

// Cookie Consent
function setupCookieConsent() {
    const consentBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    
    if (!consentBanner) return;
    
    // Check if consent already given
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!consentGiven) {
        // Show banner after 1 second
        setTimeout(() => {
            consentBanner.style.display = 'block';
            setTimeout(() => {
                consentBanner.classList.add('visible');
            }, 10);
        }, 1000);
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
            initializeAnalytics();
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            hideCookieBanner();
        });
    }
    
    function hideCookieBanner() {
        consentBanner.classList.remove('visible');
        setTimeout(() => {
            consentBanner.style.display = 'none';
        }, 300);
    }
}

function initializeAnalytics() {
    // Initialize Google Analytics if accepted
    if (window.gtag && localStorage.getItem('cookieConsent') === 'accepted') {
        // Your analytics initialization code here
        console.log('Analytics initialized');
    }
}

// Loading Overlay
function setupLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        // Show loading overlay when page loads
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 500);
        });
        
        // Show loading for form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function() {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.classList.remove('hidden');
            });
        });
    }
}

// Testimonials Slider
function setupTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const testimonials = slider.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    if (testimonials.length <= 1) return;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    slider.appendChild(dotsContainer);
    
    // Create next/prev buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-nav testimonial-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous testimonial');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-nav testimonial-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next testimonial');
    
    slider.appendChild(prevBtn);
    slider.appendChild(nextBtn);
    
    // Navigation functions
    function goToTestimonial(index) {
        currentIndex = index;
        updateSlider();
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    }
    
    function updateSlider() {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
            testimonial.classList.remove('active');
        });
        
        // Show current testimonial
        testimonials[currentIndex].style.display = 'block';
        testimonials[currentIndex].classList.add('active');
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);
    
    // Auto-rotate testimonials (every 5 seconds)
    let autoRotate = setInterval(nextTestimonial, 5000);
    
    // Pause auto-rotate on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoRotate));
    slider.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextTestimonial, 5000);
    });
    
    // Initialize
    updateSlider();
}

// Utility Functions
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear, .current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        validateForm,
        animateCounter,
        setupNavigation
    };
}

// Enhanced newsletter form functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.footer-newsletter-form');
    
    if (newsletterForm) {
        const submitBtn = newsletterForm.querySelector('.btn-accent');
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        // Add validation message element
        const validationMsg = document.createElement('div');
        validationMsg.className = 'validation-message';
        validationMsg.textContent = 'Please enter a valid email address';
        newsletterForm.appendChild(validationMsg);
        
        // Real-time validation
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });
        
        // Form submission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateEmail(emailInput)) {
                simulateNewsletterSubmission(submitBtn, emailInput.value);
            }
        });
        
        // Validate email function
        function validateEmail(input) {
            const email = input.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                input.setAttribute('aria-invalid', 'true');
                validationMsg.textContent = 'Email is required';
                return false;
            }
            
            if (!emailRegex.test(email)) {
                input.setAttribute('aria-invalid', 'true');
                validationMsg.textContent = 'Please enter a valid email address';
                return false;
            }
            
            input.setAttribute('aria-invalid', 'false');
            validationMsg.textContent = '';
            return true;
        }
        
        // Simulate submission (replace with actual API call)
        function simulateNewsletterSubmission(button, email) {
            // Show loading state
            button.classList.add('loading');
            button.innerHTML = '<span class="sr-only">Subscribing...</span>';
            button.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Success simulation
                button.classList.remove('loading');
                button.classList.add('success');
                button.innerHTML = '<span class="sr-only">Subscribed!</span>';
                
                // Success message
                validationMsg.textContent = '🎉 Successfully subscribed! Check your email for confirmation.';
                validationMsg.style.color = '#10b981';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    button.classList.remove('success');
                    button.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                    button.disabled = false;
                    emailInput.value = '';
                    validationMsg.textContent = '';
                    validationMsg.style.color = '';
                }, 3000);
                
                // Log to console (replace with actual API call)
                console.log('Newsletter subscription:', email);
                
                // Optional: Track conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_subscription', {
                        'event_category': 'engagement',
                        'event_label': 'Footer Newsletter'
                    });
                }
                
            }, 1500);
        }
        
        // Add icon to button if not present
        if (!submitBtn.innerHTML.includes('<i')) {
            submitBtn.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
        }
    }
});