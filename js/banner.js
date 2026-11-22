function initHeroCarousel() {
    const carousel = document.querySelector('.hero-showcase');

    if (!carousel) return;

    const slides = carousel.querySelectorAll('.showcase-slide');
    const indicators = carousel.querySelectorAll('.showcase-indicators button');

    const prevButton = carousel.querySelector('.showcase-arrow.prev');
    const nextButton = carousel.querySelector('.showcase-arrow.next');

    let currentIndex = 0;
    let autoSlide;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        clearInterval(autoSlide);

        autoSlide = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    // Berhenti sementara ketika mouse berada di atas carousel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    showSlide(0);
    startAutoSlide();
}