// Forms JavaScript for Founders Monday Global
// Handles form-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

function initializeForms() {
    setupApplicationForm();
    setupNewsletterForm();
    setupLoginForm();
    setupRegistrationForm();
    setupPasswordResetForm();
    setupFileUploads();
    setupCharacterCounters();
    setupFormProgress();
    setupPasswordStrength();
    setupFormAutoSave();
}

// Application Form
function setupApplicationForm() {
    const applicationForm = document.getElementById('founderForm');
    if (!applicationForm) return;
    
    // Progress bar functionality
    const progressSteps = applicationForm.querySelectorAll('.progress-step');
    const formSections = applicationForm.querySelectorAll('.form-section');
    
    if (progressSteps.length > 0 && formSections.length > 0) {
        let currentSection = 0;
        
        // Show first section
        showSection(currentSection);
        
        // Next/Previous buttons
        const nextButtons = applicationForm.querySelectorAll('.next-section');
        const prevButtons = applicationForm.querySelectorAll('.prev-section');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateSection(currentSection)) {
                    currentSection++;
                    showSection(currentSection);
                    updateProgress(currentSection);
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                currentSection--;
                showSection(currentSection);
                updateProgress(currentSection);
            });
        });
        
        // Form submission
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateAllSections()) {
                submitApplicationForm(this);
            }
        });
    }
    
    // Auto-save functionality
    setupAutoSave(applicationForm, 'founder_application');
    
    // File preview for uploads
    setupFilePreviews(applicationForm);
}

function showSection(index) {
    const sections = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    sections.forEach((section, i) => {
        section.style.display = i === index ? 'block' : 'none';
    });
    
    progressSteps.forEach((step, i) => {
        step.classList.toggle('active', i <= index);
        step.classList.toggle('completed', i < index);
    });
}

function validateSection(sectionIndex) {
    const section = document.querySelectorAll('.form-section')[sectionIndex];
    const requiredFields = section.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function validateAllSections() {
    const sections = document.querySelectorAll('.form-section');
    let isValid = true;
    
    sections.forEach((section, index) => {
        if (!validateSection(index)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function updateProgress(currentStep) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.progress-bar .progress');
    
    if (progressBar) {
        const progress = ((currentStep + 1) / progressSteps.length) * 100;
        progressBar.style.width = progress + '%';
    }
}

// Newsletter Form
function setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll('#newsletterForm, .newsletter-form, .footer-newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitNewsletterForm(this);
        });
    });
}

function submitNewsletterForm(form) {
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In production, this would be an actual API call
        console.log('Subscribing email:', email);
        
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscription', {
                'event_category': 'engagement',
                'event_label': 'Newsletter Subscription'
            });
        }
    }, 1500);
}

// Login Form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    // Password toggle visibility
    const togglePassword = loginForm.querySelector('#togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = loginForm.querySelector('#login_password');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitLoginForm(this);
    });
    
    // Social login buttons
    const socialButtons = loginForm.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'google' :
                           this.classList.contains('linkedin') ? 'linkedin' : 'twitter';
            handleSocialLogin(platform);
        });
    });
}

function submitLoginForm(form) {
    const email = form.querySelector('#login_email').value;
    const password = form.querySelector('#login_password').value;
    const rememberMe = form.querySelector('[name="remember"]').checked;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validation
    if (!email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In production, this would be an actual API call
        console.log('Login attempt:', { email, rememberMe });
        
        // For demo purposes, simulate successful login
        const isDemoSuccess = email.includes('@') && password.length >= 8;
        
        if (isDemoSuccess) {
            showNotification('Login successful! Redirecting...', 'success');
            
            // Save to localStorage for demo
            if (rememberMe) {
                localStorage.setItem('demo_user_email', email);
            }
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showNotification('Invalid email or password', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Registration Form
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    // Password strength indicator
    const passwordInput = registerForm.querySelector('#reg_password');
    const confirmInput = registerForm.querySelector('#reg_confirm_password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
            checkPasswordMatch(this.value, confirmInput ? confirmInput.value : '');
        });
    }
    
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            checkPasswordMatch(passwordInput ? passwordInput.value : '', this.value);
        });
    }
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitRegistrationForm(this);
    });
}

function submitRegistrationForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Password validation
    const password = form.querySelector('#reg_password').value;
    const confirmPassword = form.querySelector('#reg_confirm_password').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Registration data:', Object.fromEntries(formData));
        
        // For demo purposes, simulate successful registration
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Save to localStorage for demo
        const email = form.querySelector('#reg_email').value;
        localStorage.setItem('demo_user_email', email);
        
        // Redirect to profile setup after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }, 2000);
}

// Password Reset Form
function setupPasswordResetForm() {
    const resetForm = document.getElementById('resetPasswordForm');
    if (!resetForm) return;
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitPasswordResetForm(this);
    });
    
    // Password toggle for reset form
    const toggleButtons = resetForm.querySelectorAll('.password-toggle i');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.closest('.form-group').querySelector('input[type="password"]');
            togglePasswordVisibility(passwordInput, this);
        });
    });
}

function submitPasswordResetForm(form) {
    const newPassword = form.querySelector('#new_password').value;
    const confirmPassword = form.querySelector('#confirm_password').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validation
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting Password...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Password reset for:', newPassword);
        showNotification('Password reset successfully! Redirecting to login...', 'success');
        
        // Redirect to login after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 2000);
}

// File Uploads
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            handleFileUpload(this);
        });
        
        // Add drag and drop support
        const parent = input.parentNode;
        parent.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        parent.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        parent.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                handleFileUpload(input);
            }
        });
    });
}

function handleFileUpload(input) {
    const files = input.files;
    if (!files.length) return;
    
    const file = files[0];
    const maxSize = parseInt(input.getAttribute('data-max-size')) || 5 * 1024 * 1024; // 5MB default
    
    // Validate file size
    if (file.size > maxSize) {
        showNotification(`File size must be less than ${formatBytes(maxSize)}`, 'error');
        input.value = '';
        return;
    }
    
    // Validate file type
    const allowedTypes = input.getAttribute('accept');
    if (allowedTypes && !isFileTypeAllowed(file, allowedTypes)) {
        showNotification('File type not allowed', 'error');
        input.value = '';
        return;
    }
    
    // Show preview for images
    if (file.type.startsWith('image/')) {
        showImagePreview(input, file);
    }
    
    // Update UI
    const fileName = file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name;
    const fileSize = formatBytes(file.size);
    
    const previewContainer = input.parentNode.querySelector('.file-preview') ||
                            createFilePreviewContainer(input);
    
    previewContainer.innerHTML = `
        <div class="file-info">
            <i class="fas fa-file"></i>
            <div>
                <div class="file-name">${fileName}</div>
                <div class="file-size">${fileSize}</div>
            </div>
            <button type="button" class="remove-file" aria-label="Remove file">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add remove file functionality
    const removeBtn = previewContainer.querySelector('.remove-file');
    removeBtn.addEventListener('click', function() {
        input.value = '';
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
    });
}

function createFilePreviewContainer(input) {
    const container = document.createElement('div');
    container.className = 'file-preview';
    container.style.marginTop = '0.5rem';
    container.style.padding = '0.75rem';
    container.style.background = '#f8f9fa';
    container.style.borderRadius = '0.5rem';
    container.style.border = '1px dashed #dee2e6';
    
    input.parentNode.appendChild(container);
    return container;
}

function showImagePreview(input, file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const previewContainer = input.parentNode.querySelector('.image-preview') ||
                                createImagePreviewContainer(input);
        
        previewContainer.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="remove-image" aria-label="Remove image">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const removeBtn = previewContainer.querySelector('.remove-image');
        removeBtn.addEventListener('click', function() {
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
            input.value = '';
        });
    };
    
    reader.readAsDataURL(file);
}

function createImagePreviewContainer(input) {
    const container = document.createElement('div');
    container.className = 'image-preview';
    container.style.marginTop = '0.5rem';
    container.style.position = 'relative';
    container.style.maxWidth = '200px';
    
    const img = document.createElement('img');
    img.style.width = '100%';
    img.style.borderRadius = '0.5rem';
    img.style.border = '2px solid #dee2e6';
    
    container.appendChild(img);
    input.parentNode.appendChild(container);
    return container;
}

// Character Counters
function setupCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[data-max-length]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('data-max-length'));
        if (isNaN(maxLength)) return;
        
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.85rem';
        counter.style.color = '#6c757d';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '0.25rem';
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength} / ${maxLength} characters`;
            
            if (currentLength > maxLength) {
                counter.style.color = '#dc3545';
                textarea.classList.add('error');
            } else if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ffc107';
                textarea.classList.remove('error');
            } else {
                counter.style.color = '#6c757d';
                textarea.classList.remove('error');
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    });
}

// Form Progress
function setupFormProgress() {
    const forms = document.querySelectorAll('form[data-progress]');
    
    forms.forEach(form => {
        const fields = form.querySelectorAll('input, textarea, select');
        const progressBar = form.querySelector('.progress-bar');
        
        if (!progressBar) return;
        
        function updateProgress() {
            let filledCount = 0;
            
            fields.forEach(field => {
                if (field.value.trim() !== '' && !field.disabled) {
                    filledCount++;
                }
            });
            
            const progress = (filledCount / fields.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            
            // Update progress text if exists
            const progressText = form.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}% Complete`;
            }
        }
        
        fields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });
        
        updateProgress(); // Initial update
    });
}

// Password Strength
function setupPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"][data-strength]');
    
    passwordInputs.forEach(input => {
        const strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength-meter';
        strengthMeter.style.height = '4px';
        strengthMeter.style.marginTop = '0.25rem';
        strengthMeter.style.borderRadius = '2px';
        strengthMeter.style.background = '#e9ecef';
        strengthMeter.style.overflow = 'hidden';
        
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        strengthBar.style.height = '100%';
        strengthBar.style.width = '0%';
        strengthBar.style.transition = 'width 0.3s ease, background-color 0.3s ease';
        
        strengthMeter.appendChild(strengthBar);
        input.parentNode.appendChild(strengthMeter);
        
        const strengthText = document.createElement('div');
        strengthText.className = 'password-strength-text';
        strengthText.style.fontSize = '0.85rem';
        strengthText.style.marginTop = '0.25rem';
        strengthText.style.color = '#6c757d';
        
        input.parentNode.appendChild(strengthText);
        
        input.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updateStrengthIndicator(strengthBar, strengthText, strength);
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 5); // Max score of 5
}

function updateStrengthIndicator(bar, text, strength) {
    const levels = [
        { percent: 0, color: '#dc3545', text: 'Very Weak' },
        { percent: 20, color: '#dc3545', text: 'Weak' },
        { percent: 40, color: '#ffc107', text: 'Fair' },
        { percent: 60, color: '#17a2b8', text: 'Good' },
        { percent: 80, color: '#28a745', text: 'Strong' },
        { percent: 100, color: '#28a745', text: 'Very Strong' }
    ];
    
    const level = levels[strength];
    bar.style.width = `${level.percent}%`;
    bar.style.backgroundColor = level.color;
    text.textContent = `Password Strength: ${level.text}`;
    text.style.color = level.color;
}

// Form Auto-Save
function setupFormAutoSave() {
    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
        const formId = form.id || 'form_' + Math.random().toString(36).substr(2, 9);
        const saveKey = `autosave_${formId}`;
        
        // Load saved data
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                populateForm(form, data);
                
                // Show restore notification
                const notification = document.createElement('div');
                notification.className = 'autosave-notification';
                notification.innerHTML = `
                    <span>You have unsaved changes. </span>
                    <button type="button" class="restore-btn">Restore</button>
                    <button type="button" class="discard-btn">Discard</button>
                `;
                
                form.parentNode.insertBefore(notification, form);
                
                notification.querySelector('.restore-btn').addEventListener('click', function() {
                    populateForm(form, data);
                    notification.remove();
                });
                
                notification.querySelector('.discard-btn').addEventListener('click', function() {
                    localStorage.removeItem(saveKey);
                    notification.remove();
                });
            } catch (e) {
                console.error('Failed to parse saved form data:', e);
            }
        }
        
        // Auto-save on input
        const saveFields = form.querySelectorAll('input, textarea, select');
        let saveTimeout;
        
        saveFields.forEach(field => {
            field.addEventListener('input', function() {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    saveFormData(form, saveKey);
                }, 1000);
            });
        });
        
        // Clear on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(saveKey);
        });
    });
}

function saveFormData(form, saveKey) {
    const formData = {};
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (field.name && !field.disabled) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                formData[field.name] = field.checked;
            } else if (field.type === 'file') {
                // Skip files for localStorage
            } else {
                formData[field.name] = field.value;
            }
        }
    });
    
    localStorage.setItem(saveKey, JSON.stringify(formData));
}

function populateForm(form, data) {
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = data[key];
            } else {
                field.value = data[key];
            }
            
            // Trigger change event
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// Utility Functions
function togglePasswordVisibility(passwordInput, toggleButton) {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Update icon
    if (type === 'text') {
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
        toggleButton.setAttribute('aria-label', 'Hide password');
    } else {
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
        toggleButton.setAttribute('aria-label', 'Show password');
    }
}

function checkPasswordStrength(password) {
    // Implementation in setupPasswordStrength
}

function checkPasswordMatch(password, confirmPassword) {
    const matchIndicator = document.querySelector('.password-match');
    if (!matchIndicator) return;
    
    if (!password || !confirmPassword) {
        matchIndicator.textContent = '';
        matchIndicator.style.color = '#6c757d';
        return;
    }
    
    if (password === confirmPassword) {
        matchIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Passwords match';
        matchIndicator.style.color = '#28a745';
    } else {
        matchIndicator.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match';
        matchIndicator.style.color = '#dc3545';
    }
}

function handleSocialLogin(platform) {
    console.log(`Social login with ${platform}`);
    // In production, this would redirect to OAuth endpoint
    showNotification(`Redirecting to ${platform} login...`, 'info');
    
    // Simulate redirect
    setTimeout(() => {
        // For demo, just show success
        showNotification(`Logged in with ${platform} successfully!`, 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.color = 'white';
    notification.style.zIndex = '9999';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.animation = 'slideIn 0.3s ease';
    notification.style.maxWidth = '400px';
    
    // Set colors based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add icon
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Helper function from main.js
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeForms,
        submitApplicationForm,
        submitNewsletterForm,
        submitLoginForm,
        submitRegistrationForm,
        validateForm
    };
}