document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Once only
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Trigger when 15% visible per spec
    rootMargin: "0px"
  });

  // --- Theme Manager ---
  const themeManager = {
    init() {
      this.root = document.documentElement;
      this.toggleBtn = null;

      // 1. Check Preference
      const localTheme = localStorage.getItem('theme');
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (localTheme) {
        this.setTheme(localTheme);
      } else {
        this.setTheme(sysDark ? 'dark' : 'light');
      }

      // 2. Inject Button
      this.injectToggle();
    },

    injectToggle() {
      // Try main nav first, then lab nav
      const container = document.querySelector('.nav-links') || document.querySelector('.nav-right');
      if (!container) return;

      const btn = document.createElement('button');
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle Dark Mode');
      btn.innerHTML = this.getIcon(this.currentTheme);

      btn.onclick = () => this.toggle();

      // Insert before the last item (usually CTA) or at end
      if (container.classList.contains('nav-links')) {
        // Insert before the "Book Diagnostic" button if possible, else append
        const cta = container.querySelector('.btn-primary');
        if (cta) container.insertBefore(btn, cta);
        else container.appendChild(btn);
      } else {
        // Lab nav: prepend to left of Save/Run buttons
        container.insertBefore(btn, container.firstChild);
      }

      this.toggleBtn = btn;
    },

    toggle() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    },

    setTheme(theme) {
      this.currentTheme = theme;
      this.root.setAttribute('data-theme', theme);

      if (this.toggleBtn) {
        this.toggleBtn.innerHTML = this.getIcon(theme);
      }

      // Broadcast event for specific pages (like editor)
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    getIcon(theme) {
      if (theme === 'dark') {
        // Sun Icon (to switch to light)
        return `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      } else {
        // Moon Icon
        return `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      }
    }
  };

  themeManager.init();

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Diagnostic Modal Logic ---
  const modal = document.getElementById('diagnostic-modal');
  const openButtons = document.querySelectorAll('.js-open-diagnostic');
  const closeButton = document.querySelector('.modal-close');
  const diagnosticForm = document.getElementById('diagnostic-form');

  // --- Age Button Logic ---
  const ageButtons = document.querySelectorAll('.age-btn');
  const ageInput = document.getElementById('learner-age');

  if (ageButtons.length > 0 && ageInput) {
    ageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        ageButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        ageInput.value = btn.dataset.value;
      });
    });
  }

  if (modal && openButtons.length > 0) {
    // Open Modal
    function openModal(e) {
      e.preventDefault();
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal
    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    openButtons.forEach(btn => btn.addEventListener('click', openModal));

    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    // Close on clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Form Submission
    if (diagnosticForm) {
      diagnosticForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation
        const parentName = document.getElementById('parent-name').value;
        const email = document.getElementById('email').value;
        // Contact number removed

        if (!parentName || !email) {
          alert('Please fill in all mandatory fields.');
          return;
        }

        // Gather Data
        const formData = {
          parentName,
          email,
          contact: "Email Preferred",
          learnerName: document.getElementById('learner-name').value,
          learnerAge: document.getElementById('learner-age').value,
          comments: document.getElementById('comments').value,
          timestamp: new Date().toISOString()
        };

        console.log('Form Submitted with Data:', formData);

        // ---------------------------------------------------------
        // GOOGLE SHEETS INTEGRATION
        // ---------------------------------------------------------
        // IMPORTANT: Replace the URL below with your 'Web App URL' from Google Apps Script
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNq0naFPeDUV5X5QLEO-fxordRM3MKkEbdfQPck-hgMeZo6_k1Z9bH044ygnbbcixlEw/exec';

        const submitBtn = diagnosticForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;

        fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(formData)
        })
          .then(response => {
            // With no-cors, we can't check response.ok, so we assume success if it doesn't throw
            console.log('Request sent successfully');

            // Hide Form
            diagnosticForm.style.display = 'none';
            document.querySelector('.modal-header').style.display = 'none';

            // Show Success
            const successMsg = document.getElementById('diagnostic-success');
            if (successMsg) {
              successMsg.style.display = 'block';
            }

            // Reset Form
            diagnosticForm.reset();
          })
          .catch(error => {
            console.error('Error!', error.message);
            alert('There was a problem submitting your request. Please try again or contact us directly on WhatsApp.');
          })
          .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
          });

        // End of submission logic
        return;
        // ---------------------------------------------------------
      });
    }

    // Close modal button inside success message
    const closeSuccessBtn = document.querySelector('.js-close-modal');
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', closeModal);
    }
  }

  // --- Premium Accordion Logic ---
  const accordions = document.querySelectorAll('.accordion-header');

  if (accordions.length > 0) {
    accordions.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const isOpen = header.getAttribute('aria-expanded') === 'true';

        // Close all other accordions (Optional: remove this block to allow multiple open)
        accordions.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.setAttribute('aria-expanded', 'false');
            otherHeader.parentElement.classList.remove('is-active');
            otherHeader.parentElement.querySelector('.accordion-content').style.height = '0px';
          }
        });

        // Toggle current
        if (isOpen) {
          header.setAttribute('aria-expanded', 'false');
          item.classList.remove('is-active');
          content.style.height = '0px';
        } else {
          header.setAttribute('aria-expanded', 'true');
          item.classList.add('is-active');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });

    // Handle window resize to adjust height if open
    window.addEventListener('resize', () => {
      document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(header => {
        const content = header.parentElement.querySelector('.accordion-content');
        content.style.height = 'auto'; // Reset to auto to get new height
        const newHeight = content.scrollHeight;
        content.style.height = newHeight + 'px';
      });
    });
  }
  // --- Mobile Navigation Logic ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open'); // To control overflow if needed
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
