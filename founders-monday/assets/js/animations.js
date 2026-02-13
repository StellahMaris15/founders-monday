// Animations JavaScript for Founders Monday Global
// Handles animations, transitions, and visual effects

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
});

function initializeAnimations() {
    setupScrollAnimations();
    setupHoverEffects();
    setupLoadingAnimations();
    setupParallaxEffects();
    setupTypingEffects();
    setupCountUpAnimations();
    setupProgressBars();
    setupModalAnimations();
    setupTooltipAnimations();
    setupNotificationAnimations();
}

// Scroll Animations
function setupScrollAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation classes based on data attributes
                const element = entry.target;
                
                if (element.hasAttribute('data-animate')) {
                    const animation = element.getAttribute('data-animate');
                    element.classList.add('animate__animated', `animate__${animation}`);
                }
                
                if (element.hasAttribute('data-delay')) {
                    const delay = element.getAttribute('data-delay');
                    element.style.animationDelay = delay;
                }
                
                // Trigger custom animations
                if (element.classList.contains('stats-section')) {
                    animateStats(element);
                }
                
                if (element.classList.contains('progress-bar')) {
                    animateProgressBars(element);
                }
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation attributes
    const animatedElements = document.querySelectorAll(
        '[data-animate], .stats-section, .progress-bar, .card, .team-member'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.header');
    
    if (navbar) {
        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                // Scroll down
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                // Scroll up
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        }, 250));
    }
}

// Hover Effects
function setupHoverEffects() {
    // Card hover effects
    const cards = document.querySelectorAll('.card, .team-member, .resource-card, .platform-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            
            // Add ripple effect
            if (!this.querySelector('.ripple')) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                this.appendChild(ripple);
                
                // Position ripple
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                // Animate ripple
                ripple.style.animation = 'ripple 0.6s ease-out';
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-accent');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            
            // Add pulse effect
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 600);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Click effect
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
    
    // Menu item hover effects
    const menuItems = document.querySelectorAll('.nav a, .footer-links a');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Create underline effect
            const underline = document.createElement('span');
            underline.className = 'underline';
            underline.style.position = 'absolute';
            underline.style.bottom = '0';
            underline.style.left = '0';
            underline.style.width = '0';
            underline.style.height = '2px';
            underline.style.backgroundColor = 'currentColor';
            underline.style.transition = 'width 0.3s ease';
            
            this.style.position = 'relative';
            this.appendChild(underline);
            
            // Animate underline
            setTimeout(() => {
                underline.style.width = '100%';
            }, 10);
        });
        
        item.addEventListener('mouseleave', function() {
            const underline = this.querySelector('.underline');
            if (underline) {
                underline.style.width = '0';
                setTimeout(() => {
                    if (underline.parentNode) {
                        underline.remove();
                    }
                }, 300);
            }
        });
    });
}

// Loading Animations
function setupLoadingAnimations() {
    // Loading spinner animation
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        // Create pulsing circles
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.className = 'loading-circle';
            circle.style.animationDelay = `${i * 0.2}s`;
            loadingSpinner.appendChild(circle);
        }
    }
    
    // Skeleton loading for cards
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    skeletonCards.forEach(card => {
        // Add shimmer effect
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer';
        card.appendChild(shimmer);
        
        // Simulate content loading
        setTimeout(() => {
            card.classList.add('loaded');
            setTimeout(() => {
                if (shimmer.parentNode) {
                    shimmer.remove();
                }
            }, 500);
        }, 1500);
    });
}

// Parallax Effects
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            const yPos = -(scrollPosition * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, 16)); // ~60fps
}

// Typing Effects
function setupTypingEffects() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing');
        const speed = parseInt(element.getAttribute('data-typing-speed')) || 100;
        const loop = element.hasAttribute('data-typing-loop');
        const cursor = element.hasAttribute('data-typing-cursor');
        
        if (cursor) {
            const cursorElement = document.createElement('span');
            cursorElement.className = 'typing-cursor';
            cursorElement.textContent = '|';
            element.appendChild(cursorElement);
        }
        
        let currentIndex = 0;
        element.textContent = '';
        
        function typeCharacter() {
            if (currentIndex < text.length) {
                element.textContent += text.charAt(currentIndex);
                currentIndex++;
                
                // Blink cursor
                if (cursor) {
                    const cursorEl = element.querySelector('.typing-cursor');
                    if (cursorEl) {
                        cursorEl.style.animation = 'blink 1s infinite';
                    }
                }
                
                setTimeout(typeCharacter, speed);
            } else if (loop) {
                // Reset and start over
                setTimeout(() => {
                    element.textContent = '';
                    currentIndex = 0;
                    typeCharacter();
                }, 2000);
            }
        }
        
        // Start typing after a delay
        setTimeout(typeCharacter, 500);
    });
}

// Count Up Animations
function setupCountUpAnimations() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            counter.textContent = prefix + Math.floor(start) + suffix;
        }, 16);
    });
}

// Progress Bars
function setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar[data-progress]');
    
    progressBars.forEach(bar => {
        const progress = parseInt(bar.getAttribute('data-progress')) || 0;
        const duration = parseInt(bar.getAttribute('data-duration')) || 1000;
        const color = bar.getAttribute('data-color') || '#007bff';
        
        bar.style.width = '0%';
        bar.style.backgroundColor = color;
        bar.style.transition = `width ${duration}ms ease`;
        
        // Animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 300);
                observer.unobserve(bar);
            }
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// Modal Animations
function setupModalAnimations() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Open modal
        const openButtons = document.querySelectorAll(`[data-modal="${modal.id}"]`);
        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                openModal(modal);
            });
        });
        
        // Close modal
        const closeButtons = modal.querySelectorAll('.modal-close, [data-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                closeModal(modal);
            });
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal(modal);
            }
        });
    });
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
        modal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

function closeModal(modal) {
    modal.classList.remove('show');
    modal.querySelector('.modal-content').classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Tooltip Animations
function setupTooltipAnimations() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        let tooltip = null;
        let timeout = null;
        
        element.addEventListener('mouseenter', (e) => {
            clearTimeout(timeout);
            
            // Create tooltip
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            
            // Position tooltip
            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - 40) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            
            // Style tooltip
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '9999';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            
            // Add arrow
            const arrow = document.createElement('div');
            arrow.className = 'tooltip-arrow';
            arrow.style.position = 'absolute';
            arrow.style.bottom = '-5px';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderLeft = '5px solid transparent';
            arrow.style.borderRight = '5px solid transparent';
            arrow.style.borderTop = '5px solid #333';
            
            tooltip.appendChild(arrow);
            document.body.appendChild(tooltip);
            
            // Animate in
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(10px)';
            
            setTimeout(() => {
                tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            }, 10);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(10px)';
                
                timeout = setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            }
        });
    });
}

// Notification Animations
function setupNotificationAnimations() {
    // CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
        }
        
        .animate__animated {
            animation-duration: 1s;
            animation-fill-mode: both;
        }
        
        .animate__fadeIn {
            animation-name: fadeIn;
        }
        
        .animate__fadeInUp {
            animation-name: fadeInUp;
        }
        
        .animate__fadeInDown {
            animation-name: fadeInDown;
        }
        
        .animate__fadeInLeft {
            animation-name: fadeInLeft;
        }
        
        .animate__fadeInRight {
            animation-name: fadeInRight;
        }
        
        .animate__zoomIn {
            animation-name: zoomIn;
        }
        
        .animate__bounceIn {
            animation-name: bounceIn;
        }
        
        .animate__slideInUp {
            animation-name: slideInUp;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
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
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.3);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes bounceIn {
            from, 20%, 40%, 60%, 80%, to {
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            0% {
                opacity: 0;
                transform: scale3d(0.3, 0.3, 0.3);
            }
            20% {
                transform: scale3d(1.1, 1.1, 1.1);
            }
            40% {
                transform: scale3d(0.9, 0.9, 0.9);
            }
            60% {
                opacity: 1;
                transform: scale3d(1.03, 1.03, 1.03);
            }
            80% {
                transform: scale3d(0.97, 0.97, 0.97);
            }
            to {
                opacity: 1;
                transform: scale3d(1, 1, 1);
            }
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                visibility: visible;
            }
            to {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Stats Animation
function animateStats(container) {
    const statItems = container.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated');
            
            // Add counting animation for numbers
            const numberElement = item.querySelector('.stat-number');
            if (numberElement) {
                const originalText = numberElement.textContent;
                const match = originalText.match(/(\d+)(.*)/);
                
                if (match) {
                    const number = parseInt(match[1]);
                    const suffix = match[2] || '';
                    
                    let current = 0;
                    const increment = number / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            current = number;
                            clearInterval(timer);
                        }
                        numberElement.textContent = Math.floor(current) + suffix;
                    }, 30);
                }
            }
        }, index * 200);
    });
}

// Progress Bars Animation
function animateProgressBars(container) {
    const bars = container.querySelectorAll('.progress');
    
    bars.forEach((bar, index) => {
        const width = bar.style.width || '0%';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = width;
        }, index * 300);
    });
}

// Throttle function (from main.js)
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
        initializeAnimations,
        openModal,
        closeModal,
        animateStats,
        animateProgressBars
    };
}