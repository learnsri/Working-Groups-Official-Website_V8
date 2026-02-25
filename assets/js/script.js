document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Hamburger toggle (same as Index)
  // =========================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('primaryNav');
  const navOverlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-close');

  if (hamburger && navMenu) {
    const openMenu = () => {
      hamburger.classList.add('active');
      navMenu.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');

      if (navOverlay) {
        navOverlay.classList.add('active');
        navOverlay.setAttribute('aria-hidden', 'false');
      }

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollbarWidth + 'px';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');

      if (navOverlay) {
        navOverlay.classList.remove('active');
        navOverlay.setAttribute('aria-hidden', 'true');
      }

      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };

    const toggleMenu = () => {
      if (navMenu.classList.contains('active')) closeMenu();
      else openMenu();
    };

    hamburger.addEventListener('click', toggleMenu);

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) closeMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    }, { passive: true });

    // Click outside to close (optional but matches Index behavior)
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navMenu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      const clickedOverlay = navOverlay ? navOverlay.contains(e.target) : false;

      if ((!clickedInsideNav && !clickedHamburger && navMenu.classList.contains('active')) || clickedOverlay) {
        closeMenu();
      }
    });
  }

  // =========================
  // Navbar shadow on scroll (same as Index)
  // =========================
  const navbar = document.getElementById('siteNav');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 10) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});




const slides = document.querySelectorAll('#heroSlider input[type="radio"]');
let index = 0;

setInterval(() => {
  slides[index].checked = false;
  index = (index + 1) % slides.length;
  slides[index].checked = true;
}, 5000);







// people


// function copyEmail(email) {
//     navigator.clipboard.writeText(email).then(() => {
//         alert("Email copied: " + email);
//     });
// }



function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('copy-toast');

        toast.textContent = `Email copied: ${email}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    });
}















