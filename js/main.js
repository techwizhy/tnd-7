document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    if (typeof initEnrollmentForm === 'function') initEnrollmentForm();
    initThemeToggle();
    initScrollTop();
    initMagneticButtons();
    initCustomCursor();
});

/* Navbar Scroll Effect */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* Enrollment Form Submission Handler */
function initEnrollmentForm() {
  const enrollmentForms = document.querySelectorAll('.enrollment-form');

  enrollmentForms.forEach(form => {
    const successMessage = form.querySelector('.form-feedback-alert');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        return;
      }

      const submitBtn = form.querySelector('.submit-button');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'ENROLLING...';

      setTimeout(() => {
        // Success State
        submitBtn.textContent = 'SUCCESS!';
        if (successMessage) {
          successMessage.style.display = 'block';
        }
        
        // Clear Form inputs after submission
        form.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          if (successMessage) {
            successMessage.style.display = 'none';
          }
        }, 3000);
      }, 1500);
    });
  });
}

/* Unified Theme Toggle Logic */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
  const isRegisterPage = window.location.pathname.includes('register.html');
  const body = document.body;
  const docEl = document.documentElement;

  if (!themeToggle) return;

  const applyTheme = (isDark) => {
    if (isRegisterPage) {
      // Register page is default dark, so light theme is body.classList.add('light-theme')
      if (isDark) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      }
    } else {
      // Home page is default light, so dark theme is docEl.classList.add('dark-theme')
      if (isDark) {
        docEl.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        docEl.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }

    if (themeIcon) {
      if (isDark) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }

    // Update SVG Gradient Stops
    const goldGrad = document.getElementById('gold-grad');
    if (goldGrad) {
      const stops = goldGrad.querySelectorAll('stop');
      if (stops.length >= 3) {
        if (!isDark) {
          stops[0].setAttribute('stop-color', '#dfba73');
          stops[1].setAttribute('stop-color', '#c5a059');
          stops[2].setAttribute('stop-color', '#9e7831');
        } else {
          stops[0].setAttribute('stop-color', '#F2C94C');
          stops[1].setAttribute('stop-color', '#D4AF37');
          stops[2].setAttribute('stop-color', '#AA8524');
        }
      }
    }
  };

  // Load saved theme or default to system preference (or dark theme default)
  const savedTheme = localStorage.getItem('theme');
  let isDark = savedTheme !== 'light'; // default dark
  if (!isRegisterPage && !savedTheme) {
    isDark = false; // default light for home
  }
  
  applyTheme(isDark);

  themeToggle.addEventListener('click', () => {
    let currentIsDark;
    if (isRegisterPage) {
      currentIsDark = !body.classList.contains('light-theme');
    } else {
      currentIsDark = docEl.classList.contains('dark-theme');
    }
    applyTheme(!currentIsDark);
  });
}

/* Scroll to Top Interactivity */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* Magnetic Button Hover Effect */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.nav-btn, .btn-pill-gold, .btn-intro, .cta-button, .hero-cta-btn, .submit-button');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const strength = 10; // Pull strength in px
      const pullX = (x / (rect.width / 2)) * strength;
      const pullY = (y / (rect.height / 2)) * strength;
      
      btn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.02)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* Custom Luxury Cursor Interactivity */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice && cursor && cursorDot) {
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const animateCursor = () => {
      const ease = 0.15;
      if (cursorX === -100) {
        cursorX = mouseX;
        cursorY = mouseY;
      } else {
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
      }
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
    
    // Event delegation for cursor hover state scaling
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .stat-capsule, .what-card, .testimonial-card, .accordion-header, .course-card');
      if (target) {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .stat-capsule, .what-card, .testimonial-card, .accordion-header, .course-card');
      if (target) {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      }
    });
  }
}

/* Mobile Menu Toggle */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinkItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

/* Smooth Scrolling with Offset */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}
