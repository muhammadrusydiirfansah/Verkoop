async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${file}`);
        }

        const data = await response.text();
        document.getElementById(id).innerHTML = data;

    } catch (error) {
        console.error(error);
    }
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');

    if (!header) return;

    function handleScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function initMobileNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const navigation = document.querySelector('.main-nav');

    if (!toggle || !navigation) return;

    const closeMenu = () => {
        navigation.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka menu navigasi');
        toggle.querySelector('i').className = 'bi bi-list';
    };

    toggle.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        toggle.querySelector('i').className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
    });

    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

async function loadLandingPage() {
    await loadComponent('header', 'components/header.html');
    initHeaderScroll();
    initMobileNavigation();

    await loadComponent('banner', 'pages/banner.html');
    initHeroCarousel();

    await loadComponent('tentang', 'pages/tentang.html');
    await loadComponent('kategori', 'pages/kategori.html');
    await loadComponent('struktur', 'pages/struktur.html');
    await loadComponent('mitra', 'pages/mitra.html');

    await loadComponent('footer', 'components/footer.html');
    await loadComponent('whatsapp', 'components/whatsapp.html');

    // Inisialisasi AOS setelah semua komponen dimuat
    AOS.init({
        duration: 800,
        once: false,
        offset: 100
    });

    // Memperbarui elemen yang terdeteksi AOS
    AOS.refreshHard();

    const sectionId = window.location.hash.slice(1);
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

loadLandingPage();