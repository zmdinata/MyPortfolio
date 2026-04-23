document.addEventListener('DOMContentLoaded', () => {
    // ===== Global Elements =====
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const langToggleDesktop = document.getElementById('lang-toggle-desktop');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const iconsSun = document.querySelectorAll('.icon-sun');
    const iconsMoon = document.querySelectorAll('.icon-moon');

    // Modal Elements
    const previewModal = document.getElementById('preview-modal');
    const modalClose = document.getElementById('preview-modal-close');
    const modalBody = document.getElementById('preview-modal-body');

    // ===== 1. THEME TOGGLER (Dark / Light) =====
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else {
        enableDarkMode(); // default is dark-mode
    }

    function toggleTheme() {
        if (document.body.classList.contains('light-mode')) {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            enableLightMode();
            localStorage.setItem('theme', 'light');
        }
    }

    function enableLightMode() {
        document.body.classList.add('light-mode');
        iconsSun.forEach(icon => (icon.style.display = 'inline-flex'));
        iconsMoon.forEach(icon => (icon.style.display = 'none'));
    }

    function enableDarkMode() {
        document.body.classList.remove('light-mode');
        iconsSun.forEach(icon => (icon.style.display = 'none'));
        iconsMoon.forEach(icon => (icon.style.display = 'inline-flex'));
    }

    if (themeToggleDesktop) { themeToggleDesktop.addEventListener('click', toggleTheme); }
    if (themeToggleMobile) { themeToggleMobile.addEventListener('click', toggleTheme); }

    // ===== 2. LANGUAGE TOGGLER (EN / ID) =====
    let currentLang = localStorage.getItem('lang') || 'en';
    setLanguage(currentLang);

    function toggleLanguage() {
        if (currentLang === 'en') {
            setLanguage('id');
        } else {
            setLanguage('en');
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        const elements = document.querySelectorAll('[data-lang]');

        elements.forEach(el => {
            if (el.getAttribute('data-lang') === lang) {
                // Ensure correct display for block/inline elements
                const tag = el.tagName.toLowerCase();
                if (['span', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'li'].includes(tag)) {
                    el.style.display = el.getAttribute('data-initial-display') || ''; 
                } else {
                    el.style.display = 'block';
                }
            } else {
                el.style.display = 'none';
            }
        });

        const buttonText = lang === 'id' ? 'EN' : 'ID';
        if (langToggleDesktop) langToggleDesktop.textContent = buttonText;
        if (langToggleMobile) langToggleMobile.textContent = buttonText;
    }

    if (langToggleDesktop) { langToggleDesktop.addEventListener('click', toggleLanguage); }
    if (langToggleMobile) { langToggleMobile.addEventListener('click', toggleLanguage); }
    
    // Store initial display style (especially for inline elements like span and list items)
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (!el.getAttribute('data-initial-display')) {
            const computedStyle = window.getComputedStyle(el).display;
            el.setAttribute('data-initial-display', computedStyle === 'none' ? '' : computedStyle);
        }
    });

    // ===== 3. MOBILE NAV (Hamburger) =====
    function toggleMobileNav() {
        if (!hamburger || !mobileNav) return;
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        const expanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', toggleMobileNav);
    }

    if (mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });
    }

    // ===== 4. PREVIEW MODAL (Images / PDF / Iframe) =====
    function openModal(src, type) {
        modalBody.innerHTML = '';
        if (type === 'image') {
            modalBody.innerHTML = `<img src="${src}" alt="Preview">`;
        } else if (type === 'pdf' || type === 'iframe') {
            modalBody.innerHTML = `<iframe src="${src}" frameborder="0"></iframe>`;
        }
        previewModal.style.display = 'flex';
    }

    const closeModal = () => {
        previewModal.style.display = 'none';
        modalBody.innerHTML = '';
    };

    if (previewModal && modalClose && modalBody) {
        const previewLinks = document.querySelectorAll('.scroll-item a, .certificate-grid a');

        previewLinks.forEach(link => {
            link.addEventListener('click', e => {
                const type = link.getAttribute('data-type');
                const src = link.getAttribute('href');

                // Skip external links from showing in the modal
                if (type === 'external') return; 

                e.preventDefault();
                openModal(src, type);
            });
        });

        modalClose.addEventListener('click', closeModal);

        previewModal.addEventListener('click', e => {
            if (e.target === previewModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && previewModal.style.display === 'flex') {
                closeModal();
            }
        });
    }
});
