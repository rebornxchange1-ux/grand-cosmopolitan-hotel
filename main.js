/* ==========================================================
   GRAND COSMOPOLITAN HOTEL — MAIN JS
   Modular. Each feature is a self-contained function.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
});

/* ----------------------------------------------------------
   Header background switches from transparent to solid
   once the guest scrolls past the hero.
   ---------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const threshold = 60;

  const updateHeader = () => {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run once on load
}

/* ----------------------------------------------------------
   Mobile hamburger menu: slide-in panel + dark overlay.
   Closes on link click, overlay click, or the close icon.
   ---------------------------------------------------------- */
function initMobileNav() {
  const toggle  = document.getElementById('navToggle');
  const close   = document.getElementById('navClose');
  const links   = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  const allLinks = links.querySelectorAll('a:not(.nav-close)');

  const openMenu = () => {
    links.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    links.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  allLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ----------------------------------------------------------
   Scroll reveal: any element with class "reveal" fades and
   rises into view the moment it enters the viewport.
   Reusable by every future section — just add class="reveal".
   ---------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(item => observer.observe(item));
}
