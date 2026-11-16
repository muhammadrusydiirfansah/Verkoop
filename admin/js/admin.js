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
}

loadAdminLayout();