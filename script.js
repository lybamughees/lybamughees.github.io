// Small interactive scripts: nav toggle, year, smooth scroll, form handler
document.addEventListener('DOMContentLoaded',()=>{
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  toggle?.addEventListener('click',()=>nav.classList.toggle('show'));

  // Theme toggle (persist preference)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const applyTheme = (t)=>{ if(t==='dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme'); };
  const stored = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(stored);
  if(themeToggle){
    themeToggle.addEventListener('click',()=>{
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme',next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
    // set initial icon
    themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }

  // Set current year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close nav on mobile
        if(nav.classList.contains('show')) nav.classList.remove('show');
      }
    });
  });

  // Contact form — Formspree integration (AJAX)
  // Replace YOUR_FORMSPREE_ID in the form action with your actual Formspree ID if you haven't already.
  const form = document.getElementById('contactForm');
  if(form){
    const statusEl = document.getElementById('formStatus');
    const msgEl = statusEl?.querySelector('.form-status-message');
    const closeBtn = statusEl?.querySelector('.form-status-close');
    const showStatus = (msg, type='success', autoHide=false)=>{
      if(!statusEl || !msgEl){ alert(msg); return; }
      msgEl.textContent = msg;
      statusEl.classList.remove('hidden','success','error','show');
      statusEl.classList.add(type);
      // show then animate
      statusEl.classList.remove('hidden');
      // force reflow then add show to trigger transition
      void statusEl.offsetWidth;
      statusEl.classList.add('show');
      // focus and scroll into view for visibility
      statusEl.focus({preventScroll:true});
      statusEl.scrollIntoView({behavior:'smooth',block:'center'});
      if(autoHide){ setTimeout(()=>{ hideStatus(); }, 6000); }
    };
    const hideStatus = ()=>{
      if(!statusEl) return;
      statusEl.classList.remove('show');
      setTimeout(()=>{ statusEl.classList.add('hidden'); }, 320);
    };
    closeBtn?.addEventListener('click', hideStatus);

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const action = form.getAttribute('action') || 'https://formspree.io/f/YOUR_FORMSPREE_ID';
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : null;
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      try{
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          form.reset();
          showStatus('Message sent — thank you! I will reply soon.', 'success', false);
        } else {
          const json = await res.json().catch(()=>null);
          const err = (json && json.error) ? json.error : 'Submission failed';
          showStatus('Error: ' + err + '. Please email directly to lybamughees@gmail.com', 'error', false);
        }
      }catch(err){
        showStatus('Network error. Please try again or email lybamughees@gmail.com', 'error', false);
      } finally {
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      }
    });
  }

  // Collapsible timeline items: attach to existing .toggle-details buttons
  document.querySelectorAll('.toggle-details').forEach(btn=>{
    const item = btn.closest('.timeline-item');
    const extra = item?.querySelector('.extra-details');
    btn.addEventListener('click', ()=>{
      if(!extra) return;
      const opened = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!opened));
      extra.classList.toggle('hidden');
      if(!opened) extra.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

  // Entrance animations for cards (simple reveal)
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('in-view');
    });
  },{threshold:0.12});
  document.querySelectorAll('.card').forEach(c=>io.observe(c));

  // Video modal open/close
  const openBtn = document.getElementById('openVideo');
  const closeBtn = document.getElementById('closeVideo');
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const videoSrc = iframe?.getAttribute('src');
  const openModal = (e) => {
    e?.preventDefault();
    if(modal){ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }
  };
  const closeModal = ()=>{
    if(modal){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
    if(iframe && videoSrc) iframe.setAttribute('src', videoSrc); // keep src
  };
  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  // close on overlay click
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  // close on Esc
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  /* ---------- 3D tilt for project cards ---------- */
  document.querySelectorAll('.project-card').forEach(card=>{
    const shine = document.createElement('div'); shine.className = 'shine'; card.appendChild(shine);
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const cx = rect.width/2; const cy = rect.height/2;
      const dx = (x - cx) / cx; const dy = (y - cy) / cy;
      const tiltX = (dy * 6).toFixed(2); const tiltY = (dx * -6).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      // shine position
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
      shine.style.background = 'none';
    });
  });

  /* ---------- Parallax on scroll for elements with data-parallax ---------- */
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const handleParallax = ()=>{
    const scrollY = window.scrollY || window.pageYOffset;
    parallaxElements.forEach(el=>{
      const depth = parseFloat(el.getAttribute('data-parallax')) || 0.02;
      const offset = -scrollY * depth;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };
  window.addEventListener('scroll', handleParallax, {passive:true});
  handleParallax();

  /* ---------- Lightweight particle / constellation canvas ---------- */
  (function(){
    const canvas = document.getElementById('particleCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = {x:-9999,y:-9999};
    const DPR = window.devicePixelRatio || 1;
    const config = {count: 60, maxRadius:1.8, speed:0.4, connectDist:90};
    function resize(){ W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR); canvas.style.width = W+'px'; canvas.style.height = H+'px'; ctx.scale(DPR,DPR); }
    function init(){ particles = []; for(let i=0;i<config.count;i++){ particles.push({x:Math.random()*W,y:Math.random()*H, vx:(Math.random()-0.5)*config.speed, vy:(Math.random()-0.5)*config.speed, r:Math.random()*config.maxRadius+0.2}); } }
    function draw(){ ctx.clearRect(0,0,W,H); ctx.fillStyle = 'rgba(255,255,255,0.06)'; for(let p of particles){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
      // connect
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j]; const dx = a.x-b.x, dy=a.y-b.y; const d = Math.hypot(dx,dy);
          if(d < config.connectDist){ ctx.strokeStyle = `rgba(255,255,255,${(1 - d/config.connectDist) * 0.08})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
        }
        // mouse attraction
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y; const md = Math.hypot(mdx,mdy);
        if(md < 120){ a.vx += ( (mouse.x - a.x) * 0.0008 ); a.vy += ( (mouse.y - a.y) * 0.0008 ); }
      }
    }
    function step(){ for(let p of particles){ p.x += p.vx; p.y += p.vy; if(p.x < -10) p.x = W+10; if(p.x > W+10) p.x = -10; if(p.y < -10) p.y = H+10; if(p.y > H+10) p.y = -10; }
      draw(); requestAnimationFrame(step);
    }
    function attach(){ window.addEventListener('resize', ()=>{ resize(); init(); }); canvas.addEventListener('mousemove',(e)=>{ const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }); canvas.addEventListener('mouseleave', ()=>{ mouse.x = -9999; mouse.y = -9999; }); }
    resize(); init(); attach(); step();
  })();

  // end DOMContentLoaded
});
