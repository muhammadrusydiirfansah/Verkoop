const path = window.location.pathname;
let basePath = "";

if (path.includes("/pages/")) {
    // contoh: pages/produk.html -> 0 subfolder, pages/struktur/index.html -> 1 subfolder
    const afterPages = path.split("/pages/")[1];
    const subfolderDepth = afterPages.split("/").length - 1;
    basePath = "../".repeat(subfolderDepth + 1);
}

// Memuat komponen HTML
async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);

    try {
        const response = await fetch(basePath + filePath);

        if (!response.ok) {
            throw new Error("Komponen tidak ditemukan: " + basePath + filePath);
        }

        container.innerHTML = await response.text();

        // Sesuaikan link dan gambar di dalam komponen dengan lokasi halaman
        fixRelativePaths(container);

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Komponen gagal dimuat.</p>";
    }
}

// Tambahkan basePath ke href/src relatif di dalam komponen
function fixRelativePaths(container) {
    if (!basePath) return;

    const isRelative = (url) =>
        url &&
        !url.startsWith("http") &&
        !url.startsWith("/") &&
        !url.startsWith("#") &&
        !url.startsWith("mailto:") &&
        !url.startsWith("data:");

    container.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (isRelative(href)) a.setAttribute("href", basePath + href);
    });

    container.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (isRelative(src)) img.setAttribute("src", basePath + src);
    });
}

// Memuat sidebar dan header
async function loadAdminLayout() {
    await Promise.all([
        loadComponent("sidebar-container", "components/sidebar.html"),
        loadComponent("header-container", "components/header.html"),
    ]);

    // Tampilkan tanggal
    const dateElement = document.getElementById("current-date");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    if (sidebar && sidebarToggle) {
        const sidebarClose = sidebar.querySelector(".sidebar-close");
        const backdrop = document.createElement("button");
        backdrop.className = "sidebar-backdrop";
        backdrop.type = "button";
        backdrop.setAttribute("aria-label", "Tutup menu administrasi");
        document.body.appendChild(backdrop);

        const closeSidebar = () => {
            document.body.classList.remove("sidebar-open");
            sidebarToggle.setAttribute("aria-expanded", "false");
            sidebarToggle.setAttribute("aria-label", "Buka menu administrasi");
            sidebarToggle.querySelector("i").className = "bi bi-list";
        };

        sidebarToggle.addEventListener("click", () => {
            const isOpen = document.body.classList.toggle("sidebar-open");
            sidebarToggle.setAttribute("aria-expanded", String(isOpen));
            sidebarToggle.setAttribute("aria-label", isOpen ? "Tutup menu administrasi" : "Buka menu administrasi");
            sidebarToggle.querySelector("i").className = isOpen ? "bi bi-x-lg" : "bi bi-list";
        });

        sidebarClose.addEventListener("click", closeSidebar);
        backdrop.addEventListener("click", closeSidebar);

        sidebar.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeSidebar);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeSidebar();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) closeSidebar();
        });
    }
}

loadAdminLayout();