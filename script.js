/* =====================================================
   BHAVESH SONAWANE – PORTFOLIO JAVASCRIPT
   Scroll animations · Typewriter · Nav · Form · Rich Animations
   ===================================================== */

'use strict';

// ── Respect prefers-reduced-motion ──────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════
   1. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════ */
const progressBar = document.getElementById('scrollProgress');
function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ═══════════════════════════════════════════════════
   2. NAVBAR – scroll class + hamburger
═══════════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function handleNavScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

/* ═══════════════════════════════════════════════════
   3. ACTIVE NAV LINK on scroll (section spy)
═══════════════════════════════════════════════════ */
const sections   = Array.from(document.querySelectorAll('section[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-link'));

function updateActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight * 0.35;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ═══════════════════════════════════════════════════
   4. SMOOTH SCROLL
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 0;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});

/* ═══════════════════════════════════════════════════
   5. INTERSECTION OBSERVER — fade-in animations
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('is-visible');
        el.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
      }, delay);
      animateObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-block').forEach(b => skillObserver.observe(b));

} else {
  document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
  document.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
}

/* ═══════════════════════════════════════════════════
   6. TYPEWRITER EFFECT
═══════════════════════════════════════════════════ */
const typeEl  = document.getElementById('typewriter');
const phrases = [
  'AI & DS Student',
  'Web Developer',
  'Problem Solver',
  'Tech Enthusiast',
  'Future AI Engineer'
];
let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;

function typewrite() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
  } else {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
  }
  let speed = isDeleting ? 55 : 95;
  if (!isDeleting && charIdx === current.length) {
    speed = 1800; isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx  = (phraseIdx + 1) % phrases.length;
    speed = 380;
  }
  setTimeout(typewrite, prefersReducedMotion ? 0 : speed);
}
setTimeout(typewrite, 800);

/* ═══════════════════════════════════════════════════
   7. HERO IMAGE – mouse parallax on float badges
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const heroSection = document.querySelector('.hero');
  const floatBadges = document.querySelectorAll('.float-badge');
  if (heroSection && floatBadges.length) {
    heroSection.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth  - 0.5) * 14;
      const my = (e.clientY / window.innerHeight - 0.5) * 14;
      floatBadges.forEach((badge, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        badge.style.transform = `translate(${mx * sign * 0.35}px, ${my * sign * 0.35}px)`;
      });
    }, { passive: true });
    heroSection.addEventListener('mouseleave', () => {
      floatBadges.forEach(b => { b.style.transform = ''; });
    });
  }
}

/* ═══════════════════════════════════════════════════
   8. CONTACT FORM (simulated)
═══════════════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn      = document.getElementById('submitBtn');
  const btnText  = document.getElementById('btnText');
  const feedback = document.getElementById('formFeedback');
  const form     = e.target;
  if (!btn || !btnText || !feedback) return;
  const email   = form.email.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    feedback.className = 'form-feedback error';
    feedback.textContent = '⚠ Please enter a valid email address.';
    return;
  }
  btn.disabled = true;
  btnText.textContent = 'Sending…';
  feedback.className  = 'form-feedback';
  feedback.textContent = '';
  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    feedback.className  = 'form-feedback success';
    feedback.textContent = '✅ Message sent! Bhavesh will reply soon.';
    form.reset();
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
  }, 1600);
}
window.handleFormSubmit = handleFormSubmit;

/* ═══════════════════════════════════════════════════
   9. CodeChef link verify
═══════════════════════════════════════════════════ */
const codechefLink = document.querySelector('[aria-label="CodeChef Profile"]');
if (codechefLink) console.log('✅ CodeChef icon found. URL:', codechefLink.href);

/* ═══════════════════════════════════════════════════
   10. TIMELINE ITEM hover — lift dot
═══════════════════════════════════════════════════ */
document.querySelectorAll('.timeline-item').forEach(item => {
  const dot = item.querySelector('.tl-dot');
  if (!dot) return;
  item.addEventListener('mouseenter', () => {
    if (!dot.classList.contains('tl-dot--active')) {
      dot.style.borderColor = 'var(--navy)';
      dot.style.color = 'var(--navy)';
    }
  });
  item.addEventListener('mouseleave', () => {
    if (!dot.classList.contains('tl-dot--active')) {
      dot.style.borderColor = '';
      dot.style.color = '';
    }
  });
});

/* ═══════════════════════════════════════════════════
   11. PARTICLE CANVAS BACKGROUND
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:0', 'opacity:0.5'
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const COUNT = Math.min(65, Math.floor(W * H / 18000));
  const pts   = [];

  function mkPt() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      a: Math.random() * 0.5 + 0.15
    };
  }
  for (let i = 0; i < COUNT; i++) pts.push(mkPt());

  function animPts() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(52,211,153,${p.a})`;
      ctx.fill();
    });
    const MD = 130;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MD) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(16,185,129,${(1 - d/MD) * 0.17})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animPts);
  }
  animPts();
}

/* ═══════════════════════════════════════════════════
   12. GLOWING CURSOR
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion && window.innerWidth > 768) {
  const cur = document.createElement('div');
  cur.style.cssText = [
    'position:fixed', 'width:14px', 'height:14px', 'border-radius:50%',
    'pointer-events:none', 'z-index:99999',
    'background:radial-gradient(circle,rgba(52,211,153,.85),rgba(16,185,129,.2))',
    'box-shadow:0 0 16px 4px rgba(52,211,153,.4)',
    'transform:translate(-50%,-50%)',
    'transition:transform .08s ease',
    'mix-blend-mode:screen'
  ].join(';');
  document.body.appendChild(cur);

  const curO = document.createElement('div');
  curO.style.cssText = [
    'position:fixed', 'width:36px', 'height:36px', 'border-radius:50%',
    'pointer-events:none', 'z-index:99998',
    'border:1.5px solid rgba(52,211,153,.3)',
    'transform:translate(-50%,-50%)',
    'transition:transform .18s ease,border-color .2s ease'
  ].join(';');
  document.body.appendChild(curO);

  document.addEventListener('mousemove', e => {
    cur.style.left = curO.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
    setTimeout(() => { curO.style.top = e.clientY + 'px'; }, 80);
  });

  document.querySelectorAll('a,button,.project-card,.stat-chip,.soft-tag,.hobby-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.transform  = 'translate(-50%,-50%) scale(1.8)';
      curO.style.transform = 'translate(-50%,-50%) scale(1.5)';
      curO.style.borderColor = 'rgba(52,211,153,.6)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.transform  = 'translate(-50%,-50%) scale(1)';
      curO.style.transform = 'translate(-50%,-50%) scale(1)';
      curO.style.borderColor = 'rgba(52,211,153,.3)';
    });
  });
}

/* ═══════════════════════════════════════════════════
   13. ANIMATED STAT COUNTERS
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-chip strong').forEach(chip => {
        const txt   = chip.textContent.trim();
        const match = txt.match(/^(\d+\.?\d*)(.*)/);
        if (!match) return;
        const target  = parseFloat(match[1]);
        const suffix  = match[2] || '';
        const decimal = match[1].includes('.') ? 2 : 0;
        const t0 = performance.now();
        const dur = 1400;
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          chip.textContent = (target * e).toFixed(decimal) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
      statObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.about-stats').forEach(el => statObs.observe(el));
}

/* ═══════════════════════════════════════════════════
   14. 3D TILT on Project Cards
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion && window.innerWidth > 768) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateX(${dy * -7}deg) rotateY(${dx * 7}deg) translateY(-6px)`;
      card.style.boxShadow = `${-dx * 14}px ${dy * 14}px 32px rgba(16,185,129,.25),0 20px 50px rgba(0,0,0,.5)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.boxShadow = ''; });
  });
}

/* ═══════════════════════════════════════════════════
   15. RIPPLE on Buttons
═══════════════════════════════════════════════════ */
document.querySelectorAll('.btn-primary,.btn-secondary,.btn-outline').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', function(e) {
    const r    = this.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const rpl  = document.createElement('span');
    rpl.style.cssText = [
      'position:absolute', `width:${size}px`, `height:${size}px`, 'border-radius:50%',
      'background:rgba(255,255,255,.22)',
      `left:${e.clientX - r.left - size/2}px`,
      `top:${e.clientY  - r.top  - size/2}px`,
      'transform:scale(0)',
      'animation:rippleAnim .55s ease-out forwards',
      'pointer-events:none'
    ].join(';');
    this.appendChild(rpl);
    setTimeout(() => rpl.remove(), 600);
  });
});

/* ═══════════════════════════════════════════════════
   16. SECTION EYEBROW SHIMMER on enter
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const eObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('shimmer-active'); eObs.unobserve(en.target); }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.section-eyebrow').forEach(el => eObs.observe(el));
}

/* ═══════════════════════════════════════════════════
   17. STAGGERED SKILL ROWS
═══════════════════════════════════════════════════ */
if (!prefersReducedMotion) {
  document.querySelectorAll('.skill-row').forEach((row, i) => {
    row.style.cssText += `opacity:0;transform:translateX(-20px);transition:opacity .5s ease ${i*80}ms,transform .5s ease ${i*80}ms`;
  });
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.querySelectorAll('.skill-row').forEach(r => { r.style.opacity='1'; r.style.transform='translateX(0)'; });
        sObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.skill-block').forEach(b => sObs.observe(b));
}

/* ═══════════════════════════════════════════════════
   18. SPARK BURST on hero badge click
═══════════════════════════════════════════════════ */
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge && !prefersReducedMotion) {
  heroBadge.style.cursor = 'pointer';
  heroBadge.addEventListener('click', () => {
    const br = heroBadge.getBoundingClientRect();
    const cx = br.left + br.width / 2;
    const cy = br.top  + br.height / 2;
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const dist  = 55 + Math.random() * 45;
      const sp    = document.createElement('span');
      const colors = ['#34d399','#10b981','#6ee7b7','#a7f3d0'];
      sp.style.cssText = [
        'position:fixed', `width:${4+Math.random()*4}px`, `height:${4+Math.random()*4}px`,
        'border-radius:50%', `background:${colors[i%colors.length]}`,
        'pointer-events:none', 'z-index:9999',
        `left:${cx}px`, `top:${cy}px`,
        'transform:translate(-50%,-50%)',
        'animation:sparkFly .75s ease-out forwards',
        `--tx:${Math.cos(angle)*dist}px`, `--ty:${Math.sin(angle)*dist}px`
      ].join(';');
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 800);
    }
  });
}

/* ═══════════════════════════════════════════════════
   19. INJECT ALL EXTRA CSS
═══════════════════════════════════════════════════ */
const extraCSS = document.createElement('style');
extraCSS.textContent = `
  @keyframes rippleAnim { to { transform:scale(1); opacity:0; } }
  @keyframes sparkFly   { to { transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))); opacity:0; } }

  /* Section eyebrow shimmer */
  .section-eyebrow {
    background: linear-gradient(90deg,#10b981 0%,#34d399 40%,#10b981 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .section-eyebrow.shimmer-active { animation: shimmerTxt 1.8s linear 1; }
  @keyframes shimmerTxt { 0%{background-position:200% center} 100%{background-position:0% center} }

  /* Featured card border pulse */
  .project-card--featured { animation: borderPulse 3s ease-in-out infinite; }
  @keyframes borderPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0),0 4px 20px rgba(0,0,0,.4)}
    50%    {box-shadow:0 0 22px 5px rgba(16,185,129,.18),0 4px 20px rgba(0,0,0,.4)}
  }

  /* Active timeline dot glow */
  .tl-dot--active { animation: dotGlow 2.5s ease-in-out infinite; }
  @keyframes dotGlow {
    0%,100%{box-shadow:0 0 0 4px rgba(16,185,129,.15)}
    50%    {box-shadow:0 0 0 8px rgba(16,185,129,.06),0 0 22px rgba(16,185,129,.3)}
  }

  /* Hero name glow pulse */
  .hero-name-accent { animation: nameGlow 3s ease-in-out infinite; }
  @keyframes nameGlow {
    0%,100%{text-shadow:0 0 20px rgba(52,211,153,.3)}
    50%    {text-shadow:0 0 50px rgba(52,211,153,.65),0 0 90px rgba(16,185,129,.2)}
  }

  /* Social icon wiggle on hover */
  .social-icon:hover svg { animation: iconWiggle .4s ease; }
  @keyframes iconWiggle {
    0%  {transform:rotate(0) scale(1)}
    30% {transform:rotate(-15deg) scale(1.2)}
    60% {transform:rotate(10deg) scale(1.1)}
    100%{transform:rotate(0) scale(1)}
  }

  /* Soft tag bounce */
  .soft-tag:hover { animation: tagBounce .3s ease; }
  @keyframes tagBounce {
    0%  {transform:translateY(-2px) scale(1)}
    50% {transform:translateY(-7px) scale(1.05)}
    100%{transform:translateY(-2px) scale(1)}
  }

  /* Badge pulse upgrade */
  .badge-pulse { animation: badgePulse2 2s ease-in-out infinite !important; }
  @keyframes badgePulse2 {
    0%  {box-shadow:0 0 0 0 rgba(16,185,129,.7)}
    70% {box-shadow:0 0 0 9px rgba(16,185,129,0)}
    100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}
  }

  /* Scroll progress glow */
  .scroll-progress { box-shadow:0 0 10px rgba(52,211,153,.55),0 0 20px rgba(16,185,129,.25); }

  /* Photo ring glow */
  .photo-ring-outer { border-color:rgba(52,211,153,.22)!important; box-shadow:0 0 35px rgba(16,185,129,.1); }
  .photo-ring-inner { border-color:rgba(52,211,153,.14)!important; }

  /* Stat counter hover glow */
  .stat-chip:hover strong { text-shadow:0 0 22px rgba(52,211,153,.7); }

  /* Form focus glow */
  .form-group input:focus,
  .form-group textarea:focus { animation: inputPop .3s ease forwards; }
  @keyframes inputPop {
    from{box-shadow:0 0 0 0 rgba(16,185,129,0)}
    to  {box-shadow:0 0 0 3px rgba(16,185,129,.15),0 0 14px rgba(16,185,129,.1)}
  }

  /* Hobby icon bounce */
  .hobby-item:hover .hobby-icon { display:inline-block; animation:hobbyPop .4s ease; }
  @keyframes hobbyPop {
    0%,100%{transform:scale(1) rotate(0)}
    50%    {transform:scale(1.45) rotate(12deg)}
  }

  /* Hero badge glow on hover */
  .hero-badge:hover { box-shadow:0 0 30px rgba(16,185,129,.4); transition: box-shadow .3s ease; }

  /* Tech tag shimmer on hover */
  .tech-tag:hover { transform:translateY(-2px) scale(1.06); }

  /* Contact card icon pulse */
  .contact-link-card:hover .clc-icon { transform:scale(1.12); transition:transform .2s ease; }

  /* Tl-card active left border glow */
  .tl-card--active { box-shadow:inset -3px 0 0 0 rgba(0,0,0,0), -4px 0 12px rgba(16,185,129,.15); }
`;
document.head.appendChild(extraCSS);

console.log('🚀 Bhavesh Sonawane Portfolio — Loaded successfully! ✨');
