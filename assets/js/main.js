/* =======================================
   EV Battery Health & Diagnostics
   Main JavaScript
   ======================================= */

// ---- Theme Toggle ----
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

// Init theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Mobile menu display trick (toggling visibility)
function updateMobileMenuVisibility() {
  if (window.innerWidth <= 1024) {
    mobileMenu.classList.add('visible');
  } else {
    mobileMenu.classList.remove('visible', 'open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
}
updateMobileMenuVisibility();
window.addEventListener('resize', updateMobileMenuVisibility);

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ---- Scroll Reveal (Intersection Observer) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Add staggered delay for children in grids
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
        const idx = siblings.indexOf(entry.target);
        if (idx > 0 && idx < 8) {
          entry.target.style.transitionDelay = `${idx * 0.07}s`;
        }
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ---- Smooth Active Nav Highlighting ----
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// Active nav link style
const styleSheet = document.createElement('style');
styleSheet.textContent = `.nav-link.active { color: var(--accent-blue) !important; background: rgba(14,165,233,0.08); }`;
document.head.appendChild(styleSheet);

// ---- Skill Bar Animations ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'none';
        setTimeout(() => {
          fill.style.transition = `width 1s ease ${i * 0.1}s`;
          fill.style.width = targetWidth;
        }, 50);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(el => skillObserver.observe(el));

// ---- Counter Animation for Metrics ----
function animateCounter(el, target, suffix = '', duration = 1500) {
  const isText = isNaN(parseInt(target));
  if (isText) { el.textContent = target; return; }
  const start = 0;
  const end = parseInt(target);
  const step = Math.ceil(end / (duration / 16));
  let current = start;
  const timer = setInterval(() => {
    current = Math.min(current + step, end);
    el.textContent = current + suffix;
    if (current >= end) clearInterval(timer);
  }, 16);
}

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-value').forEach(val => {
        const text = val.textContent.trim();
        if (text.includes('+')) {
          const num = parseInt(text);
          animateCounter(val, num, '+');
        }
      });
      metricsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const metricsGrid = document.querySelector('.metrics-grid');
if (metricsGrid) metricsObserver.observe(metricsGrid);

// ---- Contact Form ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const btn = form.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  }, 1200);
}

// ---- Pipeline Step Hover Enhancement ----
document.querySelectorAll('.pipeline-step').forEach((step, idx) => {
  step.style.transition = `transform 0.3s ease ${idx * 0.05}s`;
  step.addEventListener('mouseenter', () => {
    step.querySelector('.pipeline-num').style.transform = 'scale(1.15)';
  });
  step.addEventListener('mouseleave', () => {
    step.querySelector('.pipeline-num').style.transform = 'scale(1)';
  });
});

// ---- Floating Data Cards subtle animation in Hero ----
const floatingCards = document.querySelectorAll('.hero-visual [style*="position:absolute"]');
floatingCards.forEach((card, i) => {
  card.style.animation = `float-card ${3 + i * 0.5}s ease-in-out ${i * 0.6}s infinite alternate`;
});

const floatStyle = document.createElement('style');
floatStyle.textContent = `
@keyframes float-card {
  from { transform: translateY(0px); }
  to   { transform: translateY(-8px); }
}`;
document.head.appendChild(floatStyle);

// ---- Atlas Row expand on hover ----
document.querySelectorAll('.atlas-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.transform = 'scale(1.01)';
    row.style.transition = 'transform 0.25s ease';
    row.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
  });
  row.addEventListener('mouseleave', () => {
    row.style.transform = 'scale(1)';
    row.style.boxShadow = 'none';
  });
});

// ---- Degradation cards stagger reveal ----
document.querySelectorAll('.deg-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 5) * 0.06}s`;
});

// ---- Scroll to top when clicking logo ----
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Navbar CTA Pulse ----
const navCta = document.querySelector('.nav-actions .btn-primary');
if (navCta) {
  setTimeout(() => {
    navCta.style.boxShadow = '0 0 0 0 rgba(14,165,233,0.5)';
    navCta.style.animation = 'cta-pulse 2s ease-in-out 3s 3';
    const ctaStyle = document.createElement('style');
    ctaStyle.textContent = `
      @keyframes cta-pulse {
        0%   { box-shadow: 0 4px 24px rgba(14,165,233,0.35); }
        50%  { box-shadow: 0 4px 32px rgba(14,165,233,0.7), 0 0 0 6px rgba(14,165,233,0.15); }
        100% { box-shadow: 0 4px 24px rgba(14,165,233,0.35); }
      }`;
    document.head.appendChild(ctaStyle);
  }, 2000);
}

console.log('%c⚡ EV Battery Health & Diagnostics', 'color:#0ea5e9;font-size:18px;font-weight:bold;');
console.log('%cAdvanced Lithium-ion Battery Degradation Research Platform', 'color:#14b8a6;font-size:12px;');
