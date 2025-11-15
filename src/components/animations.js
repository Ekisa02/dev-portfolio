// Scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        // Observe elements for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Add fade-in class to elements that should animate
        document.addEventListener('DOMContentLoaded', () => {
            this.elements = document.querySelectorAll('.project-card, .timeline-content, .skill-category, .contact-item');
            this.elements.forEach(el => {
                el.classList.add('fade-in');
                this.observer.observe(el);
            });
        });
    }
}

// Particle background animation
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        const bg = document.querySelector('.animated-bg');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.3';
        bg.appendChild(this.canvas);
        
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off walls
            if (p.x <= 0 || p.x >= this.canvas.width) p.speedX *= -1;
            if (p.y <= 0 || p.y >= this.canvas.height) p.speedY *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// Typing animation for terminal
class TypingAnimation {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentText = this.text.substring(0, this.currentIndex);
        this.element.textContent = currentText;
        
        if (!this.isDeleting && this.currentIndex < this.text.length) {
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.speed / 2);
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize particle background
    new ParticleBackground();
    
    // Add floating animation to cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Utility function for smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollAnimations, ParticleBackground, TypingAnimation };
}



// Typing effect for badge
class TypingEffect {
    constructor(element, texts, speed = 100, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.textIndex % this.texts.length;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Enhanced badge text rotation with colors
class BadgeTextRotator {
    constructor(badgeElement, badgeTextElement, texts) {
        this.badge = badgeElement;
        this.badgeText = badgeTextElement;
        this.texts = texts;
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.rotateText();
        setInterval(() => this.rotateText(), 3000);
    }

    rotateText() {
        const current = this.texts[this.currentIndex];
        
        // Add fade out effect
        this.badge.style.opacity = '0';
        this.badge.style.borderColor = current.color;
        
        setTimeout(() => {
            this.badgeText.textContent = current.text;
            this.badge.style.opacity = '1';
            
            // Update pulse dot color
            const pulseDot = this.badge.querySelector('.pulse-dot');
            if (pulseDot) {
                pulseDot.style.backgroundColor = current.color;
            }
        }, 300);

        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    }
}

// Initialize typing effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTypingEffects();
});

function initializeTypingEffects() {
    const badgeText = document.querySelector('.badge-text');
    if (badgeText) {
        const texts = [
            "🚀 Innovating for Social Impact",
            "📱 Mobile & AI Specialist", 
            "⚡ Building Scalable Solutions",
            "🌍 Tech for Good Advocate",
            "💻 Open Source Contributor"
        ];
        new TypingEffect(badgeText, texts, 80, 2000);
    }

    // Alternative: Color-changing badge rotation
    // initializeBadgeRotation();
}

function initializeBadgeRotation() {
    const badge = document.querySelector('.hero-badge');
    const badgeText = document.querySelector('.badge-text');
    
    if (badge && badgeText) {
        const badgeTexts = [
            { text: "🚀 Innovating for Social Impact", color: "#10b981" },
            { text: "📱 Mobile & AI Specialist", color: "#3b82f6" },
            { text: "⚡ Building Scalable Solutions", color: "#f59e0b" },
            { text: "🌍 Tech for Good Advocate", color: "#8b5cf6" },
            { text: "💻 Open Source Contributor", color: "#ef4444" }
        ];

        new BadgeTextRotator(badge, badgeText, badgeTexts);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TypingEffect, BadgeTextRotator, initializeTypingEffects };
}