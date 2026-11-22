async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${file}: ${response.status}`);
        }

        const html = await response.text();
        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');

    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader();
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

async function loadPage() {
    await loadComponent('header', '../components/header.html');
    initHeaderScroll();
    initMobileNavigation();

    const currentLink = document.querySelector(
        '.main-nav a[href="/pages/alur.html"], .main-nav a[href="alur.html"]'
    );

    if (currentLink) {
        currentLink.setAttribute('aria-current', 'page');
    }

    await loadComponent('footer', '../components/footer.html');
    await loadComponent('whatsapp', '../components/whatsapp.html');
}

loadPage();