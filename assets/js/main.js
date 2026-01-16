document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MENU MOBILE
       ========================= */
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".menu-overlay");

    if (menuToggle && mobileMenu && overlay) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    /* =========================
       CARROSSEL INFINITO
       ========================= */
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-track img");

    if (!track || slides.length === 0) return;

    let index = 0;
    const pause = 5000;
    const duration = 1200;
    const total = slides.length;

    // CLONA PRIMEIRA IMAGEM
    const firstClone = slides[0].cloneNode(true);
    track.appendChild(firstClone);

    function moveCarousel() {
        index++;
        track.style.transition = `transform ${duration}ms ease-in-out`;
        track.style.transform = `translateX(-${index * 100}%)`;

        // CHEGOU NO CLONE
        if (index === total) {
            setTimeout(() => {
                track.style.transition = "none";
                track.style.transform = "translateX(0)";
                index = 0;
            }, duration);
        }
    }

    setInterval(moveCarousel, pause);

});
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".mobile-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".mobile-menu a");

    if (!menu || !menuToggle || !overlay) return;

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuToggle.classList.remove("active");
            overlay.classList.remove("active");
        });
    });
});
document.querySelectorAll('.mobile-menu .nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document
            .querySelectorAll('.mobile-menu .nav-menu a')
            .forEach(a => a.classList.remove('menu-active'));

        link.classList.add('menu-active');
    });
});
document.querySelectorAll('.mobile-menu .nav-menu a').forEach(link => {

    link.addEventListener('touchstart', () => {
        document
            .querySelectorAll('.mobile-menu .nav-menu a')
            .forEach(a => a.classList.remove('touch-hover'));

        link.classList.add('touch-hover');
    });

    link.addEventListener('touchend', () => {
        setTimeout(() => {
            link.classList.remove('touch-hover');
        }, 150);
    });

});
