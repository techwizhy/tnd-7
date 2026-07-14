document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
    initHeroMotionsites();
    initCardMouseGlows();
    initStatCounters();
    initSessionsAccordion();
    initFounder3dCardTilt();
    initFooter3dCardTilt();
    initAsciiTreeCanvas();
    initAsciiTreeCanvasV2();
    initStackingCards();
    initCivicStackingCards();
});

/* Slider / Carousel Actions */
function initCarousels() {
  // Carousel removed
}

/* 3D Scene / Visual Card Interactive Tilt Effect */


/* Mouse Coordinate Glows */
function initCardMouseGlows() {
  const cards = document.querySelectorAll('.glass-card, .founder-card, .stat-capsule');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* Statistics Incremental Counters */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-capsule-num');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'));
        const unit = target.getAttribute('data-unit') || '';
        const duration = 2000; // 2 seconds
        let startTimestamp = null;
        
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentVal = Math.floor(progress * targetVal);
          
          target.innerText = `${currentVal}${unit}`;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            target.innerText = `${targetVal}${unit}`;
          }
        };

        window.requestAnimationFrame(step);
        observer.unobserve(target); // Only animate once
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

/* Interactive Sessions Accordion Slider controller with Autoplay */
function initSessionsAccordion() {
  const accordionPanels = document.querySelectorAll('.accordion-panel');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const sliderWrapper = document.querySelector('.sessions-slider-wrapper');
  
  if (accordionPanels.length === 0) return;
  
  let activeIndex = Array.from(accordionPanels).findIndex(panel => panel.classList.contains('active'));
  if (activeIndex === -1) activeIndex = 0; // Default to Session 1

  // Mobile check: start with all closed
  if (window.innerWidth < 992) {
    accordionPanels.forEach(panel => panel.classList.remove('active'));
    activeIndex = -1;
  }

  let autoplayTimer = null;
  const autoplayDelay = 5000; // 5 seconds interval

  const setActivePanel = (index) => {
    activeIndex = index;
    accordionPanels.forEach((panel, idx) => {
      if (idx === index) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  };

  const startAutoplay = () => {
    if (window.innerWidth < 992) return; // Do not autoplay on mobile
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= accordionPanels.length) {
        nextIndex = 0;
      }
      setActivePanel(nextIndex);
    }, autoplayDelay);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // Panel hover/click logic
  accordionPanels.forEach((panel, idx) => {
    // Hover to expand on desktop
    panel.addEventListener('mouseenter', () => {
      stopAutoplay();
      if (window.innerWidth >= 992) {
        setActivePanel(idx);
      }
    });

    panel.addEventListener('click', () => {
      stopAutoplay();
      if (window.innerWidth < 992) {
        // Toggle behavior on mobile: close if already open, open and close others if closed
        if (panel.classList.contains('active')) {
          panel.classList.remove('active');
          activeIndex = -1;
        } else {
          setActivePanel(idx);
          
          // Calculate target Y instantly using the container offset and collapsed card heights
          const container = document.querySelector('.accordion-slider-container');
          const containerTop = container.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
          const navbar = document.querySelector('.navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 70;
          // Collapsed height is exactly 80px on mobile
          const targetY = containerTop + (idx * 80) - navbarHeight - 15;
          
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      } else {
        setActivePanel(idx);
        startAutoplay(); // Reset timer and resume
      }
    });
  });

  // Resume autoplay when leaving the slider wrapper area
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  }

  // Arrow navigation logic
  if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering panel click
      stopAutoplay();
      let newIndex = activeIndex - 1;
      if (newIndex < 0) {
        newIndex = accordionPanels.length - 1;
      }
      setActivePanel(newIndex);
      startAutoplay();
    });

    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering panel click
      stopAutoplay();
      let newIndex = activeIndex + 1;
      if (newIndex >= accordionPanels.length) {
        newIndex = 0;
      }
      setActivePanel(newIndex);
      startAutoplay();
    });
  }

  // Start autoplay on load
  startAutoplay();
}

/* 3D Founder Cards Tilt Effect */
function initFounder3dCardTilt() {
  const cards = document.querySelectorAll('.founder-3d-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;
      
      const rotateY = px * 12;
      const rotateX = -py * 12;
      
      const isDark = document.documentElement.classList.contains('dark-theme');
      const activeShadow = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 58, 52, 0.12)';
      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-10px) translateZ(15px)`;
      card.style.boxShadow = `0 35px 70px ${activeShadow}, 0 0 40px rgba(212, 164, 55, 0.25)`;
      card.style.borderColor = `rgba(212, 164, 55, 0.45)`;
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      const idleShadow = isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(15, 58, 52, 0.05)';
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) translateZ(0)';
      card.style.boxShadow = `0 20px 45px ${idleShadow}`;
      card.style.borderColor = 'rgba(255, 255, 255, 0.7)';
      card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.8s ease';
    });
  });
}

/* 3D Footer Cards Rubber Tilt Effect */
function initFooter3dCardTilt() {
  const cards = document.querySelectorAll('.footer-journey-box, .footer-contact-box, .footer-flag-card-inner');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;
      
      // Much larger tilt and translate coefficients for a highly flexible rubber feel
      const rotateY = px * 38;
      const rotateX = -py * 38;
      const translateX = px * 25;
      const translateY = py * 25;
      
      const isDark = document.documentElement.classList.contains('dark-theme');
      const activeShadow = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(15, 58, 52, 0.16)';
      
      card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate(${translateX}px, ${translateY}px) scale(1.05)`;
      card.style.boxShadow = `0 35px 75px ${activeShadow}, 0 0 45px rgba(212, 175, 55, 0.35)`;
      card.style.borderColor = `rgba(212, 175, 55, 0.65)`;
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out, border-color 0.2s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      // Revert styles to trigger clean fallback to CSS idle styles
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s ease';
    });
  });
}



/* Procedural ASCII Tree Canvas Engine with Spring Physics */
function initAsciiTreeCanvas() {
  const canvas = document.getElementById('ascii-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 90 };

  const chars = 'THE NEW DEMOCRACY'.split('');
  const phrase = 'THE NEW DEMOCRACY  ';
  
  // Physics parameters
  const springK = 0.08;
  const friction = 0.85;
  const repulsionForce = 8.0;

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Regenerate tree on resize
    generateTree();
  }

  // Draw procedural fractal tree to offscreen canvas and sample it
  function generateTree() {
    particles = [];
    
    // Create high-performance offscreen canvas
    const offscreen = document.createElement('canvas');
    // Scale down resolution for a crisp ASCII letter density
    const offWidth = 140;
    const offHeight = 85;
    offscreen.width = offWidth;
    offscreen.height = offHeight;
    const octx = offscreen.getContext('2d');
    
    // Clear and draw tree
    octx.fillStyle = '#000000';
    octx.fillRect(0, 0, offWidth, offHeight);
    octx.strokeStyle = '#ffffff';
    octx.lineCap = 'round';
    
    // Procedural tree drawer
    function drawBranch(x, y, len, angle, branchWidth) {
      octx.beginPath();
      octx.save();
      octx.lineWidth = branchWidth;
      octx.translate(x, y);
      octx.rotate(angle * Math.PI / 180);
      octx.moveTo(0, 0);
      octx.lineTo(0, -len);
      octx.stroke();
      
      if (len < 5) {
        octx.restore();
        return;
      }
      
      // Draw sub branches with slightly random variation
      drawBranch(0, -len, len * 0.76, angle - 22, branchWidth * 0.7);
      drawBranch(0, -len, len * 0.76, angle + 22, branchWidth * 0.7);
      octx.restore();
    }
    
    // Start branch from bottom middle
    drawBranch(offWidth / 2, offHeight - 5, 23, 0, 4.5);
    
    // Sample pixels
    const imgData = octx.getImageData(0, 0, offWidth, offHeight);
    const data = imgData.data;
    
    // Calculate mapping scales
    const scaleX = width / offWidth;
    const scaleY = height / offHeight;
    
    // Loop through grid pixels
    for (let y = 0; y < offHeight; y += 1.5) {
      for (let x = 0; x < offWidth; x += 1) {
        const index = (Math.floor(y) * offWidth + Math.floor(x)) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness > 60) {
          // Pixel is active, create an ASCII particle
          const targetX = x * scaleX;
          const targetY = y * scaleY;
          
          // Color based on height (roots/trunk vs canopy)
          let color = 'rgba(15, 82, 70, 0.7)'; // Deep brand teal
          if (y < offHeight * 0.4) {
            color = 'rgba(242, 209, 122, 0.75)'; // Soft gold leaves
          } else if (y < offHeight * 0.75) {
            color = 'rgba(46, 117, 101, 0.8)'; // Mid-level emerald
          }
          
          particles.push({
            x: targetX,
            y: targetY,
            currentX: targetX + (Math.random() - 0.5) * 40,
            currentY: targetY + (Math.random() - 0.5) * 40,
            originalX: targetX,
            originalY: targetY,
            vx: 0,
            vy: 0,
            char: phrase[Math.floor(x + y * 0.6) % phrase.length],
            color: color,
            originalColor: color,
            brightness: brightness / 255
          });
        }
      }
    }
  }

  // Physics animation loop
  function animate() {
    ctx.fillStyle = 'rgba(4, 13, 14, 0.25)'; // Smooth trails
    ctx.fillRect(0, 0, width, height);
    
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Calculate distance to mouse
      const dx = mouse.x - p.currentX;
      const dy = mouse.y - p.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < mouse.radius) {
        // Push force away from mouse
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * repulsionForce;
        const pushY = Math.sin(angle) * force * repulsionForce;
        
        p.vx -= pushX;
        p.vy -= pushY;
        
        // Glow gold/emerald on hover proximity
        p.color = `rgba(212, 164, 55, ${0.4 + force * 0.6})`;
      } else {
        p.color = p.originalColor;
      }
      
      // Spring forces snapping back
      const snapX = p.originalX - p.currentX;
      const snapY = p.originalY - p.currentY;
      
      p.vx += snapX * springK;
      p.vy += snapY * springK;
      
      // Apply friction
      p.vx *= friction;
      p.vy *= friction;
      
      // Update coordinates
      p.currentX += p.vx;
      p.currentY += p.vy;
      
      // Draw ASCII character
      ctx.fillStyle = p.color;
      ctx.fillText(p.char, p.currentX, p.currentY);
    }
    
    requestAnimationFrame(animate);
  }

  // Event Listeners
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Handle touch events for mobile
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  });

  canvas.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Initialize
  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* Procedural ASCII Tree Canvas Engine with TND Inscribed Trunk */
function initAsciiTreeCanvasV2() {
  const canvas = document.getElementById('ascii-canvas-v2');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 90 };

  const phrase = 'THE NEW DEMOCRACY  ';
  
  // Physics parameters
  const springK = 0.08;
  const friction = 0.85;
  const repulsionForce = 8.0;

  function resize() {
    const container = canvas.parentElement;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Regenerate tree on resize
    generateTree();
  }

  // Draw procedural fractal tree to offscreen canvas and sample it
  function generateTree() {
    particles = [];
    
    const offscreen = document.createElement('canvas');
    const offWidth = 140;
    const offHeight = 85;
    offscreen.width = offWidth;
    offscreen.height = offHeight;
    const octx = offscreen.getContext('2d');
    
    octx.fillStyle = '#000000';
    octx.fillRect(0, 0, offWidth, offHeight);
    octx.strokeStyle = '#ffffff';
    octx.lineCap = 'round';
    
    function drawBranch(x, y, len, angle, branchWidth) {
      octx.beginPath();
      octx.save();
      octx.lineWidth = branchWidth;
      octx.translate(x, y);
      octx.rotate(angle * Math.PI / 180);
      octx.moveTo(0, 0);
      octx.lineTo(0, -len);
      octx.stroke();
      
      if (len < 5) {
        octx.restore();
        return;
      }
      
      drawBranch(0, -len, len * 0.76, angle - 22, branchWidth * 0.7);
      drawBranch(0, -len, len * 0.76, angle + 22, branchWidth * 0.7);
      octx.restore();
    }
    
    // Start branch from bottom middle (same as Version 1)
    drawBranch(offWidth / 2, offHeight - 5, 23, 0, 4.5);
    
    const imgData = octx.getImageData(0, 0, offWidth, offHeight);
    const data = imgData.data;
    
    const scaleX = width / offWidth;
    const scaleY = height / offHeight;
    
    for (let y = 0; y < offHeight; y += 1.5) {
      for (let x = 0; x < offWidth; x += 1) {
        const index = (Math.floor(y) * offWidth + Math.floor(x)) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness > 60) {
          const targetX = x * scaleX;
          const targetY = y * scaleY;
          
          let color = 'rgba(15, 82, 70, 0.7)'; // Deep brand teal for trunk
          if (y < offHeight * 0.4) {
            color = 'rgba(242, 209, 122, 0.75)'; // Soft gold leaves
          } else if (y < offHeight * 0.75) {
            color = 'rgba(46, 117, 101, 0.8)'; // Mid-level emerald
          }
          
          particles.push({
            x: targetX,
            y: targetY,
            currentX: targetX + (Math.random() - 0.5) * 40,
            currentY: targetY + (Math.random() - 0.5) * 40,
            originalX: targetX,
            originalY: targetY,
            vx: 0,
            vy: 0,
            char: phrase[Math.floor(x + y * 0.6) % phrase.length],
            color: color,
            originalColor: color,
            brightness: brightness / 255
          });
        }
      }
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(4, 13, 14, 0.25)'; // Smooth trails
    ctx.fillRect(0, 0, width, height);
    
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      const dx = mouse.x - p.currentX;
      const dy = mouse.y - p.currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * repulsionForce;
        const pushY = Math.sin(angle) * force * repulsionForce;
        
        p.vx -= pushX;
        p.vy -= pushY;
        
        p.color = `rgba(212, 164, 55, ${0.4 + force * 0.6})`;
      } else {
        p.color = p.originalColor;
      }
      
      const snapX = p.originalX - p.currentX;
      const snapY = p.originalY - p.currentY;
      
      p.vx += snapX * springK;
      p.vy += snapY * springK;
      
      p.vx *= friction;
      p.vy *= friction;
      
      p.currentX += p.vx;
      p.currentY += p.vy;
      
      ctx.fillStyle = p.color;
      ctx.fillText(p.char, p.currentX, p.currentY);
    }
    
    requestAnimationFrame(animate);
  }

  let currentStage = '';
  
  const stageData = {
    roots: {
      tag: "STAGE 1: ROOTS",
      title: "Civic Foundations",
      desc: "The bedrock of active citizenship starts with constitutional literacy, understanding civil rights, and learning the structure of local governance.",
      details: `
        <div class="tip-item"><i class="fa-solid fa-book"></i> <span><strong>Syllabus:</strong> Constitutional Principles</span></div>
        <div class="tip-item"><i class="fa-solid fa-circle-nodes"></i> <span><strong>Skills:</strong> Rights & Institutions Mapping</span></div>
        <div class="tip-item"><i class="fa-solid fa-graduation-cap"></i> <span><strong>Impact:</strong> Fundamental Civic Literacy</span></div>
      `,
      accentLight: "#784ee4",
      accentRgbLight: "120, 78, 228",
      accentDark: "#a382ff",
      accentRgbDark: "163, 130, 255",
      num: "01",
      icon: "fa-seedling",
      badge: "Foundations",
      footer: "Pillar of Constitutional Knowledge"
    },
    trunk: {
      tag: "STAGE 2: TRUNK",
      title: "Structured Dialogue",
      desc: "Structuring cooperation across diverse viewpoints. Participants debate mock policy bills, draft amendments, and learn structured compromise.",
      details: `
        <div class="tip-item"><i class="fa-solid fa-comments"></i> <span><strong>Syllabus:</strong> Moderated Debates & Amendments</span></div>
        <div class="tip-item"><i class="fa-solid fa-users-viewfinder"></i> <span><strong>Skills:</strong> Bipartisan Problem Solving</span></div>
        <div class="tip-item"><i class="fa-solid fa-scale-balanced"></i> <span><strong>Impact:</strong> Structured Public Discussion</span></div>
      `,
      accentLight: "#b38624",
      accentRgbLight: "179, 134, 36",
      accentDark: "#f2c94c",
      accentRgbDark: "242, 201, 76",
      num: "02",
      icon: "fa-tree",
      badge: "Collaboration",
      footer: "Pillar of Bipartisan Problem Solving"
    },
    canopy: {
      tag: "STAGE 3: CANOPY",
      title: "Legislative Impact",
      desc: "Sprouting real-world civic outcomes. Transforming workshop insights into active community initiatives and direct legislative recommendations.",
      details: `
        <div class="tip-item"><i class="fa-solid fa-file-signature"></i> <span><strong>Syllabus:</strong> Resolution & Bill Formulation</span></div>
        <div class="tip-item"><i class="fa-solid fa-bullhorn"></i> <span><strong>Skills:</strong> Direct Community Advocacy</span></div>
        <div class="tip-item"><i class="fa-solid fa-award"></i> <span><strong>Impact:</strong> Active Citizen Representation</span></div>
      `,
      accentLight: "#1a8f68",
      accentRgbLight: "26, 143, 104",
      accentDark: "#2ed997",
      accentRgbDark: "46, 217, 151",
      num: "03",
      icon: "fa-leaf",
      badge: "Representation",
      footer: "Pillar of Community Advocacy & Bills"
    }
  };

  function updateCivicGrowthCard(stage) {
    if (currentStage === stage) return;
    currentStage = stage;
    
    const cardRoots = document.getElementById('civic-card-roots');
    const cardTrunk = document.getElementById('civic-card-trunk');
    const cardCanopy = document.getElementById('civic-card-canopy');
    
    if (cardRoots) {
      cardRoots.style.transform = stage === 'roots' ? 'scale(1.03)' : '';
      cardRoots.style.borderColor = stage === 'roots' ? 'var(--card-accent)' : '';
      cardRoots.style.boxShadow = stage === 'roots' ? '0 15px 40px rgba(0, 168, 181, 0.08), 0 0 35px rgba(0, 168, 181, 0.25)' : '';
    }
    if (cardTrunk) {
      cardTrunk.style.transform = stage === 'trunk' ? 'scale(1.03)' : '';
      cardTrunk.style.borderColor = stage === 'trunk' ? 'var(--card-accent)' : '';
      cardTrunk.style.boxShadow = stage === 'trunk' ? '0 15px 40px rgba(0, 168, 181, 0.08), 0 0 35px rgba(0, 168, 181, 0.25)' : '';
    }
    if (cardCanopy) {
      cardCanopy.style.transform = stage === 'canopy' ? 'scale(1.03)' : '';
      cardCanopy.style.borderColor = stage === 'canopy' ? 'var(--card-accent)' : '';
      cardCanopy.style.boxShadow = stage === 'canopy' ? '0 15px 40px rgba(0, 168, 181, 0.08), 0 0 35px rgba(0, 168, 181, 0.25)' : '';
    }
    
    const canopyInd = document.querySelector('.canopy-indicator');
    const trunkInd = document.querySelector('.trunk-indicator');
    const rootsInd = document.querySelector('.roots-indicator');
    
    if (canopyInd) canopyInd.classList.toggle('active', stage === 'canopy');
    if (trunkInd) trunkInd.classList.toggle('active', stage === 'trunk');
    if (rootsInd) rootsInd.classList.toggle('active', stage === 'roots');
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    if (height > 0) {
      const pct = mouse.y / height;
      if (pct > 0.72) {
        updateCivicGrowthCard('roots');
      } else if (pct >= 0.38) {
        updateCivicGrowthCard('trunk');
      } else {
        updateCivicGrowthCard('canopy');
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      
      if (height > 0) {
        const pct = mouse.y / height;
        if (pct > 0.72) {
          updateCivicGrowthCard('roots');
        } else if (pct >= 0.38) {
          updateCivicGrowthCard('trunk');
        } else {
          updateCivicGrowthCard('canopy');
        }
      }
    }
  });

  canvas.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* Stacking Cards Scroll Physics Animation (TND Custom Formula) */
function initStackingCards() {
  if (window.innerWidth < 992) return;
  const cards = document.querySelectorAll('.stacking-role-section .stack-card');
  if (!cards.length) return;

  const totalCards = cards.length;

  const updateCardTransforms = () => {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const nextCard = cards[index + 1];
      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const cardHeight = rect.height || 300;
        // Calculate overlap progress
        const overlap = Math.max(0, rect.bottom - nextRect.top);
        const progress = Math.min(1, Math.max(0, overlap / cardHeight));

        // Scale down cards below subsequent cards
        const maxScaleReduction = (totalCards - 1 - index) * 0.03;
        const currentScale = 1 - progress * maxScaleReduction;

        card.style.transform = `scale(${currentScale})`;
      } else {
        card.style.transform = 'scale(1)';
      }
    });
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateCardTransforms);
  }, { passive: true });

  updateCardTransforms();
}

/* Civic Stacking Cards Scroll Physics Animation */
function initCivicStackingCards() {
  if (window.innerWidth < 992) return;
  const wrappers = document.querySelectorAll('.civic-info-column .civic-card-wrapper');
  if (!wrappers.length) return;

  const totalWrappers = wrappers.length;

  const updateWrapperTransforms = () => {
    wrappers.forEach((wrapper, index) => {
      const rect = wrapper.getBoundingClientRect();
      const nextWrapper = wrappers[index + 1];
      if (nextWrapper) {
        const nextRect = nextWrapper.getBoundingClientRect();
        const wrapperHeight = rect.height || 260;
        // Calculate overlap progress
        const overlap = Math.max(0, rect.bottom - nextRect.top);
        const progress = Math.min(1, Math.max(0, overlap / wrapperHeight));

        // Scale down wrappers below subsequent wrappers
        const maxScaleReduction = (totalWrappers - 1 - index) * 0.03;
        const currentScale = 1 - progress * maxScaleReduction;

        wrapper.style.transform = `scale(${currentScale})`;
      } else {
        wrapper.style.transform = 'scale(1)';
      }
    });
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateWrapperTransforms);
  }, { passive: true });

  updateWrapperTransforms();
}

/* ================================================================
   MOTIONSITES HERO INTEGRATION CODE
   ================================================================ */
const lerp = (a, b, t) => a + (b - a) * t;

// ParticleSystem for WebGL 3D cosmic vortex
var ParticleSystem = (() => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || !window.THREE) return { updateColors: () => {} };

  let scene, camera, renderer;
  let particleSystem;
  const particlesCount = 450;
  const positions = new Float32Array(particlesCount * 3);
  const particleStates = [];
  
  let mouseX = 0, mouseY = 0;
  let targetCameraX = 0, targetCameraY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const colors = {
    dark: {
      nodes: [0x1db87a, 0xff9f43, 0xffffff, 0x0b2124],
    },
    light: {
      nodes: [0x0984e3, 0xe67e22, 0x0f172a, 0xa3bcf2],
    }
  };

  function createCircleTexture() {
    const size = 32;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(size/2, size/2, 2, size/2, size/2, 10);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, 10, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(tempCanvas);
  }

  function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 350;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const colorsArray = new Float32Array(particlesCount * 3);
    const isDark = document.documentElement.classList.contains('dark-theme');
    const initialTheme = isDark ? 'dark' : 'light';
    const palette = colors[initialTheme].nodes;

    for (let i = 0; i < particlesCount; i++) {
      const r = Math.pow(Math.random(), 1.5) * 220 + 20;
      const armOffset = (i % 3) * ((2 * Math.PI) / 3);
      const angle = r * 0.02 + armOffset;
      
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);
      const pz = (Math.random() - 0.5) * 80;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      particleStates.push({
        radius: r,
        angle: angle,
        z: pz,
        rotSpeed: 0.003 + (1.2 / r) * 0.08,
        driftSpeed: (Math.random() - 0.5) * 0.05
      });

      const col = new THREE.Color(palette[i % palette.length]);
      colorsArray[i * 3] = col.r;
      colorsArray[i * 3 + 1] = col.g;
      colorsArray[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
      size: 6,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    loop();
  }

  function updateThemeColors(theme) {
    if (!particleSystem) return;

    const palette = colors[theme].nodes;
    const colorsAttr = particleSystem.geometry.attributes.color.array;

    for (let i = 0; i < particlesCount; i++) {
      const targetColor = new THREE.Color(palette[i % palette.length]);
      if (window.gsap) {
        window.gsap.to(colorsAttr, {
          [i * 3]: targetColor.r,
          [i * 3 + 1]: targetColor.g,
          [i * 3 + 2]: targetColor.b,
          duration: 1.5,
          onUpdate: () => {
            particleSystem.geometry.attributes.color.needsUpdate = true;
          }
        });
      } else {
        colorsAttr[i * 3] = targetColor.r;
        colorsAttr[i * 3 + 1] = targetColor.g;
        colorsAttr[i * 3 + 2] = targetColor.b;
        particleSystem.geometry.attributes.color.needsUpdate = true;
      }
    }
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.035;
    mouseY = (event.clientY - windowHalfY) * 0.035;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function loop() {
    requestAnimationFrame(loop);

    const posAttr = particleSystem.geometry.attributes.position;
    const verts = posAttr.array;

    for (let i = 0; i < particlesCount; i++) {
      const state = particleStates[i];
      state.angle += state.rotSpeed;
      state.z += state.driftSpeed;
      if (Math.abs(state.z) > 100) state.driftSpeed *= -1;

      verts[i * 3] = state.radius * Math.cos(state.angle);
      verts[i * 3 + 1] = state.radius * Math.sin(state.angle);
      verts[i * 3 + 2] = state.z;
    }
    posAttr.needsUpdate = true;

    particleSystem.rotation.z += 0.0003;

    targetCameraX += (mouseX - targetCameraX) * 0.04;
    targetCameraY += (-mouseY - targetCameraY) * 0.04;
    camera.position.x = targetCameraX;
    camera.position.y = targetCameraY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  init();

  return { updateColors: updateThemeColors };
})();

// Tokenize HTML string into text/tag/word/space pieces
function tokenizeHTMLWords(html) {
  const tokens = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end !== -1) {
        tokens.push({ type: 'tag', value: html.slice(i, end + 1) });
        i = end + 1;
      } else {
        tokens.push({ type: 'text', value: html[i] });
        i++;
      }
    } else {
      const start = i;
      while (i < html.length && html[i] !== '<') i++;
      const textRun = html.slice(start, i);
      
      const wordMatches = textRun.match(/([^\s]+)|(\s+)/g);
      if (wordMatches) {
        wordMatches.forEach(match => {
          tokens.push({ type: 'word', value: match });
        });
      }
    }
  }
  return tokens;
}

// Typewriter reveal mechanism (typing word-by-word, concurrently)
function startTypewriter() {
  const paras = [...document.querySelectorAll('.tw-para')];
  if (!paras.length) return;

  const originals = paras.map(p => p.innerHTML);
  paras.forEach(p => { p.textContent = ''; });

  let completedCount = 0;

  function typeParagraph(idx) {
    const para = paras[idx];
    const original = originals[idx];
    const tokens = tokenizeHTMLWords(original);
    let tokenIdx = 0;
    let currentText = '';

    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    para.appendChild(cursor);

    const SPEED = 80; // ms per word token

    function typeNext() {
      if (tokenIdx >= tokens.length) {
        cursor.remove();
        completedCount++;
        if (completedCount === paras.length) {
          const tagline = document.getElementById('heroTagline');
          tagline && tagline.classList.add('show');
        }
        return;
      }

      const tok = tokens[tokenIdx];

      if (tok.type === 'tag') {
        currentText += tok.value;
        para.innerHTML = currentText;
        para.appendChild(cursor);
        tokenIdx++;
        typeNext();
      } else {
        currentText += tok.value;
        para.innerHTML = currentText;
        para.appendChild(cursor);
        tokenIdx++;
        setTimeout(typeNext, SPEED);
      }
    }

    typeNext();
  }

  // Start typing all paragraphs at the same time
  paras.forEach((_, idx) => typeParagraph(idx));
}

// Main Motionsites initialization function
function initHeroMotionsites() {
  // 1. Entrance reveals
  setTimeout(() => {
    const navbar = document.getElementById('navbar');
    navbar && navbar.classList.add('show');
  }, 150);

  setTimeout(() => {
    const h1Pre = document.getElementById('h1Pre');
    h1Pre && h1Pre.classList.add('show');
  }, 500);

  setTimeout(() => {
    const h1Main = document.getElementById('h1Main');
    h1Main && h1Main.classList.add('show');
  }, 680);

  setTimeout(() => {
    const twParas = document.querySelectorAll('.tw-para');
    twParas.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('show');
      }, idx * 180);
    });
    const tagline = document.getElementById('heroTagline');
    tagline && tagline.classList.add('show');
  }, 900);

  setTimeout(() => {
    const heroVisual = document.getElementById('heroVisual');
    heroVisual && heroVisual.classList.add('show');
  }, 600);

  setTimeout(() => {
    const heroBtns = document.getElementById('heroBtns');
    heroBtns && heroBtns.classList.add('show');
  }, 450);

  // 2. 3D Flip Card hover actions
  const card = document.getElementById('flipCard');
  if (card) {
    const scene = card.closest('.flip-scene');
    if (scene) {
      const pause = () => card.classList.add('paused');
      const play = () => card.classList.remove('paused');

      scene.addEventListener('mouseenter', pause);
      scene.addEventListener('mouseleave', play);
      scene.addEventListener('touchstart', pause, { passive: true });
      scene.addEventListener('touchend', () => {
        setTimeout(play, 1500);
      });
    }
  }

  // 3. Video Modal setup
  const modal = document.getElementById('modal');
  const bg = document.getElementById('modalBg');
  const closeBtn = document.getElementById('modalClose');
  const modalVideo = document.getElementById('modalVideo');
  const playBtn = document.getElementById('hudPlayBtn');
  const watchBtn = document.getElementById('ctaWatch');

  if (modal) {
    const openModal = () => {
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      modalVideo && modalVideo.play().catch(() => {});
    };

    const closeModal = () => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (modalVideo) { modalVideo.pause(); modalVideo.currentTime = 0; }
    };

    playBtn && playBtn.addEventListener('click', openModal);
    watchBtn && watchBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);
    bg && bg.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
    });
  }

  // 4. Parallax scroll effect
  const vis = document.getElementById('heroVisual');
  if (vis) {
    window.addEventListener('scroll', () => {
      vis.style.transform = `translateX(0) translateY(${window.scrollY * 0.06}px)`;
    }, { passive: true });
  }

  // 5. Button Ripple
  const registerBtn = document.getElementById('ctaRegister');
  if (registerBtn) {
    registerBtn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      const rect = registerBtn.getBoundingClientRect();
      const s = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = `
        position:absolute; border-radius:50%;
        width:${s}px; height:${s}px;
        left:${e.clientX - rect.left - s/2}px;
        top:${e.clientY - rect.top - s/2}px;
        background:rgba(255,255,255,0.25);
        transform:scale(0); pointer-events:none;
        animation:rpl 0.55s ease-out forwards;
      `;
      registerBtn.style.position = 'relative';
      registerBtn.style.overflow = 'hidden';
      registerBtn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });

    if (!document.getElementById('ripple-keyframes')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'ripple-keyframes';
      styleSheet.textContent = '@keyframes rpl { to { transform:scale(1); opacity:0; } }';
      document.head.appendChild(styleSheet);
    }
  }

  // 6. Flip back face image lazy loader / fallback check
  const backEl = document.getElementById('backImg');
  if (backEl) {
    const localSrc = 'hero-back.png';
    const fallback = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80&auto=format';
    const img = new Image();
    img.onload = () => {
      backEl.style.backgroundImage = `url('${localSrc}')`;
      backEl.style.filter = 'brightness(0.42) saturate(0.9)';
    };
    img.onerror = () => {
      backEl.style.backgroundImage = `url('${fallback}')`;
    };
    img.src = localSrc;
  }

  // 7. Theme change visual updates listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        const isDark = document.documentElement.classList.contains('dark-theme');
        if (typeof ParticleSystem !== 'undefined' && ParticleSystem.updateColors) {
          ParticleSystem.updateColors(isDark ? 'dark' : 'light');
        }
      }, 50);
    });
  }
}





