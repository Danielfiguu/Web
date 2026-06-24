// Language Management
const languageToggle = {
    currentLang: localStorage.getItem('language') || 'es',

    init() {
        this.setLanguage(this.currentLang);
        this.attachListeners();
    },

    attachListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);

        // Update all translatable elements
        document.querySelectorAll('[data-text-es][data-text-en]').forEach(element => {
            const text = element.getAttribute(`data-text-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update page language attribute
        document.documentElement.lang = lang;
    }
};

// Initialize language toggle
document.addEventListener('DOMContentLoaded', () => {
    languageToggle.init();

    // Add smooth scroll to CTA button
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = getComputedStyle(entry.target).animation;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all menu cards and cards
    document.querySelectorAll('.menu-card, .contact-card, .about-content').forEach(element => {
        observer.observe(element);
    });
});

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for nav items
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 15px 35px rgba(233, 30, 99, 0.25)';
    } else {
        navbar.style.boxShadow = '0 10px 30px rgba(233, 30, 99, 0.15)';
    }
});

// Enhanced hover effects for menu items
document.querySelectorAll('.item-list li').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Prevent animation flicker on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
