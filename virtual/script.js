// ==================== Navigation Active State ====================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    window.addEventListener('scroll', updateActiveNavLink);
    
    // Attach form handlers
    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);
    document.getElementById('officerLoginForm').addEventListener('submit', handleOfficerLogin);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ==================== Modal Functions ====================
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const userModal = document.getElementById('userModal');
    const officerModal = document.getElementById('officerModal');
    
    if (event.target === userModal) {
        closeModal('user');
    }
    if (event.target === officerModal) {
        closeModal('officer');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('user');
        closeModal('officer');
    }
});

// ==================== Password Visibility Toggle ====================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('officerPassword');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ==================== Handle User Login ====================
function handleUserLogin(event) {
    event.preventDefault();
    console.log('User login form submitted');
    
    const userNik = document.getElementById('userNik').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const cameraCheckbox = document.querySelector('#userLoginForm input[name="camera"]');
    const microphoneCheckbox = document.querySelector('#userLoginForm input[name="microphone"]');
    
    const cameraEnabled = cameraCheckbox ? cameraCheckbox.checked : true;
    const microphoneEnabled = microphoneCheckbox ? microphoneCheckbox.checked : true;
    
    // Validasi NIK
    if (!userNik) {
        showNotification('Silakan masukkan NIK', 'error');
        return false;
    }
    
    if (userNik.length !== 16) {
        showNotification('NIK harus terdiri dari 16 digit', 'error');
        return false;
    }
    
    if (!/^\d{16}$/.test(userNik)) {
        showNotification('NIK hanya boleh berisi angka', 'error');
        return false;
    }
    
    if (!userName) {
        showNotification('Silakan masukkan nama lengkap', 'error');
        return false;
    }
    
    const userInfo = {
        role: 'user',
        nik: userNik,
        name: userName,
        cameraEnabled: cameraEnabled,
        microphoneEnabled: microphoneEnabled,
        loginTime: new Date().toISOString(),
        sessionId: generateSessionId()
    };
    
    console.log('Saving user info:', userInfo);
    localStorage.setItem('voiceconnect_user', JSON.stringify(userInfo));
    
    showNotification(`Selamat datang ${userName}! Membuka video call...`, 'success');
    
    setTimeout(() => {
        console.log('Redirecting to user-video.html');
        window.location.href = 'user-video.html';
    }, 1000);
    
    return false;
}

// ==================== Handle Officer Login ====================
function handleOfficerLogin(event) {
    event.preventDefault();
    console.log('Officer login form submitted');
    
    const officerId = document.getElementById('officerId').value.trim();
    const officerName = document.getElementById('officerName').value.trim();
    const officerPassword = document.getElementById('officerPassword').value;
    const cameraCheckbox = document.querySelector('#officerLoginForm input[name="camera"]');
    const microphoneCheckbox = document.querySelector('#officerLoginForm input[name="microphone"]');
    
    const cameraEnabled = cameraCheckbox ? cameraCheckbox.checked : true;
    const microphoneEnabled = microphoneCheckbox ? microphoneCheckbox.checked : true;
    
    // Validasi
    if (!officerId) {
        showNotification('Silakan masukkan ID Petugas', 'error');
        return false;
    }
    
    if (!officerName) {
        showNotification('Silakan masukkan nama petugas', 'error');
        return false;
    }
    
    if (!officerPassword) {
        showNotification('Silakan masukkan kata sandi', 'error');
        return false;
    }
    
    if (officerPassword.length < 6) {
        showNotification('Kata sandi minimal 6 karakter', 'error');
        return false;
    }
    
    const officerInfo = {
        role: 'officer',
        id: officerId,
        name: officerName,
        cameraEnabled: cameraEnabled,
        microphoneEnabled: microphoneEnabled,
        loginTime: new Date().toISOString(),
        sessionId: generateSessionId(),
        isVerified: true
    };
    
    console.log('Saving officer info:', officerInfo);
    localStorage.setItem('voiceconnect_officer', JSON.stringify(officerInfo));
    
    showNotification(`Selamat datang Petugas ${officerName}! Membuka dashboard...`, 'success');
    
    setTimeout(() => {
        console.log('Redirecting to officer-dashboard.html');
        window.location.href = 'officer-dashboard.html';
    }, 1000);
    
    return false;
}

// ==================== Handle Contact Form ====================
function handleContactForm(event) {
    event.preventDefault();
    
    const nameInput = document.querySelector('#contactForm input[placeholder="Nama Anda"]');
    const emailInput = document.querySelector('#contactForm input[placeholder="Email Anda"]');
    const messageInput = document.querySelector('#contactForm textarea');
    
    const data = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    };
    
    console.log('Contact form submitted:', data);
    showNotification('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.', 'success');
    
    event.target.reset();
    return false;
}

// ==================== Generate Session ID ====================
function generateSessionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sessionId = '';
    for (let i = 0; i < 16; i++) {
        sessionId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sessionId;
}

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                animation: slideInRight 0.3s ease-out;
                z-index: 3000;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: white;
                font-weight: 500;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== Smooth Scroll Behavior ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
            return;
        }

        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Animated Counter ====================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('hero-stats')) {
            const stats = entry.target.querySelectorAll('h3');
            stats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (!isNaN(number) && !stat.dataset.animated) {
                    stat.dataset.animated = true;
                    animateCounter(stat, number);
                }
            });
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// ==================== Feature Card Animation ====================
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = `slideUp 0.6s ease-out forwards`;
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

featureCards.forEach(card => {
    cardObserver.observe(card);
});

// ==================== Mobile Menu Toggle ====================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.style.display = 'none';
        });
    });
}

// ==================== Form Input Validation ====================
const nikInput = document.getElementById('userNik');
if (nikInput) {
    nikInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        
        if (this.value.length === 16) {
            this.style.borderColor = '#10b981';
        } else if (this.value.length > 0) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
    
    nikInput.addEventListener('blur', function() {
        if (this.value.length !== 16 && this.value.length > 0) {
            showNotification('NIK harus terdiri dari 16 digit', 'error');
            this.style.borderColor = '#ef4444';
        } else if (this.value.length === 16) {
            this.style.borderColor = '';
        }
    });
}

const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        const email = this.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid && email !== '') {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
});

// ==================== Add CSS Animations ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Initialize ====================
console.log('VoiceConnect website loaded successfully!');
console.log('Login sebagai Pengguna atau Petugas untuk memulai video call');
