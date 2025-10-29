document.addEventListener('DOMContentLoaded', () => {
    
    // ===== Variabel Global =====
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');
    
    // ===== 1. Theme Toggler (Light/Dark Mode) =====
    // (Tidak berubah)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else {
        enableDarkMode(); // Default
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            enableLightMode();
            localStorage.setItem('theme', 'light');
        }
    });

    function enableLightMode() {
        document.body.classList.add('light-mode');
        iconSun.style.display = 'inline';
        iconMoon.style.display = 'none';
    }

    function enableDarkMode() {
        document.body.classList.remove('light-mode');
        iconSun.style.display = 'none';
        iconMoon.style.display = 'inline';
    }

    // ===== 2. Language Toggler (EN/ID) =====
    // (Tidak berubah)
    let currentLang = localStorage.getItem('lang') || 'en'; // 'en' adalah default
    setLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        if (currentLang === 'en') {
            setLanguage('id');
        } else {
            setLanguage('en');
        }
    });

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        const elements = document.querySelectorAll('[data-lang]');
        
        elements.forEach(el => {
            if (el.getAttribute('data-lang') === lang) {
                const tag = el.tagName.toLowerCase();
                if (tag === 'span' || tag === 'a' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'li') {
                    if (window.getComputedStyle(el).display === 'inline') {
                         el.style.display = 'inline';
                    } else {
                         el.style.display = 'block';
                    }
                } else {
                    el.style.display = 'block';
                }
            } else {
                el.style.display = 'none';
            }
        });

        if (lang === 'id') {
            langToggle.textContent = 'EN';
        } else {
            langToggle.textContent = 'ID';
        }
    }

    // ===== 3. Mobile Navigation (Hamburger Menu) =====
    // (Tidak berubah)
    hamburger.addEventListener('click', () => {
        toggleMobileNav();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(mobileNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    function toggleMobileNav() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    }

    // ===== 4. Preview Modal (DIPERBARUI) =====

    const previewModal = document.getElementById('preview-modal');
    const modalClose = document.getElementById('preview-modal-close');
    const modalBody = document.getElementById('preview-modal-body');
    
    if (previewModal && modalClose && modalBody) {
        
        const previewLinks = document.querySelectorAll('.scroll-item a');

        previewLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                
                let type = link.getAttribute('data-type'); 
                
                // PERBAIKAN: Jika tipenya 'external', jangan lakukan apa-apa.
                // Biarkan browser menangani klik (membuka tab baru).
                if (type === 'external') {
                    return;
                }
                
                // Jika bukan 'external', cegah perilaku default (pindah halaman)
                e.preventDefault(); 
                
                const src = link.getAttribute('href');
                modalBody.innerHTML = '';
                
                if (type === 'image') {
                    modalBody.innerHTML = `<img src="${src}" alt="Preview">`;
                } 
                // Kita gabungkan 'pdf' dan 'iframe' karena keduanya menggunakan tag iframe
                else if (type === 'pdf' || type === 'iframe') { 
                    modalBody.innerHTML = `<iframe src="${src}" frameborder="0"></iframe>`;
                }
                
                previewModal.style.display = 'flex';
            });
        });

        const closeModal = () => {
            previewModal.style.display = 'none';
            modalBody.innerHTML = ''; 
        };

        modalClose.addEventListener('click', closeModal);

        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closeModal();
            }
        });
    }
});