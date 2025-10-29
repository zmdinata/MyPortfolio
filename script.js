document.addEventListener('DOMContentLoaded', () => {
    
    // ===== Variabel Global (Diperbarui) =====
    // Ambil kedua set tombol
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    const langToggleDesktop = document.getElementById('lang-toggle-desktop');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Ikon-ikon (Kita perlu memilih SEMUA ikon)
    const iconsSun = document.querySelectorAll('.icon-sun');
    const iconsMoon = document.querySelectorAll('.icon-moon');
    
    // ===== 1. Theme Toggler (Light/Dark Mode) - (DIPERBARUI) =====
    
    // Cek tema dari localStorage saat memuat
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else {
        enableDarkMode(); // Default
    }

    // Fungsi untuk mengubah tema
    function toggleTheme() {
        if (document.body.classList.contains('light-mode')) {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            enableLightMode();
            localStorage.setItem('theme', 'light');
        }
    }

    // Tambahkan listener ke KEDUA tombol
    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    function enableLightMode() {
        document.body.classList.add('light-mode');
        iconsSun.forEach(icon => icon.style.display = 'inline');
        iconsMoon.forEach(icon => icon.style.display = 'none');
    }

    function enableDarkMode() {
        document.body.classList.remove('light-mode');
        iconsSun.forEach(icon => icon.style.display = 'none');
        iconsMoon.forEach(icon => icon.style.display = 'inline');
    }

    // ===== 2. Language Toggler (EN/ID) - (DIPERBARUI) =====

    // Cek bahasa dari localStorage
    let currentLang = localStorage.getItem('lang') || 'en'; // 'en' adalah default
    setLanguage(currentLang);

    // Fungsi untuk mengubah bahasa
    function toggleLanguage() {
        if (currentLang === 'en') {
            setLanguage('id');
        } else {
            setLanguage('en');
        }
    }

    // Tambahkan listener ke KEDUA tombol
    if (langToggleDesktop) {
        langToggleDesktop.addEventListener('click', toggleLanguage);
    }
    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', toggleLanguage);
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        const elements = document.querySelectorAll('[data-lang]');
        
        elements.forEach(el => {
            if (el.getAttribute('data-lang') === lang) {
                // Menggunakan 'display: unset' agar kembali ke display aslinya (block, inline, flex, etc.)
                // Tapi untuk 'display: none' kita harus konsisten. Kita set 'block' atau 'inline'
                // Cara paling aman adalah check tag-nya.
                const tag = el.tagName.toLowerCase();
                if (tag === 'span' || tag === 'a' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'li') {
                     // Cek jika style aslinya adalah inline
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

        // Update KEDUA tombol toggle
        const newText = (lang === 'id') ? 'EN' : 'ID';
        if (langToggleDesktop) langToggleDesktop.textContent = newText;
        if (langToggleMobile) langToggleMobile.textContent = newText;
    }

    // ===== 3. Mobile Navigation (Hamburger Menu) =====
    // (Logika ini tidak berubah)
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            toggleMobileNav();
        });
    }

    if (mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(mobileNav.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });
    }
    
    function toggleMobileNav() {
        if (hamburger && mobileNav) {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        }
    }

    // ===== 4. Preview Modal =====
    // (Logika ini tidak berubah, hanya selector yang disesuaikan)
    const previewModal = document.getElementById('preview-modal');
    const modalClose = document.getElementById('preview-modal-close');
    const modalBody = document.getElementById('preview-modal-body');
    
    if (previewModal && modalClose && modalBody) {
        
        // Memperbarui selector untuk mencakup link di .certificate-grid
        const previewLinks = document.querySelectorAll('.scroll-item a, .certificate-grid a');

        previewLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                
                let type = link.getAttribute('data-type'); 
                
                // Jika tipenya 'external', jangan lakukan apa-apa.
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

        // Fungsi untuk menutup modal
        const closeModal = () => {
            previewModal.style.display = 'none';
            modalBody.innerHTML = ''; // Kosongkan iframe agar video/audio berhenti
        };

        // Klik tombol close (X)
        modalClose.addEventListener('click', closeModal);

        // Klik di luar area konten (di overlay gelap)
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closeModal();
            }
        });
    }
});
