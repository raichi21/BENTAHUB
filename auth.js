// ========================================
// AUTHENTICATION MODULE
// ========================================

// Demo Users Database
const DEMO_USERS = {
    'admin@bentahub.com': {
        password: 'demo123',
        role: 'admin',
        name: 'Admin User',
        branch: 'Head Office'
    },
    'cashier@bentahub.com': {
        password: 'demo123',
        role: 'cashier',
        name: 'Maria Santos',
        branch: 'Lourdes Main Branch'
    },
    'staff@bentahub.com': {
        password: 'demo123',
        role: 'staff',
        name: 'Juan Dela Cruz',
        branch: 'Lourdes Main Branch'
    },
    'customer@bentahub.com': {
        password: 'demo123',
        role: 'customer',
        name: 'Maria Reyes',
        branch: null
    }
};

// Initialize Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Check if user is already logged in
    checkExistingSession();
});

/**
 * Handle Login Submission
 */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    const user = DEMO_USERS[email];

    if (!user || user.password !== password) {
        showError('Invalid email or password. Please try again.');
        return;
    }

    // Store session
    const session = {
        email: email,
        role: user.role,
        name: user.name,
        branch: user.branch,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('bentahub_session', JSON.stringify(session));
    localStorage.setItem('bentahub_user', JSON.stringify(user));

    // Redirect to appropriate dashboard
    redirectToDashboard(user.role);
}

/**
 * Handle Registration
 */
function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    // Basic validation
    if (!fullName || !email || !password || !role) {
        showError('Please fill in all fields');
        return;
    }

    // Check if email already exists
    if (DEMO_USERS[email]) {
        showError('Email already exists. Please try another.');
        return;
    }

    // Add new user to demo database
    DEMO_USERS[email] = {
        password: password,
        role: role,
        name: fullName,
        branch: role === 'customer' ? null : 'Lourdes Main Branch'
    };

    // Store session and redirect
    const session = {
        email: email,
        role: role,
        name: fullName,
        branch: role === 'customer' ? null : 'Lourdes Main Branch',
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('bentahub_session', JSON.stringify(session));
    localStorage.setItem('bentahub_user', JSON.stringify(DEMO_USERS[email]));

    showSuccess('Account created successfully! Redirecting...');
    setTimeout(() => {
        redirectToDashboard(role);
    }, 1500);
}

/**
 * Toggle between Login and Register Forms
 */
function toggleRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');

    // Clear form fields
    if (loginForm.classList.contains('active')) {
        registerForm.reset();
    } else {
        loginForm.reset();
    }
}

/**
 * Quick Login for Demo
 */
function quickLogin(email, role) {
    const user = DEMO_USERS[email];
    
    if (!user) {
        showError('User not found');
        return;
    }

    const session = {
        email: email,
        role: user.role,
        name: user.name,
        branch: user.branch,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('bentahub_session', JSON.stringify(session));
    localStorage.setItem('bentahub_user', JSON.stringify(user));

    redirectToDashboard(user.role);
}

/**
 * Redirect to appropriate dashboard
 */
function redirectToDashboard(role) {
    const dashboardMap = {
        'admin': 'dashboard.html',
        'cashier': 'cashier-dashboard.html',
        'staff': 'staff-dashboard.html',
        'customer': 'customer-dashboard.html'
    };

    const dashboardUrl = dashboardMap[role];
    if (dashboardUrl) {
        window.location.href = dashboardUrl;
    }
}

/**
 * Check existing session
 */
function checkExistingSession() {
    const session = localStorage.getItem('bentahub_session');
    
    if (session) {
        const user = JSON.parse(session);
        // Automatically redirect if session exists
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            redirectToDashboard(user.role);
        }
    }
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('bentahub_session');
    localStorage.removeItem('bentahub_user');
    window.location.href = '/index.html';
}

/**
 * Get current user session
 */
function getCurrentSession() {
    const session = localStorage.getItem('bentahub_session');
    return session ? JSON.parse(session) : null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return localStorage.getItem('bentahub_session') !== null;
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const form = document.querySelector('.auth-form.active');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const form = document.querySelector('.auth-form.active');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
}

/**
 * Alert Styles CSS
 */
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .alert {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        animation: slideDown 0.4s ease-out;
    }

    .alert-danger {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--danger-color);
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .alert-success {
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .alert i {
        flex-shrink: 0;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(alertStyles);
