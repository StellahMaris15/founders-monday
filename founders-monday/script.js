// ============================================
// FOUNDERS MONDAY - MAIN JAVASCRIPT FILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initAccessibility();
    initNavigation();
    initForms();
    initCookieConsent();
    initAnimations();
    initLiveStats();
    initTestimonials();
});

// ============================================
// ACCESSIBILITY FUNCTIONS
// ============================================
function initAccessibility() {
    // Text-to-speech function
    window.speakCurrentPage = function() {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = document.querySelector('main').innerText;
            speech.rate = 1;
            speech.pitch = 1;
            speech.volume = 1;
            window.speechSynthesis.speak(speech);
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    };

    // Font size controls
    let fontSize = 100;
    
    window.increaseFontSize = function() {
        fontSize += 10;
        if (fontSize > 150) fontSize = 150;
        document.body.style.fontSize = fontSize + '%';
        showNotification('Font size increased', 'info');
    };
    
    window.decreaseFontSize = function() {
        fontSize -= 10;
        if (fontSize < 80) fontSize = 80;
        document.body.style.fontSize = fontSize + '%';
        showNotification('Font size decreased', 'info');
    };
    
    window.toggleHighContrast = function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        showNotification(isHighContrast ? 'High contrast enabled' : 'High contrast disabled', 'info');
        localStorage.setItem('highContrast', isHighContrast);
    };
    
    // Restore high contrast preference
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Toggle accessibility menu
    window.toggleAccessibilityMenu = function() {
        const menu = document.getElementById('accessibilityMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    };
    
    // Close accessibility menu when clicking outside
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('accessibilityMenu');
        const toggleBtn = document.querySelector('.accessibility-toggle');
        
        if (menu && toggleBtn && !menu.contains(event.target) && !toggleBtn.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================
function initNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(href);
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                if (nav.classList.contains('mobile-open')) {
                    nav.classList.remove('mobile-open');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveNavLink(hash) {
        document.querySelectorAll('.nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    }
    
    // Update nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                updateActiveNavLink('#' + sectionId);
            }
        });
        
        // Add shadow to header on scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('preferredLanguage', selectedLang);
            showNotification(`Language changed to ${this.options[this.selectedIndex].text}`, 'info');
            
            // In production, this would redirect to language-specific page or load translations
            // window.location.href = `/${selectedLang}${window.location.pathname}`;
        });
        
        // Set saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            languageSelect.value = savedLang;
        }
    }
}

// ============================================
// FORM HANDLING
// ============================================
function initForms() {
    // Founder Application Form
    const founderForm = document.getElementById('founderForm');
    if (founderForm) {
        // Multi-step form progress
        const formSteps = founderForm.querySelectorAll('.form-section');
        const progressSteps = document.querySelectorAll('.progress-step');
        
        // Show first step only
        formSteps.forEach((step, index) => {
            if (index > 0) {
                step.style.display = 'none';
            }
        });
        
        // Add next/prev buttons
        formSteps.forEach((step, index) => {
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'form-navigation';
            buttonGroup.style.display = 'flex';
            buttonGroup.style.justifyContent = 'space-between';
            buttonGroup.style.marginTop = '30px';
            
            if (index > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.className = 'btn-outline';
                prevBtn.textContent = 'Previous';
                prevBtn.onclick = () => navigateForm(index - 1);
                buttonGroup.appendChild(prevBtn);
            }
            
            if (index < formSteps.length - 1) {
                const nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.className = 'btn-primary';
                nextBtn.textContent = 'Next';
                nextBtn.onclick = () => navigateForm(index + 1);
                buttonGroup.appendChild(nextBtn);
            } else {
                const submitBtn = founderForm.querySelector('button[type="submit"]');
                buttonGroup.appendChild(submitBtn);
                submitBtn.style.margin = '0 auto';
            }
            
            step.appendChild(buttonGroup);
        });
        
        // Form navigation function
        function navigateForm(stepIndex) {
            // Validate current step
            const currentStep = formSteps[currentStepIndex];
            const inputs = currentStep.querySelectorAll('input, select, textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#EF4444';
                    const errorMsg = input.parentNode.querySelector('.error-message') || document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    errorMsg.style.color = '#EF4444';
                    errorMsg.style.fontSize = '0.85rem';
                    errorMsg.style.marginTop = '5px';
                    errorMsg.style.display = 'block';
                    input.parentNode.appendChild(errorMsg);
                } else {
                    input.style.borderColor = '';
                    const errorMsg = input.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Hide current step
            formSteps[currentStepIndex].style.display = 'none';
            progressSteps[currentStepIndex].classList.remove('active');
            
            // Show next step
            formSteps[stepIndex].style.display = 'block';
            progressSteps[stepIndex].classList.add('active');
            
            // Update current step index
            currentStepIndex = stepIndex;
            
            // Scroll to top of form
            founderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Initialize step tracking
        let currentStepIndex = 0;
        progressSteps[0].classList.add('active');
        
        // File upload preview
        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validate file size (5MB max)
                    if (file.size > 5 * 1024 * 1024) {
                        showNotification('File size must be less than 5MB', 'error');
                        this.value = '';
                        return;
                    }
                    
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!validTypes.includes(file.type)) {
                        showNotification('Please upload a valid image file (JPEG, PNG, GIF)', 'error');
                        this.value = '';
                        return;
                    }
                    
                    // Show preview
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.createElement('div');
                        preview.className = 'file-preview';
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="Preview" style="max-width: 150px; border-radius: 8px; margin-top: 10px;">
                            <button type="button" onclick="this.parentElement.remove()" style="background: #EF4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-left: 10px; cursor: pointer;">Remove</button>
                        `;
                        photoInput.parentNode.appendChild(preview);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Form submission
        founderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#EF4444';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            try {
                // In production, this would be a real API call
                // const response = await fetch(this.action, {
                //     method: 'POST',
                //     body: new FormData(this)
                // });
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showNotification('Application submitted successfully! We will review your submission soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset form steps
                formSteps.forEach((step, index) => {
                    step.style.display = index === 0 ? 'block' : 'none';
                });
                
                progressSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === 0);
                });
                
                currentStepIndex = 0;
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } catch (error) {
                showNotification('Error submitting application. Please try again.', 'error');
                console.error('Form submission error:', error);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Password visibility toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('login_password');
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#login_email').value;
            const password = this.querySelector('#login_password').value;
            
            if (!email || !password) {
                showNotification('Please enter both email and password', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // In production, this would check credentials
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                
            } catch (error) {
                showNotification('Invalid email or password', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Registration Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Password confirmation validation
        const passwordInput = document.getElementById('reg_password');
        const confirmPasswordInput = document.getElementById('reg_confirm_password');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                if (passwordInput.value !== this.value) {
                    this.style.borderColor = '#EF4444';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
        
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate password match
            if (passwordInput && confirmPasswordInput && 
                passwordInput.value !== confirmPasswordInput.value) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                showNotification('Account created successfully! Welcome to Founders Monday.', 'success');
                
                // Reset form
                this.reset();
                
                // Switch to login view
                showLogin();
                
            } catch (error) {
                showNotification('Error creating account. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                
            } catch (error) {
                showNotification('Error subscribing. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Login/Register toggle functions
    window.showRegister = function() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'block';
    };
    
    window.showLogin = function() {
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'block';
    };
}

// ============================================
// COOKIE CONSENT
// ============================================
function initCookieConsent() {
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    const cookieBanner = document.getElementById('cookieConsent');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            if (cookieBanner) cookieBanner.remove();
            showNotification('Cookie preferences saved', 'info');
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            if (cookieBanner) cookieBanner.remove();
            showNotification('Cookie preferences saved', 'info');
        });
    }
    
    // Close banner on outside click
    document.addEventListener('click', function(event) {
        if (cookieBanner && !cookieBanner.contains(event.target)) {
            cookieBanner.style.display = 'none';
        }
    });
}

// ============================================
// ANIMATIONS
// ============================================
function initAnimations() {
    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const liveNumbers = document.querySelectorAll('.live-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('stat-number') || element.classList.contains('live-number')) {
                    animateCounter(element);
                } else {
                    element.classList.add('fade-in-up');
                }
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.stat-number, .live-number, .card, .founder-card, .winner-card').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation function
    function animateCounter(element) {
        const finalValue = parseInt(element.textContent.replace('+', '')) || 0;
        const duration = 2000;
        const startTime = Date.now();
        
        function updateCounter() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOut * finalValue);
            
            element.textContent = currentValue + (element.textContent.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Add animation class
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// LIVE STATS
// ============================================
function initLiveStats() {
    // Simulate live user count
    const activeUsersEl = document.getElementById('activeUsers');
    const totalWinnersEl = document.getElementById('totalWinners');
    
    if (activeUsersEl) {
        // Generate random number between 450-550
        const baseUsers = 500;
        const randomOffset = Math.floor(Math.random() * 101) - 50; // -50 to +50
        activeUsersEl.textContent = (baseUsers + randomOffset) + '+';
        
        // Update every 30 seconds
        setInterval(() => {
            const randomOffset = Math.floor(Math.random() * 101) - 50;
            activeUsersEl.textContent = (baseUsers + randomOffset) + '+';
        }, 30000);
    }
    
    if (totalWinnersEl) {
        // Update weekly
        const today = new Date();
        const weekNumber = Math.ceil((today - new Date(today.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        totalWinnersEl.textContent = weekNumber;
    }
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
function initTestimonials() {
    const testimonials = [
        {
            quote: "Founders Monday gave my startup the visibility it needed. The prize money helped us launch our MVP!",
            name: "John Doe",
            role: "Tech Startup Founder",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            quote: "The community support and networking opportunities have been invaluable for growing my business.",
            name: "Sarah Johnson",
            role: "E-commerce Founder",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            quote: "Being featured helped us secure our first major investor. Highly recommend to all founders!",
            name: "Michael Chen",
            role: "SaaS Founder",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
    
    const testimonialContainer = document.querySelector('.testimonials-slider');
    if (!testimonialContainer) return;
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        const testimonial = testimonials[index];
        testimonialContainer.innerHTML = `
            <div class="testimonial fade-in-up">
                <div class="testimonial-content">
                    <p>"${testimonial.quote}"</p>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                    <div class="author-info">
                        <h5>${testimonial.name}</h5>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            </div>
            <div class="testimonial-nav" style="text-align: center; margin-top: 20px;">
                ${testimonials.map((_, i) => `
                    <button class="testimonial-dot ${i === index ? 'active' : ''}" 
                            onclick="showTestimonial(${i})"
                            style="width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--gold-primary); background: ${i === index ? 'var(--gold-primary)' : 'transparent'}; margin: 0 5px; cursor: pointer;"></button>
                `).join('')}
            </div>
        `;
    }
    
    // Show first testimonial
    showTestimonial(0);
    
    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Make function available globally
    window.showTestimonial = showTestimonial;
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        color: white;
        font-weight: 600;
    `;
    
    // Set color based on type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Content styles
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-content i').style.cssText = `
        font-size: 1.2rem;
    `;
    
    // Close button
    notification.querySelector('.notification-close').style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// SOCIAL SHARE
// ============================================
function sharePage(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Check out Founders Monday Global - Empowering Startup Founders!');
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ============================================
// EVENT REGISTRATION
// ============================================
function registerForEvent(eventId) {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
        showNotification('Please login to register for events', 'info');
        document.querySelector('#login').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Show loading
    const registerBtn = document.querySelector(`[data-event="${eventId}"]`);
    if (registerBtn) {
        const originalText = registerBtn.textContent;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        registerBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Successfully registered for the event!', 'success');
            registerBtn.textContent = 'Registered ✓';
            registerBtn.style.background = '#10B981';
            registerBtn.disabled = true;
        }, 1500);
    }
}

// ============================================
// DOWNLOAD RESOURCES
// ============================================
function downloadResource(resourceId) {
    showNotification('Downloading resource...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Resource downloaded successfully!', 'success');
    }, 1000);
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
// Add loading state to body
document.body.classList.add('loading');

// Remove loading state when everything is loaded
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
    
    // Show welcome message for first-time visitors
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showNotification('Welcome to Founders Monday Global! 🚀', 'info');
        }, 1000);
        localStorage.setItem('hasVisited', 'true');
    }
});

// ============================================
// OFFLINE SUPPORT
// ============================================
// Check if browser is online
window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Some features may not work.', 'warning');
});

// ============================================
// SERVICE WORKER FOR PWA
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
// Log page load performance
window.addEventListener('load', function() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    
    if (loadTime > 3000) {
        console.warn(`Page load took ${loadTime}ms. Consider optimizing.`);
    }
    // Dropdown menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }
            }
        });
    });
    
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('login_password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});

// Make dropdown work on mobile
function toggleDropdown(element) {
    const menu = element.nextElementSibling;
    if (window.innerWidth <= 768) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}
});
