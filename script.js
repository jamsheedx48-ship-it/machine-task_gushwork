/**
 * script.js — Mangalam HDPE Pipes
 *
 * Handles:
 *  1. Sticky Header  — appears on scroll past first fold, hides on scroll up
 *  2. Image Carousel — prev/next, thumbnail click, keyboard nav
 *  3. Zoom on Hover  — magnifying-glass zoom over carousel main image
 *  4. FAQ Accordion  — open/close with smooth animation
 *  5. Process Tabs   — tab switching
 *  6. Mobile Nav     — hamburger toggle
 *  7. Contact Form   — basic client-side validation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. STICKY HEADER
     Appears when user scrolls past hero height.
     Hides when scrolling back up.
  ================================================ */
  const stickyHeader = document.getElementById('stickyHeader');
  const mainNav      = document.getElementById('mainNav');
  const hero         = document.getElementById('hero');

  let lastScrollY = 0;

  function handleStickyHeader() {
    const scrollY     = window.scrollY;
    // Threshold = bottom of hero section
    const threshold   = (hero ? hero.offsetTop + hero.offsetHeight : 600);
    const scrollingUp = scrollY < lastScrollY;

    if (scrollY > threshold && scrollingUp) {
      // Past hero AND scrolling up → show sticky header
      stickyHeader.classList.add('visible');
    } else if (scrollY <= threshold || !scrollingUp) {
      // Above threshold OR scrolling down → hide
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleStickyHeader, { passive: true });


  /* ================================================
     2. IMAGE CAROUSEL
     - Carousel images array (src values)
     - Prev / Next buttons
     - Thumbnail click
     - Keyboard arrow keys
  ================================================ */
  const carouselImages = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  ];

  const mainImg       = document.getElementById('mainImg');
  const thumbItems    = document.querySelectorAll('.carousel__thumb');
  const prevBtn       = document.getElementById('carouselPrev');
  const nextBtn       = document.getElementById('carouselNext');

  let currentIndex = 0;

  /**
   * Switch carousel to a given index.
   * Updates main image src + thumbnail active state.
   * @param {number} index
   */
  function goToSlide(index) {
    // Wrap around
    currentIndex = (index + carouselImages.length) % carouselImages.length;

    // Fade transition
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = carouselImages[currentIndex];
      mainImg.style.opacity = '1';
      // Update zoom background if zoom is active
      syncZoomBackground();
    }, 150);

    // Update thumbnails
    thumbItems.forEach((t, i) => {
      t.classList.toggle('active', i === currentIndex);
    });
  }

  // Prev / Next button handlers
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Thumbnail click handlers
  thumbItems.forEach((thumb, i) => {
    thumb.addEventListener('click', () => goToSlide(i));
  });

  // Keyboard navigation (left / right arrows)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });

  // Auto-play (optional, every 5s)
  let autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);

  // Pause auto-play on hover
  const carouselStage = document.getElementById('carouselStage');
  carouselStage.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carouselStage.addEventListener('mouseleave', () => {
    autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);
  });


  /* ================================================
     3. IMAGE ZOOM ON HOVER
     Displays a magnified region of the main carousel
     image in a floating "zoom result" box to the right.
     The zoom lens follows the cursor over the image.
  ================================================ */
  const carouselMainImg = document.getElementById('carouselMainImg');
  const zoomLens        = document.getElementById('zoomLens');
  const zoomResult      = document.getElementById('zoomResult');

  const ZOOM_FACTOR = 3; // 3× magnification

  /**
   * Sync the background-image of zoomResult with the current mainImg src.
   * Called whenever the slide changes.
   */
  function syncZoomBackground() {
    zoomResult.style.backgroundImage = `url('${mainImg.src}')`;
  }
  // Initial sync
  syncZoomBackground();

  /**
   * On mouse move over the main image container, calculate:
   *  - Lens position (clamped to image bounds)
   *  - Background position for zoomResult
   */
  carouselMainImg.addEventListener('mousemove', (e) => {
    const imgRect    = carouselMainImg.getBoundingClientRect();
    const lensW      = zoomLens.offsetWidth;
    const lensH      = zoomLens.offsetHeight;

    // Cursor position relative to image
    let cursorX = e.clientX - imgRect.left;
    let cursorY = e.clientY - imgRect.top;

    // Clamp lens so it stays within image bounds
    let lensX = cursorX - lensW / 2;
    let lensY = cursorY - lensH / 2;
    lensX = Math.max(0, Math.min(lensX, imgRect.width  - lensW));
    lensY = Math.max(0, Math.min(lensY, imgRect.height - lensH));

    zoomLens.style.left = lensX + 'px';
    zoomLens.style.top  = lensY + 'px';

    // Background-size for zoomResult = image size × ZOOM_FACTOR
    const bgW = imgRect.width  * ZOOM_FACTOR;
    const bgH = imgRect.height * ZOOM_FACTOR;

    // Background-position: offset so lens region shows in result
    const bgX = -(lensX * ZOOM_FACTOR);
    const bgY = -(lensY * ZOOM_FACTOR);

    zoomResult.style.backgroundSize     = `${bgW}px ${bgH}px`;
    zoomResult.style.backgroundPosition = `${bgX}px ${bgY}px`;
  });

  // Show zoom elements on mouse enter
  carouselMainImg.addEventListener('mouseenter', () => {
    // Only show on larger screens where the result box has room
    if (true) {
      syncZoomBackground();
      zoomLens.style.display   = 'block';
      zoomResult.style.display = 'block';
    }
  });

  // Hide zoom elements on mouse leave
  carouselMainImg.addEventListener('mouseleave', () => {
    zoomLens.style.display   = 'none';
    zoomResult.style.display = 'none';
  });

  // Update zoom availability on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
      zoomLens.style.display   = 'none';
      zoomResult.style.display = 'none';
    }
  });


  /* ================================================
     4. FAQ ACCORDION
     Toggle open/close. Only one item open at a time
     is NOT enforced here — multiple can be open.
  ================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const icon     = item.querySelector('.faq-icon');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((fi) => {
        fi.classList.remove('open');
        fi.querySelector('.faq-icon').textContent = '+';
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // If it wasn't open, open it
      if (!isOpen) {
        item.classList.add('open');
        icon.textContent = '−';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ================================================
     5. PROCESS TABS
     Clicking a tab shows the matching panel.
  ================================================ */
  const procTabs   = document.querySelectorAll('.proc-tab');
  const procPanels = document.querySelectorAll('.process-panel');

  procTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = 'tab-' + tab.dataset.tab;

      // Update tab states
      procTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panel visibility
      procPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });


  /* ================================================
     6. MOBILE NAV — Hamburger toggle
  ================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });


  /* ================================================
     7. CONTACT FORM — Basic validation
  ================================================ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = contactForm.querySelector('[name="fullName"]');
      const email    = contactForm.querySelector('[name="email"]');
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.field-error').forEach((el) => el.remove());

      // Validate name
      if (!fullName.value.trim()) {
        showError(fullName, 'Full name is required.');
        valid = false;
      }

      // Validate email
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'A valid email address is required.');
        valid = false;
      }

      if (valid) {
        // Success — show confirmation (replace with real API call)
        const btn = contactForm.querySelector('[type="submit"]');
        btn.textContent = '✓ Request Sent!';
        btn.style.background = '#16a34a';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = 'Request Custom Quote';
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }

  /**
   * Show an inline error below a form field.
   * @param {HTMLElement} input
   * @param {string} message
   */
  function showError(input, message) {
    const err = document.createElement('p');
    err.className = 'field-error';
    err.style.cssText = 'color:#dc2626;font-size:12px;margin-top:4px;';
    err.textContent = message;
    input.parentElement.appendChild(err);
    input.style.borderColor = '#dc2626';

    input.addEventListener('input', () => {
      err.remove();
      input.style.borderColor = '';
    }, { once: true });
  }

  /**
   * Basic email format validation.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});