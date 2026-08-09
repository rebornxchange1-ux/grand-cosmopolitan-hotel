/* ==========================================================
   GRAND COSMOPOLITAN HOTEL — MAIN JS
   Modular. Each feature is a self-contained function.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initBookingForm();
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
   Booking form: collects the guest's reservation details and
   hands them off into Tawk.to chat.

   Tawk.to does not expose an API to auto-type a message into
   the chat input on the visitor's behalf. Instead, we:
     1. Set the collected fields as Tawk visitor attributes,
        so the reservations team sees them in the chat
        dashboard the moment the conversation opens.
     2. Open (maximize) the Tawk.to widget automatically.
   ---------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const booking = {
      checkIn:  form.checkIn.value,
      checkOut: form.checkOut.value,
      adults:   form.adults.value,
      children: form.children.value,
      roomType: form.roomType.value
    };

    sendBookingToTawk(booking);
  });
}

function sendBookingToTawk(booking) {
  if (typeof Tawk_API === 'undefined') {
    console.warn('Tawk.to has not loaded yet. Please try again in a moment.');
    return;
  }

  // Attach reservation details to the chat session as visitor attributes.
  if (typeof Tawk_API.setAttributes === 'function') {
    Tawk_API.setAttributes({
      'Check In':   booking.checkIn || 'Not specified',
      'Check Out':  booking.checkOut || 'Not specified',
      'Adults':     booking.adults,
      'Children':   booking.children,
      'Room Type':  booking.roomType
    }, function (error) {
      if (error) console.warn('Tawk.to setAttributes error:', error);
    });
  }

  // Open the chat widget so the guest can continue the conversation.
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
    const roomName = btn.getAttribute('data-room');
    sendBookingToTawk({
      checkIn: '',
      checkOut: '',
      adults: '',
      children: '',
      roomType: roomName
    });
  });
}
