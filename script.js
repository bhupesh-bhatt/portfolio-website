() => {
  const navList = document.getElementById('navList');
  const blob = document.getElementById('liquidBlob');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const sections = Array.from(document.querySelectorAll('main section'));
  const themeToggle = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  const mailBtn = document.getElementById('mailMe');
  const contactForm = document.getElementById('contactForm');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme handling
  function applyTheme(theme){
    if(theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    themeToggle.textContent = theme === 'light' ? '🌞' : '🌙';
  }
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  applyTheme(saved);
  themeToggle?.addEventListener('click', ()=>{
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // Liquid blob move function
  function moveBlobTo(el){
    if(!el || window.innerWidth < 900) return blob.style.transform = 'translateX(-9999px)'; // hide on small
    const rect = el.getBoundingClientRect();
    const navRect = el.closest('.nav').getBoundingClientRect();
    const left = rect.left - navRect.left;
    const width = rect.width;
    blob.style.width = (width + 8) + 'px';
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
      // smooth scroll
      const target = item.dataset.target;
      if(target){
        e.preventDefault();
        document.getElementById(target)?.scrollIntoView({behavior:'smooth', block: 'start'});
        setActiveNav(item);
      }
    });
  });

  // Reset blob on mouse leave
  document.querySelector('.nav')?.addEventListener('mouseleave', ()=> {
    // find active based on scroll
    const current = navItems.find(n => n.classList.contains('active')) || navItems[0];
    moveBlobTo(current);
  });

  // Set active nav item
  function setActiveNav(item){
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    mov