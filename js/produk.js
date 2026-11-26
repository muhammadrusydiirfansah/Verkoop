// Memuat komponen HTML
async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${file}: ${response.status}`);
        }

        let html = await response.text();

        // Menyesuaikan path aset komponen
        html = html.replace(
            /(src|href)="assets\//g,
            '$1="../assets/'
        );

        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}

// Efek header ketika halaman di-scroll
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

const itemsPerPage = 24;
let currentPage = 1;
let products;
let filteredProducts;

const productGrid = document.getElementById('product-grid');
const pagination = document.getElementById('product-pagination');
const emptyMessage = document.getElementById('product-empty');

// Format harga Rupiah
function formatRupiah(price) {
    return 'Rp. ' + price.toLocaleString('id-ID');
}

// Membuat kartu produk
function renderProducts() {
    productGrid.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(
        start,
        start + itemsPerPage
    );

    currentProducts.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const imageContent = product.image
            ? `<img src="${product.image}" alt="${product.name}">`
            : `<div class="product-image-placeholder">
                            <i class="bi ${product.icon}"></i>
                       </div>`;

        card.innerHTML = `
                    <div class="product-image">
                        ${imageContent}
                    </div>

                    <div class="product-information">
                        <div class="product-name-row">
                            <h3>${product.name}</h3>
                            <i class="bi ${product.icon} product-category-icon"></i>
                        </div>

                        <p class="product-price">${formatRupiah(product.price)}</p>

                        <a class="product-detail-button"
                            href="detail.html?id=${product.id}">
                            Lihat Detail
                        </a>
                    </div>
                `;

        productGrid.appendChild(card);
    });

    emptyMessage.hidden = filteredProducts.length > 0;
    productGrid.hidden = filteredProducts.length === 0;

    renderPagination();
}

// Membuat pagination
function renderPagination() {
    pagination.innerHTML = '';

    const totalPages = Math.ceil(
        filteredProducts.length / itemsPerPage
    );

    if (totalPages <= 1) return;

    function addPageButton(page) {
        const button = document.createElement('button');
        button.className = 'pagination-number';
        button.textContent = page;
        button.type = 'button';
        button.setAttribute('aria-label', `Halaman ${page}`);

        if (page === currentPage) {
            button.classList.add('active');
            button.setAttribute('aria-current', 'page');
        }

        button.addEventListener('click', () => {
            changePage(page);
        });

        pagination.appendChild(button);
    }

    function addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.setAttribute('aria-hidden', 'true');
        ellipsis.textContent = '…';
        pagination.appendChild(ellipsis);
    }

    const previous = document.createElement('button');
    previous.className = 'pagination-arrow';
    previous.textContent = '< Sebelumnya';
    previous.type = 'button';
    previous.disabled = currentPage === 1;
    previous.addEventListener('click', () => {
        changePage(currentPage - 1);
    });
    pagination.appendChild(previous);

    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) {
            addPageButton(page);
        }
    } else if (currentPage <= 3) {
        [1, 2, 3].forEach(addPageButton);
        addEllipsis();
        addPageButton(totalPages);
    } else if (currentPage >= totalPages - 2) {
        addPageButton(1);
        addEllipsis();
        for (let page = totalPages - 2; page <= totalPages; page++) {
            addPageButton(page);
        }
    } else {
        addPageButton(1);
        addEllipsis();
        [currentPage - 1, currentPage, currentPage + 1]
            .forEach(addPageButton);
        addEllipsis();
        addPageButton(totalPages);
    }

    const next = document.createElement('button');
    next.className = 'pagination-arrow';
    next.textContent = 'Selanjutnya >';
    next.type = 'button';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => {
        changePage(currentPage + 1);
    });

    pagination.appendChild(next);
}

function changePage(page) {
    const totalPages = Math.ceil(
        filteredProducts.length / itemsPerPage
    );

    if (page < 1 || page > totalPages || page === currentPage) return;

    currentPage = page;
    renderProducts();

    document.querySelector('.product-content').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Pencarian dan filter kategori
function initProductFilter() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('product-category');

    function filterProducts() {
        const keyword = searchInput.value.trim().toLocaleLowerCase('id');
        const category = categorySelect.value;

        filteredProducts = products.filter((product) => {
            const matchesName = product.name
                .toLocaleLowerCase('id')
                .includes(keyword);

            const matchesCategory = !category ||
                product.category === category;

            return matchesName && matchesCategory;
        });

        currentPage = 1;
        renderProducts();
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
}

// Memuat halaman
async function loadLandingPage() {
    await loadComponent('header', '../components/header.html');
    initHeaderScroll();
    initMobileNavigation();

    const currentLink = document.querySelector(
        '.main-nav a[href="/pages/produk.html"], .main-nav a[href="produk.html"]'
    );

    if (currentLink) {
        currentLink.setAttribute('aria-current', 'page');
    }

    await loadComponent('footer', '../components/footer.html');
    await loadComponent('whatsapp', '../components/whatsapp.html');
}

window.VerkoopProducts = [
    { id: 1, name: "Pop Mie", price: 7000, category: "Makanan Berat", icon: "bi-egg-fried", image: "../assets/images/produk/Popmie.jpg", partner: "", description: "Mie instan dalam cup yang praktis disajikan dengan air panas." },
    { id: 2, name: "Tahu Kocek", price: 4500, category: "Makanan Ringan", icon: "bi-cookie", image: "../assets/images/produk/Tahukocek.jpg", partner: "Jingga-Food", description: "Camilan tahu dengan cita rasa gurih dan pedas." },
    { id: 3, name: "Mineral Botol Vit", price: 3000, category: "Minuman", icon: "bi-cup-straw", image: "../assets/images/produk/Mineralvit.jpg", partner: "", description: "Air mineral dalam botol yang praktis dibawa dan diminum kapan saja." },
    { id: 4, name: "Bollpoint", price: 3000, category: "Alat Tulis", icon: "bi-pencil", image: "../assets/images/produk/Bolpoint.jpg", partner: "", description: "Balpoint hitam dengan ukuran 0,5 sesuai untuk menulis." },
    { id: 5, name: "Nasi Ayam Katsu", price: 10000, category: "Makanan Berat", icon: "bi-egg-fried", image: "../assets/images/produk/Ayam.jpg", partner: "Ibu Sri Utami", description: "Nasi hangat dengan ayam katsu berbalut tepung renyah, disajikan dengan saus yang menggugah selera." },
    { id: 6, name: "Chitato Lite", price: 2500, category: "Makanan Ringan", icon: "bi-cookie", image: "../assets/images/produk/Citatolite.jpg", partner: "", description: "Keripik kentang tipis dan renyah dengan cita rasa gurih." },
    { id: 7, name: "Nesscafe", price: 7000, category: "Minuman", icon: "bi-cup-straw", image: "../assets/images/produk/Nescafe.jpg", partner: "", description: "Minuman kopi kaleng siap minum dengan aroma dan cita rasa kopi yang khas." },
    { id: 8, name: "Kertas HVS", price: 500, category: "Alat Tulis", icon: "bi-pencil", image: "../assets/images/produk/HVS.jpg", partner: "", description: "Kertas HVS untuk kebutuhan menulis." },
    { id: 9, name: "Nasi Ayam Suwir", price: 6500, category: "Makanan Berat", icon: "bi-egg-fried", image: "../assets/images/produk/Ayamsuwir.jpg", partner: "Ibu Faiqori", description: "Nasi hangat dengan ayam suwir berbumbu yang gurih dan kaya rasa, cocok untuk menu makan praktis." },
    { id: 10, name: "Risol Sayur", price: 3000, category: "Makanan Ringan", icon: "bi-cookie", image: "../assets/images/produk/Risolsayur.jpg", partner: "Ibu Surya", description: "Risol dengan isian sayuran yang gurih." },
    { id: 11, name: "Jamu", price: 6000, category: "Minuman", icon: "bi-cup-straw", image: "../assets/images/produk/Jamu.jpg", partner: "Bapak Yudi", description: "Minuman tradisional berbahan rempah yang memiliki cita rasa khas serta cocok dinikmati untuk menjaga kebugaran tubuh." },
    { id: 12, name: "Map Kertas", price: 1000, category: "Alat Tulis", icon: "bi-pencil", image: "../assets/images/produk/Map.jpg", partner: "", description: "Map kertas untuk merapikan dokumen penting." },
    { id: 13, name: "Nasi Ayam Karage", price: 10000, category: "Makanan Berat", icon: "bi-egg-fried", image: "../assets/images/produk/Karage.jpg", partner: "Kak Memey", description: "Nasi dengan potongan ayam karage yang renyah di luar dan juicy di dalam, cocok untuk menemani waktu makan." },
    { id: 14, name: "Gery Salut", price: 1500, category: "Makanan Ringan", icon: "bi-cookie", image: "../assets/images/produk/Gerysalut.jpg", partner: "", description: "Biskuit atau wafer Gery dengan aneka varian ras yang khas dan manis." },
    { id: 15, name: "Susu UHT Ultramilk", price: 6000, category: "Minuman", icon: "bi-cup-straw", image: "../assets/images/produk/Ultramilk.jpg", partner: "", description: "Susu UHT Ultra Milk (250 ml) Tersedia Varian : Full cream, Coklat, Stroberi, Caramel, dan Taro." },
    { id: 16, name: "Penghapus", price: 1500, category: "Alat Tulis", icon: "bi-pencil", image: "../assets/images/produk/Penghapus.jpg", partner: "", description: "Penghapus karet untuk menghapus tulisan pensil." },
    { id: 17, name: "Nasi Ayam Telur", price: 7000, category: "Makanan Berat", icon: "bi-egg-fried", image: "../assets/images/produk/Nasitelur.jpg", partner: "Ibu Endang Sisyati", description: "Nasi dengan kombinasi ayam dan telur yang lezat, menjadi pilihan menu sederhana, mengenyangkan, dan nikmat." },
    { id: 18, name: "Tahu Aci", price: 4000, category: "Makanan Ringan", icon: "bi-cookie", image: "../assets/images/produk/Tahuaci.jpg", partner: "Aynun", description: "Tahu dengan isian adonan aci yang gurih dan kenyal, digoreng hingga renyah di luar, cocok dinikmati sebagai camilan hangat." },
    { id: 19, name: "Mineral Cup Indosari", price: 500, category: "Minuman", icon: "bi-cup-straw", image: "../assets/images/produk/Mineralindosari.jpg", partner: "", description: "Air minum dalam kemasan gelas yang praktis untuk kebutuhan minum sehari-hari." },
    { id: 20, name: "Kertas Folio", price: 8000, category: "Alat Tulis", icon: "bi-pencil", image: "../assets/images/produk/Folio.jpg", partner: "", description: "Kertas Folio untuk kebutuhan menulis." },
    { id: 21, name: "Ayam Geprek", price: 12000, category: "Makanan Berat", icon: "bi-egg-fried", image: "", partner: "", description: "Ayam geprek dengan sambal untuk menu makan yang lezat." },
    { id: 22, name: "Risol Mayo", price: 5000, category: "Makanan Ringan", icon: "bi-cookie", image: "", partner: "", description: "Risol renyah dengan isian mayo yang gurih." },
    { id: 23, name: "Sosis Bakar", price: 6000, category: "Makanan Ringan", icon: "bi-basket", image: "", partner: "", description: "Sosis bakar dengan saus pilihan untuk camilan." },
    { id: 24, name: "Tahu Isi", price: 3000, category: "Makanan Ringan", icon: "bi-cookie", image: "", partner: "", description: "Tahu goreng berisi sayuran sebagai camilan gurih." },
    { id: 25, name: "Keripik Singkong", price: 5000, category: "Makanan Ringan", icon: "bi-basket", image: "", partner: "", description: "Keripik singkong renyah untuk teman beraktivitas." },
    { id: 26, name: "Puding Cokelat", price: 5000, category: "Makanan Ringan", icon: "bi-cake", image: "", partner: "", description: "Puding cokelat lembut sebagai pilihan pencuci mulut." },
    { id: 27, name: "Teh Lemon", price: 5000, category: "Minuman", icon: "bi-cup-straw", image: "", partner: "", description: "Minuman teh dengan rasa lemon yang segar." },
    { id: 28, name: "Kopi Hitam", price: 5000, category: "Minuman", icon: "bi-cup-straw", image: "", partner: "", description: "Kopi hitam untuk menemani waktu istirahat." },
    { id: 29, name: "Roti Cokelat", price: 5000, category: "Makanan Ringan", icon: "bi-cake", image: "", partner: "", description: "Roti lembut dengan isian cokelat untuk camilan." },
    { id: 30, name: "Susu UHT", price: 5000, category: "Minuman", icon: "bi-cup", image: "", partner: "", description: "Susu UHT praktis untuk menemani aktivitas harian." }
];
products = window.VerkoopProducts;
filteredProducts = [...products];

if (productGrid) {
    renderProducts();
    initProductFilter();
    loadLandingPage();
}
