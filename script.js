/* ========== GLOBAL UTILITY ========== */
const body = document.body;
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('heroTitle');
const cursor = document.getElementById('cursor');
const ticker = document.getElementById('ticker');
const pricingSpotlight = document.getElementById('pricingSpotlight');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let tickerAnimation = null;
let tickerTargetRate = 1;
let tickerCurrentRate = 1;
let tickerRateFrame = null;

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    body.classList.add('no-cursor');
}

/* ========== PRELOADER ========== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    setTimeout(() => {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.remove();
        }, 800);
    }, 1500);
}

/* ========== SMOOTH SCROLL WITH LENIS ========== */
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    updateCursor();
    updateTickerRate();
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

function scrollToElement(target) {
    if (!target) return;
    const offset = 90;
    lenis.scrollTo(target, { offset });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            scrollToElement(target);
            closeMobileMenu();
        });
    });
}

function updateActiveNavLink() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
            links.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

/* ========== NAVBAR & MOBILE MENU ========== */
function updateNavbarOnScroll() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function initMobileMenu() {
    if (!hamburger || !navbarMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    if (!hamburger || !navbarMenu) return;
    hamburger.classList.remove('active');
    navbarMenu.classList.remove('active');
}

/* ========== HERO TEXT ANIMATION ========== */
function initHeroTitleAnimation() {
    if (!heroTitle) return;
    setTimeout(() => {
        heroTitle.classList.add('loaded');
    }, 200);
}

/* ========== CURSOR & MAGNETIC UI ========== */
function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
}

function initCursor() {
    if (!cursor || isTouchDevice) return;

    window.addEventListener('mousemove', event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const hoverTargets = document.querySelectorAll('button, .nav-link, .service-card, .pricing-card, .portfolio-card');
    hoverTargets.forEach(target => {
        target.addEventListener('pointerenter', () => {
            cursor.classList.add('cursor--active');
        });
        target.addEventListener('pointerleave', () => {
            cursor.classList.remove('cursor--active');
        });
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .cta-button');

    buttons.forEach(button => {
        const onMove = event => {
            const rect = button.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left - rect.width / 2) * 0.16;
            const offsetY = (event.clientY - rect.top - rect.height / 2) * 0.12;
            button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        };

        button.addEventListener('pointerenter', () => {
            button.addEventListener('pointermove', onMove);
        });
        button.addEventListener('pointerleave', () => {
            button.removeEventListener('pointermove', onMove);
            button.style.transform = '';
        });
    });
}

function initTiltCards() {
    const cards = document.querySelectorAll('.service-card, .portfolio-card');

    cards.forEach(card => {
        const onMove = event => {
            const rect = card.getBoundingClientRect();
            const rx = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
            const ry = ((event.clientX - rect.left) / rect.width - 0.5) * -14;
            card.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
        };

        card.addEventListener('pointerenter', () => {
            card.style.transition = 'transform 0.15s ease';
            card.addEventListener('pointermove', onMove);
        });

        card.addEventListener('pointerleave', () => {
            card.removeEventListener('pointermove', onMove);
            card.style.transform = 'translateZ(0)';
        });
    });
}

/* ========== PRICING SPOTLIGHT ========== */
function initPricingSpotlight() {
    if (!pricingSpotlight) return;

    pricingSpotlight.addEventListener('pointermove', event => {
        const rect = pricingSpotlight.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        pricingSpotlight.style.setProperty('--spot-x', `${x}%`);
        pricingSpotlight.style.setProperty('--spot-y', `${y}%`);
    });

    pricingSpotlight.addEventListener('pointerleave', () => {
        pricingSpotlight.style.setProperty('--spot-x', '50%');
        pricingSpotlight.style.setProperty('--spot-y', '50%');
    });
}

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -80px 0px',
    });

    elements.forEach(el => observer.observe(el));
}

/* ========== COUNTER ANIMATION ========== */
function initCountUpAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                obs.disconnect();
            }
        });
    }, { threshold: 0.35 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const format = counter.textContent.includes('★') ? 'star' : counter.textContent.includes('H') ? 'hour' : 'plus';
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        const tick = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            if (format === 'plus') {
                counter.textContent = `${value}+`;
            } else if (format === 'hour') {
                counter.textContent = `${value}H`;
            } else if (format === 'star') {
                counter.textContent = `${Math.max(1, value)}★`;
            } else {
                counter.textContent = value;
            }
            if (progress < 1) requestAnimationFrame(tick);
            else {
                if (format === 'plus') counter.textContent = `${target}+`;
                if (format === 'hour') counter.textContent = `${target}H`;
                if (format === 'star') counter.textContent = `${target}★`;
            }
        };

        requestAnimationFrame(tick);
    });
}

/* ========== TICKER HOVER SLOWDOWN ========== */
function initTickerHover() {
    if (!ticker) return;
    const animations = ticker.getAnimations();
    if (animations.length) tickerAnimation = animations[0];

    const updateRate = () => {
        if (!tickerAnimation) return;
        tickerCurrentRate += (tickerTargetRate - tickerCurrentRate) * 0.16;
        tickerAnimation.playbackRate = tickerCurrentRate;
        if (Math.abs(tickerCurrentRate - tickerTargetRate) > 0.01) {
            tickerRateFrame = requestAnimationFrame(updateRate);
        }
    };

    ticker.addEventListener('pointerenter', () => {
        tickerTargetRate = 0.22;
        if (!tickerRateFrame) updateRate();
    });

    ticker.addEventListener('pointerleave', () => {
        tickerTargetRate = 1;
        if (!tickerRateFrame) updateRate();
    });
}

function updateTickerRate() {
    if (!tickerAnimation) return;
    if (Math.abs(tickerCurrentRate - tickerTargetRate) > 0.01) {
        tickerCurrentRate += (tickerTargetRate - tickerCurrentRate) * 0.15;
        tickerAnimation.playbackRate = tickerCurrentRate;
    }
}

/* ========== BUTTON CLICK BEHAVIORS ========== */
function initCTAs() {
    const primaryBtns = document.querySelectorAll('.cta-button, .btn-primary');
    primaryBtns.forEach(button => {
        button.addEventListener('click', () => {
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) scrollToElement(pricingSection);
        });
    });

    const viewPortfolio = document.querySelector('.hero-actions .btn-ghost');
    if (viewPortfolio) {
        viewPortfolio.addEventListener('click', () => {
            const portfolio = document.getElementById('portfolio');
            if (portfolio) scrollToElement(portfolio);
        });
    }

    const bookBtn = document.querySelector('.cta-banner .btn-white');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            alert('Booking flow coming soon. Please message us on WhatsApp or Instagram for priority production.');
        });
    }
}

function initPricingButtons() {
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(button => {
        button.addEventListener('click', event => {
            const card = event.currentTarget.closest('.pricing-card');
            const title = card ? card.querySelector('.pricing-label')?.textContent : 'plan';
            alert(`You selected the ${title} plan. Our team will reach out with next steps.`);
        });
    });
}

function initPortfolioButton() {
    const button = document.querySelector('.portfolio .btn-ghost');
    if (!button) return;
    button.addEventListener('click', () => {
        alert('Full portfolio would open here for the premium showcase.');
    });
}

/* ========== FOOTER LINE DRAW ========== */
function initFooterReveal() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(footer);
}

/* ========== INITIALIZATION ========== */
function initAll() {
    initPreloader();
    initSmoothScroll();
    initMobileMenu();
    initHeroTitleAnimation();
    initCursor();
    initMagneticButtons();
    initTiltCards();
    initPricingSpotlight();
    initScrollReveal();
    initCountUpAnimation();
    initTickerHover();
    initCTAs();
    initPricingButtons();
    initPortfolioButton();
    initFooterReveal();
    updateNavbarOnScroll();
    updateActiveNavLink();
}

window.addEventListener('scroll', () => {
    updateNavbarOnScroll();
    updateActiveNavLink();
    if (hero) {
        hero.style.setProperty('--hero-parallax', `${window.scrollY * 0.4}px`);
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
        hamburger.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', initAll);
