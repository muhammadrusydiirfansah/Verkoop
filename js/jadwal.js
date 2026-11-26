// Memuat komponen HTML
async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Gagal memuat ${file}: ${response.status}`);
        }

        let html = await response.text();

        // Menyesuaikan lokasi aset untuk halaman di dalam folder pages
        html = html.replace(
            /(src|href)="assets\//g,
            '$1="../assets/'
        );

        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}

// Mengatur efek header ketika halaman di-scroll
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

// Data jadwal penjaga
// Silakan ganti nama dan departemen sesuai jadwal sebenarnya.
const scheduleList = [
    {
        day: "Senin",
        session: "07.00 - 15.00 WIB",
        departments: ["KWU", "LITBANG"],
        officers: [
            { name: "Hasanah Nur Ana" },
            { name: "Kumara Hendy W." },
            { name: "Shafira Maharani A." }
        ]
    },
    {
        day: "Selasa",
        session: "07.00 - 15.00 WIB",
        departments: ["KWU", "BPH"],
        officers: [
            { name: "Kumara Hendy W." },
            { name: "Shafira Maharani A." },
            { name: "Danisha Kahfi Chilla" },
            { name: "Laili Nur Qomari F.Z." }
        ]
    },
    {
        day: "Rabu",
        session: "07.00 - 15.00 WIB",
        departments: ["KWU", "Infokom"],
        officers: [
            { name: "Dwi Novita" },
            { name: "Fanisa Riski Ayu W." },
            { name: "Jingga Adelia Nabila" },
            { name: "Danisha Kahfi Chilia" }
        ]
    },
    {
        day: "Kamis",
        session: "07.00 - 15.00 WIB",
        departments: ["KWU", "Sosmas"],
        officers: [
            { name: "Hasanah Nur Ana" },
            { name: "Fanisa Riski Ayu W." },
            { name: "Jingga Adelia Nabila" },
            { name: "Laili Nur Qomari F. Z." },
            { name: "Danisha Kahfi Chilla" },
            { name: "Kumara Hendy W." }
        ]
    },
    {
        day: "Jumat",
        session: "07.00 - 15.00 WIB",
        departments: ["KWU", "SDM"],
        officers: [
            { name: "Hasanah Nur Ana" },
            { name: "Fanisa Riski Ayu W." },
            { name: "Jingga Adelia Nabila" },
            { name: "Laili Nur Qomari F. Z." },
            { name: "Shafira Maharani A" }
        ]
    }
];

// Membuat baris tabel dari data jadwal
function renderSchedule(data) {
    const tableBody = document.getElementById('schedule-data');
    const emptyMessage = document.getElementById('schedule-empty');

    tableBody.innerHTML = '';

    data.forEach((item) => {
        const row = document.createElement('tr');
        row.dataset.day = item.day;

        const officersHTML = item.officers.map((officer, index) => `
                    <div class="officer-item">
                        <span class="officer-number">${index + 1}</span>
                        <span>${officer.name}</span>
                    </div>
                `).join('');

        const departmentsHTML = item.departments.map((department) => `
                    <div class="department-item">
                        <span class="department-dot ${department.toLowerCase()}"></span>
                        <span>${department}</span>
                    </div>
                `).join('');

        row.innerHTML = `
                    <td class="day-cell">${item.day}</td>
                    <td class="session-cell">
                        <i class="bi bi-clock"></i>
                        ${item.session}
                    </td>
                    <td class="officers-cell">${officersHTML}</td>
                    <td class="departments-cell">${departmentsHTML}</td>
                `;

        tableBody.appendChild(row);
    });

    emptyMessage.hidden = data.length > 0;
}

// Fitur pencarian nama dan filter hari
function initScheduleFilter() {
    const nameFilter = document.getElementById('schedule-name');
    const dayFilter = document.getElementById('schedule-day');

    function filterSchedule() {
        const keyword = nameFilter.value.trim().toLocaleLowerCase('id');
        const selectedDay = dayFilter.value;

        const filteredData = scheduleList.filter((item) => {
            const matchesDay = !selectedDay || item.day === selectedDay;

            const matchesName = item.officers.some((officer) =>
                officer.name.toLocaleLowerCase('id').includes(keyword)
            );

            return matchesDay && matchesName;
        });

        renderSchedule(filteredData);
    }

    nameFilter.addEventListener('input', filterSchedule);
    dayFilter.addEventListener('change', filterSchedule);
}

// Memuat halaman
async function loadLandingPage() {
    await loadComponent('header', '../components/header.html');
    initHeaderScroll();
    initMobileNavigation();

    const currentLink = document.querySelector(
        '.main-nav a[href="/pages/jadwal.html"], .main-nav a[href="jadwal.html"]'
    );

    if (currentLink) {
        currentLink.setAttribute('aria-current', 'page');
    }

    await loadComponent('whatsapp', '../components/whatsapp.html');
    await loadComponent('footer', '../components/footer.html');
}

// Jalankan jadwal dan komponen
renderSchedule(scheduleList);
initScheduleFilter();
loadLandingPage();