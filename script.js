// Small interactive scripts:
// - Mobile nav toggle
// - Scroll progress + active nav highlighting
// - Theme toggle with persistence
// - Smooth scrolling
// - Contact form (Formspree AJAX)
// - Timeline expand/collapse
// - Animations, parallax, particles, video modal

document.addEventListener('DOMContentLoaded', () => {

  /* ======================================================
     MOBILE NAV TOGGLE
     ====================================================== */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  // Toggle mobile navigation visibility
  toggle?.addEventListener('click', () =>
    nav.classList.toggle('show')
  );


  /* ======================================================
     SCROLL PROGRESS BAR + ACTIVE NAV LINK
     ====================================================== */
  const progress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;

    // Update horizontal progress indicator
    progress.style.width = `${(scrolled / height) * 100}%`;

    // Highlight active nav link based on scroll position
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;

      if (scrolled >= top && scrolled < bottom) {
        navLinks.forEach(a => a.classList.remove('active'));
        document
          .querySelector(`.site-nav a[href="#${sec.id}"]`)
          ?.classList.add('active');
      }
    });
  });


  /* ======================================================
     THEME TOGGLE (DARK / LIGHT) WITH PERSISTENCE
     ====================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Apply theme by toggling a data attribute on <html>
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  };

  // Load stored theme or fall back to system preference
  const storedTheme =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current =
        root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';

      applyTheme(next);
      localStorage.setItem('theme', next);

      // Update toggle icon
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });

    // Set initial icon state
    themeToggle.textContent =
      root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }


  /* ======================================================
     FOOTER YEAR (AUTO-UPDATED)
     ====================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ======================================================
     SMOOTH SCROLLING FOR INTERNAL LINKS
     ====================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile nav after navigation
        if (nav.classList.contains('show')) {
          nav.classList.remove('show');
        }
      }
    });
  });


  /* ======================================================
     CONTACT FORM — FORMSPREE (AJAX SUBMIT)
     ====================================================== */
  const form = document.getElementById('contactForm');

  if (form) {
    const statusEl = document.getElementById('formStatus');
    const msgEl = statusEl?.querySelector('.form-status-message');
    const closeBtn = statusEl?.querySelector('.form-status-close');

    // Display success/error status message
    const showStatus = (msg, type = 'success', autoHide = false) => {
      if (!statusEl || !msgEl) {
        alert(msg);
        return;
      }

      msgEl.textContent = msg;
      statusEl.classList.remove('hidden', 'success', 'error', 'show');
      statusEl.classList.add(type);

      statusEl.classList.remove('hidden');
      void statusEl.offsetWidth; // force reflow for animation
      statusEl.classList.add('show');

      // Accessibility: focus + scroll message into view
      statusEl.focus({ preventScroll: true });
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (autoHide) {
        setTimeout(hideStatus, 6000);
      }
    };

    // Hide status message
    const hideStatus = () => {
      if (!statusEl) return;
      statusEl.classList.remove('show');
      setTimeout(() => statusEl.classList.add('hidden'), 320);
    };

    closeBtn?.addEventListener('click', hideStatus);

    // Intercept form submit and send via fetch
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const action = form.getAttribute('action');
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          form.reset();
          showStatus('Message sent — thank you! I will reply soon.', 'success');
        } else {
          const json = await res.json().catch(() => null);
          const err = json?.error || 'Submission failed';
          showStatus(
            `Error: ${err}. Please email directly to lybamughees@gmail.com`,
            'error'
          );
        }
      } catch {
        showStatus(
          'Network error. Please try again or email lybamughees@gmail.com',
          'error'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }


  /* ======================================================
     COLLAPSIBLE TIMELINE ITEMS
     ====================================================== */
  document.querySelectorAll('.toggle-details').forEach(btn => {
    const item = btn.closest('.timeline-item');
    const extra = item?.querySelector('.extra-details');

    btn.addEventListener('click', () => {
      if (!extra) return;

      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      extra.classList.toggle('hidden');

      if (!expanded) {
        extra.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });


  /* ======================================================
     CARD ENTRANCE ANIMATIONS (INTERSECTION OBSERVER)
     ====================================================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card').forEach(card =>
    observer.observe(card)
  );


  /* ======================================================
     VIDEO MODAL (PROJECT DEMO)
     ====================================================== */
  const openBtn = document.getElementById('openVideo');
  const closeBtn = document.getElementById('closeVideo');
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const videoSrc = iframe?.getAttribute('src');

  const openModal = e => {
    e?.preventDefault();
    modal?.classList.remove('hidden');
    modal?.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden', 'true');
    if (iframe && videoSrc) iframe.setAttribute('src', videoSrc);
  };

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => e.target === modal && closeModal());
  document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());


  /* ======================================================
     3D TILT EFFECT FOR PROJECT CARDS
     ====================================================== */
  document.querySelectorAll('.project-card').forEach(card => {
    const shine = document.createElement('div');
    shine.className = 'shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);

      card.style.transform =
        `perspective(900px) rotateX(${dy * 6}deg) rotateY(${-dx * 6}deg) scale(1.02)`;

      shine.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      shine.style.background = 'none';
    });
  });


  /* ======================================================
     PARALLAX SCROLL EFFECT
     ====================================================== */
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  const handleParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    parallaxElements.forEach(el => {
      const depth = parseFloat(el.dataset.parallax) || 0.02;
      el.style.transform = `translate3d(0, ${-scrollY * depth}px, 0)`;
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();


  /* ======================================================
     PARTICLE / CONSTELLATION CANVAS (HERO BACKGROUND)
     ====================================================== */
  (function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    const mouse = { x: -9999, y: -9999 };
    const DPR = window.devicePixelRatio || 1;

    const config = {
      count: 60,
      maxRadius: 1.8,
      speed: 0.4,
      connectDist: 90
    };

    function resize() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
    }

    function init() {
      particles = Array.from({ length: config.count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        r: Math.random() * config.maxRadius + 0.2
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw particles
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);

          if (d < config.connectDist) {
            ctx.strokeStyle =
              `rgba(255,255,255,${(1 - d / config.connectDist) * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function step() {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      });

      draw();
      requestAnimationFrame(step);
    }

    window.addEventListener('resize', () => {
      resize();
      init();
    });

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = mouse.y = -9999;
    });

    resize();
    init();
    step();
  })();

});
