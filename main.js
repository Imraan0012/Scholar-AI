/**
 * Intelligence Designed To Evolve - Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStatsCounter();
  initNavLinks();
});

/* ==========================================================================
   Mobile Menu Functionality
   ========================================================================== */
function initMobileMenu() {
  const burger = document.querySelector('.mobile-burger');
  const sheet = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-signin');

  if (!burger || !sheet || !overlay) return;

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    sheet.removeAttribute('hidden');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.removeAttribute('hidden');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    sheet.setAttribute('hidden', '');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // Close on mobile link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Auto-close on resize > 720px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   Stats Counter (IntersectionObserver + easeOutCubic)
   ========================================================================== */
function initStatsCounter() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  let hasAnimated = false;

  function animateStat(item, index) {
    const target = parseFloat(item.getAttribute('data-target') || '0');
    const suffix = item.getAttribute('data-suffix') || '';
    const decimals = parseInt(item.getAttribute('data-decimals') || '0', 10);
    const valueEl = item.querySelector('.stat-value');
    if (!valueEl) return;

    const duration = 1500 + index * 80;
    const startOffset = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = easedProgress * target;

        const formatted = currentVal.toFixed(decimals);
        valueEl.textContent = `${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          valueEl.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(step);
    }, startOffset);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statItems.forEach((item, idx) => {
            animateStat(item, idx);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  const statsFooter = document.querySelector('.stats-footer') || statItems[0];
  if (statsFooter) {
    observer.observe(statsFooter);
  }
}

/* ==========================================================================
   Nav Links Active State
   ========================================================================== */
function initNavLinks() {
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function handleActive(links, clickedLink) {
    links.forEach((l) => l.classList.remove('active'));
    clickedLink.classList.add('active');
  }

  desktopLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href')?.startsWith('#')) {
        handleActive(desktopLinks, link);
      }
    });
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href')?.startsWith('#')) {
        handleActive(mobileLinks, link);
      }
    });
  });
}
