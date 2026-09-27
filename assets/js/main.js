/* ==========================================================================
   Pratik Ranvir — Portfolio
   main.js: nav + mobile menu, smooth scroll, particle/grid background,
   project filtering, PDF modal + download with existence checks, reveal-on-scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initMobileMenu();
  initActiveNav();
  initParticleBackground();
  initProjectFilters();
  initPdfModal();
  initReveal();
});

/* ---------- Footer year ---------- */
function setYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu(){
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  const open = () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------- Active nav link on scroll ---------- */
function initActiveNav(){
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------- Particle / neural grid background ---------- */
function initParticleBackground(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, nodes, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.4 + 0.8) * dpr
    }));
  }

  function step(){
    ctx.clearRect(0, 0, w, h);
    const linkDist = 130 * dpr;

    // update + draw nodes
    nodes.forEach(n => {
      if (!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.fill();
    });

    // draw connections
    for (let i = 0; i < nodes.length; i++){
      for (let j = i + 1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist){
          const alpha = (1 - dist / linkDist) * 0.18;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  step();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reduceMotion) step();
    }, 200);
  });
}

/* ---------- Project filtering ---------- */
function initProjectFilters(){
  const filterRow = document.getElementById('project-filters');
  const cards = document.querySelectorAll('.project-card');
  const emptyMsg = document.getElementById('filter-empty');
  if (!filterRow || !cards.length) return;

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
      if (match) visibleCount++;
    });

    if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
  });
}

/* ---------- PDF modal, view/download with existence check ---------- */
function initPdfModal(){
  const modal = document.getElementById('pdf-modal');
  const frame = document.getElementById('pdf-modal-frame');
  const titleEl = document.getElementById('pdf-modal-title');
  const downloadLink = document.getElementById('pdf-modal-download');
  if (!modal || !frame) return;

  function openModal(path, title){
    titleEl.textContent = title || 'Certificate';
    frame.src = path;
    downloadLink.href = path;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.hidden = true;
    frame.src = '';
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // "View PDF" buttons on certificate cards
  document.querySelectorAll('.cert-view').forEach(btn => {
    btn.addEventListener('click', async () => {
      const path = btn.dataset.pdf;
      const title = btn.dataset.title;
      const exists = await fileExists(path);
      if (exists){
        openModal(path, title);
      } else {
        showToast(`"${title}" isn't uploaded yet — check back soon, or reach out directly for a copy.`);
      }
    });
  });

  // "Download" links on certificate cards — verify before navigating
  document.querySelectorAll('.cert-download').forEach(link => {
    link.addEventListener('click', async (e) => {
      const path = link.dataset.pdf;
      const exists = await fileExists(path);
      if (!exists){
        e.preventDefault();
        showToast('This certificate PDF isn\'t uploaded yet — check back soon.');
      }
    });
  });

  // Resume button in the hero
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn){
    resumeBtn.addEventListener('click', async () => {
      const path = resumeBtn.dataset.pdf;
      const exists = await fileExists(path);
      if (exists){
        window.open(path, '_blank', 'noopener');
      } else {
        showToast('Resume is being updated — please check back soon, or reach out directly.');
      }
    });
  }
}

/* Checks whether a local file exists via a HEAD request.
   Falls back to "assume missing" on any network/CORS error, which is the
   safe default for a static, no-JS-build GitHub Pages deployment. */
async function fileExists(path){
  try {
    const res = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message){
  const toast = document.getElementById('toast');
  if (!toast) { alert(message); return; }

  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('show'));

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 4200);
}

/* ---------- Reveal-on-scroll ---------- */
function initReveal(){
  const targets = document.querySelectorAll('.glass-card, .project-card');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  targets.forEach(t => t.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
}
