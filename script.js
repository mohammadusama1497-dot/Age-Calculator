// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const ageForm = document.getElementById('ageForm');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const resultSection = document.getElementById('resultSection');
    const resultGreeting = document.getElementById('resultGreeting');
    const ageDetails = document.getElementById('ageDetails');
    
    // Set maximum date to today (prevent future dates)
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
    
    // Add form submit event listener
    ageForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally
        
        // Validate and calculate age
        if (validateForm()) {
            calculateAge();
        }
    });
    
    // Add real-time validation feedback
    nameInput.addEventListener('input', function() {
        clearError(this);
    });
    
    dobInput.addEventListener('change', function() {
        clearError(this);
        validateDate();
    });
    
    /**
     * Validates the form inputs
     * @returns {boolean} - True if form is valid, false otherwise
     */
    function validateForm() {
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        // Validate date of birth
        if (!dobInput.value) {
            showError(dobInput, 'Please select your date of birth');
            isValid = false;
        } else if (!validateDate()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validates the date of birth
     * @returns {boolean} - True if date is valid, false otherwise
     */
    function validateDate() {
        const selectedDate = new Date(dobInput.value);
        const today = new Date();
        
        // Check if date is in the future
        if (selectedDate > today) {
            showError(dobInput, 'Date of birth cannot be in the future');
            return false;
        }
        
        // Check if date is too far in the past (more than 120 years)
        const maxAge = 120;
        const maxDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        if (selectedDate < maxDate) {
            showError(dobInput, 'Please enter a valid date of birth');
            return false;
        }
        
        return true;
    }
    
    /**
     * Calculates the age based on date of birth
     */
    function calculateAge() {
        const name = nameInput.value.trim();
        const birthDate = new Date(dobInput.value);
        const today = new Date();
        
        // Calculate age components
        const age = calculateAgeComponents(birthDate, today);
        
        // Display the result
        displayResult(name, age);
        
        // Show result section with animation
        showResultSection();
    }
    
    /**
     * Calculates years, months, and days between two dates
     * @param {Date} birthDate - The birth date
     * @param {Date} currentDate - The current date
     * @returns {Object} - Object containing years, months, and days
     */
    function calculateAgeComponents(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    }
    
    /**
     * Displays the calculated age result
     * @param {string} name - User's name
     * @param {Object} age - Age components object
     */
    function displayResult(name, age) {
        // Create friendly greeting message
        const greeting = `Hello ${name}, your age is:`;
        resultGreeting.textContent = greeting;
        
        // Create age details HTML
        const ageHTML = `
            <div class="age-item">
                <span class="age-number">${age.years}</span>
                <span class="age-label">Years</span>
            </div>
            <div class="age-item">
                <span class="age-number">${age.months}</span>
                <span class="age-label">Months</span>
            </div>
            <div class="age-item">
                <span class="age-number">${age.days}</span>
                <span class="age-label">Days</span>
            </div>
        `;
        
        ageDetails.innerHTML = ageHTML;
    }
    
    /**
     * Shows the result section with smooth animation
     */
    function showResultSection() {
        resultSection.classList.remove('hidden');
        
        // Trigger reflow to ensure animation works
        void resultSection.offsetWidth;
        
        resultSection.classList.add('show');
        
        // Scroll to result section smoothly
        setTimeout(() => {
            resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
    
    /**
     * Shows error message for a specific input
     * @param {HTMLElement} input - The input element
     * @param {string} message - Error message to display
     */
    function showError(input, message) {
        // Remove existing error if any
        clearError(input);
        
        // Add error styling to input
        input.style.borderColor = 'var(--error-color)';
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        
        // Insert error message after the input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        
        // Shake animation for input
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
    
    /**
     * Clears error message for a specific input
     * @param {HTMLElement} input - The input element
     */
    function clearError(input) {
        // Remove error styling
        input.style.borderColor = '';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    /**
     * Adds shake animation for error feedback
     */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(event) {
        // Press Enter to calculate when form is focused
        if (event.key === 'Enter' && document.activeElement.form === ageForm) {
            event.preventDefault();
            ageForm.dispatchEvent(new Event('submit'));
        }
        
        // Press Escape to clear results
        if (event.key === 'Escape' && !resultSection.classList.contains('hidden')) {
            hideResults();
        }
    });
    
    /**
     * Hides the result section
     */
    function hideResults() {
        resultSection.classList.remove('show');
        setTimeout(() => {
            resultSection.classList.add('hidden');
        }, 300);
    }
    
    // Add a reset button functionality (optional enhancement)
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'reset-btn';
    resetButton.textContent = 'Reset';
    resetButton.style.cssText = `
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
        padding: 10px 20px;
        border-radius: var(--border-radius);
        font-size: 0.9rem;
        cursor: pointer;
        margin-top: 15px;
        transition: var(--transition);
        display: none;
    `;
    
    resetButton.addEventListener('click', function() {
        ageForm.reset();
        hideResults();
        clearAllErrors();
        this.style.display = 'none';
    });
    
    resetButton.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.color = 'var(--primary-color)';
    });
    
    resetButton.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border-color)';
        this.style.color = 'var(--text-secondary)';
    });
    
    // Insert reset button after the calculate button
    ageForm.appendChild(resetButton);
    
    // Show reset button when form has values
    [nameInput, dobInput].forEach(input => {
        input.addEventListener('input', function() {
            if (nameInput.value.trim() && dobInput.value) {
                resetButton.style.display = 'inline-block';
            } else {
                resetButton.style.display = 'none';
            }
        });
    });
    
    /**
     * Clears all error messages
     */
    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.input-field').forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    // Add loading state for better UX
    function showLoadingState() {
        const calculateBtn = document.querySelector('.calculate-btn');
        const originalContent = calculateBtn.innerHTML;
        
        calculateBtn.innerHTML = `
            <span>Calculating...</span>
            <div class="loading-spinner" style="
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;
        
        calculateBtn.disabled = true;
        
        // Add spinner animation
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
        
        return () => {
            calculateBtn.innerHTML = originalContent;
            calculateBtn.disabled = false;
        };
    }
    
    // Modify the calculateAge function to include loading state
    const originalCalculateAge = calculateAge;
    calculateAge = function() {
        const restoreButton = showLoadingState();
        
        // Simulate processing time for better UX (remove in production)
        setTimeout(() => {
            originalCalculateAge();
            restoreButton();
        }, 500);
    };
    
    console.log('Age Calculator initialized successfully!');
});
