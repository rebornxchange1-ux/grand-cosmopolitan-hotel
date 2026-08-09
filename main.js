/* ==========================================================
   GRAND COSMOPOLITAN HOTEL — MAIN JS
   Modular. Each feature is a self-contained function.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initFooterYear();
  initRoomBookButton();
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

/* ----------------------------------------------------------
   Tawk.to handoff. Opens the chat widget so the guest can
   continue the conversation with our reservations team.
   Optionally attaches a room name as a visitor attribute,
   so the team knows which room the guest is asking about.
   ---------------------------------------------------------- */
function sendBookingToTawk(roomType) {
  if (typeof Tawk_API === 'undefined') {
    console.warn('Tawk.to has not loaded yet. Please try again in a moment.');
    return;
  }

  if (roomType && typeof Tawk_API.setAttributes === 'function') {
    Tawk_API.setAttributes({
      'Room Type': roomType
    }, function (error) {
      if (error) console.warn('Tawk.to setAttributes error:', error);
    });
  }

  if (typeof Tawk_API.maximize === 'function') {
    Tawk_API.maximize();
  } else if (typeof Tawk_API.toggle === 'function') {
    Tawk_API.toggle();
  }
}

/* ----------------------------------------------------------
   Footer copyright year — always current, no manual updates.
   ---------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ----------------------------------------------------------
   Room detail pages: "Book Now" button.
   Opens Tawk.to directly with this specific room name set as
   a visitor attribute, so the reservations team immediately
   knows which room the guest is asking about.
   ---------------------------------------------------------- */
function initRoomBookButton() {
  const btn = document.getElementById('roomBookBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    sendBookingToTawk(btn.getAttribute('data-room'));
  });
}
