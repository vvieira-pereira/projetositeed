document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".menu-overlay");

    if (!menuToggle || !mobileMenu || !overlay) return;

    function openMenu() {
        mobileMenu.classList.add("active");
        menuToggle.classList.add("active");
        overlay.classList.add("active");
    }

    function closeMenu() {
        mobileMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        overlay.classList.remove("active");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
});
