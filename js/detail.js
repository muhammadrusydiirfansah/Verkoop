async function loadComponent(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Gagal memuat ${file}`);
        document.getElementById(id).innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 50);
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

function formatRupiah(price) {
    return 'Rp. ' + price.toLocaleString('id-ID');
}

function renderProductDetail() {
    const products = window.VerkoopProducts;
    if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Data produk tidak tersedia. Pastikan produk.js berhasil dimuat.');
    }

    const productId = Number(new URLSearchParams(window.location.search).get('id'));
    const product = products.find(item => item.id === productId) || products[0];

    document.title = `${product.name} | Detail Produk Verkoop`;

    const image = document.getElementById('detail-image');
    if (product.image) {
        image.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    } else {
        image.innerHTML = `<i class="bi ${product.icon}" aria-hidden="true"></i>`;
    }

    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-price').textContent = formatRupiah(product.price);
    document.getElementById('detail-description').textContent = product.description;

    const status = document.getElementById('detail-status');
    status.textContent = product.partner ? 'Produk Mitra' : 'Produk Kantin';
    status.classList.toggle('partner', Boolean(product.partner));

    const partner = document.getElementById('detail-partner');
    if (product.partner) {
        partner.hidden = false;
        document.getElementById('detail-partner-name').textContent = product.partner;
    }

    const relatedGrid = document.getElementById('related-grid');
    const relatedProducts = products
        .filter(item => item.id !== product.id)
        .slice(0, 6);

    relatedGrid.innerHTML = relatedProducts.map(item => `
                <article class="related-card">
                    <a class="related-image" href="detail.html?id=${item.id}" aria-label="Lihat ${item.name}">
                        ${item.image
            ? `<img src="${item.image}" alt="${item.name}">`
            : `<i class="bi ${item.icon}" aria-hidden="true"></i>`}
                    </a>
                    <div class="related-information">
                        <div class="related-name-row">
                            <h3>${item.name}</h3>
                            <i class="bi ${item.icon}" aria-hidden="true"></i>
                        </div>
                        <p>${formatRupiah(item.price)}</p>
                        <a class="related-detail-button" href="detail.html?id=${item.id}">Lihat Detail</a>
                    </div>
                </article>
            `).join('');
}

async function loadPage() {
    await loadComponent('header', '../components/header.html');
    initHeaderScroll();
    initMobileNavigation();
    renderProductDetail();
    await loadComponent('footer', '../components/footer.html');
    await loadComponent('whatsapp', '../components/whatsapp.html');
}

loadPage();