(() => {
  const navList = document.getElementById('navList');
  const blob = document.getElementById('liquidBlob');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const sections = Array.from(document.querySelectorAll('main section'));
  const themeToggle = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  const mailBtn = document.getElementById('mailMe');
  const contactForm = document.getElementById('contactForm');
  const burger = document.getElementById('burger');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme handling
  function applyTheme(theme){
    if(theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    themeToggle.textContent = theme === 'light' ? '️🌙' : '🔆️';
  }
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  applyTheme(saved);
  themeToggle?.addEventListener('click', ()=>{
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // Mobile menu
  burger?.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      navList.style.display = 'flex';
      navList.style.flexDirection = 'column';
    } else {
      navList.style.display = '';
      navList.style.flexDirection = '';
    }
  });

  // Liquid blob move function
  function moveBlobTo(el){
    if(!el || window.innerWidth < 980) {
      blob && (blob.style.transform = 'translateX(-9999px)'); // hide on small
      return;
    }
    const rect = el.getBoundingClientRect();
    const navRect = el.closest('.nav').getBoundingClientRect();
    const left = rect.left - navRect.left;
    const width = rect.width;
    blob.style.width = (width + 10) + 'px';
    blob.style.transform = `translateX(${left}px) translateY(${(rect.top - navRect.top)}px)`;
  }

  // Initialize blob to first visible nav item
  const activeNav = navItems[0];
  moveBlobTo(activeNav);

  // Update on hover and focus
  navItems.forEach(item=>{
    item.addEventListener('mouseenter', ()=> moveBlobTo(item));
    item.addEventListener('focusin', ()=> moveBlobTo(item));
    item.addEventListener('click', (e)=>{
      const target = item.dataset.target;
      if(target){
        e.preventDefault();
        document.getElementById(target)?.scrollIntoView({behavior:'smooth', block: 'start'});
        setActiveNav(item);
      }
      if(window.innerWidth < 981){
        burger?.click();
      }
    });
  });

  // Reset blob on mouse leave
  document.querySelector('.nav')?.addEventListener('mouseleave', ()=> {
    const current = navItems.find(n => n.classList.contains('active')) || navItems[0];
    moveBlobTo(current);
  });

  // Set active nav item
  function setActiveNav(item){
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    moveBlobTo(item);
  }

  // Sync active nav with scroll
  const sectionObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        const item = navItems.find(i => i.dataset.target === id);
        if(item) setActiveNav(item);
      }
    });
  }, {rootMargin: "-30% 0px -60% 0px", threshold: 0.01});
  sections.forEach(sec => sectionObserver.observe(sec));

  // Scroll animation system
  const animEls = Array.from(document.querySelectorAll('[data-anim]'));
  const animObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      const el = entry.target;
      if(entry.isIntersecting){
        // stagger support
        const parentStagger = el.closest('[data-stagger="true"]');
        let delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        if(parentStagger && !el.__staggered){
          const siblings = Array.from(parentStagger.querySelectorAll(':scope > *'));
          const idx = siblings.indexOf(el);
          delay = delay + idx * 60;
          el.__staggered = true;
        }
        el.style.transitionDelay = (delay/1000)+'s';
        el.classList.add('in-view');
        animObserver.unobserve(el);
      }
    });
  }, {rootMargin:"0px 0px -10% 0px", threshold: 0.15});
  animEls.forEach(el => animObserver.observe(el));

  // Form helpers
  mailBtn?.addEventListener('click', () => {
    const subject = encodeURIComponent("Let's build something");
    const body = encodeURIComponent("Hi Bhupesh,%0D%0A%0D%0AProject details:%0D%0A• Timeline:%0D%0A• Budget:%0D%0A%0D%0AThanks!");
    window.location.href = `mailto:hello@bbhatt.com.np?subject=${subject}&body=${body}`;
  });

  contactForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Message queued. Replace this with real form submission.');
    contactForm.reset();
  });

  // Handle resize for blob
  window.addEventListener('resize', () => {
    const current = navItems.find(n => n.classList.contains('active')) || navItems[0];
    moveBlobTo(current);
  });
})();