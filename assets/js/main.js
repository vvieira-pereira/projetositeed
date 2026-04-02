document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       MENU MOBILE E OVERLAY
       ========================= */
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".mobile-menu a, .mobile-menu .nav-menu a");

    const closeMenu = () => {
        if (menuToggle) menuToggle.classList.remove("active");
        if (mobileMenu) mobileMenu.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    };

    if (menuToggle && mobileMenu && overlay) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", closeMenu);
    }

    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            // Fechar menu ao clicar num link
            link.addEventListener("click", () => {
                closeMenu();

                // Remove classe ativa de outros links e adiciona ao atual
                document.querySelectorAll('.mobile-menu .nav-menu a').forEach(a => a.classList.remove('menu-active'));
                link.classList.add('menu-active');
            });

            // Tratamento tátil de hover (mobile)
            link.addEventListener('touchstart', () => {
                document.querySelectorAll('.mobile-menu .nav-menu a').forEach(a => a.classList.remove('touch-hover'));
                link.classList.add('touch-hover');
            });

            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.classList.remove('touch-hover');
                }, 150);
            });
        });
    }

    /* =========================
       CARROSSEL INFINITO
       ========================= */
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-track img");

    if (track && slides.length > 0) {
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
    }

    /* =========================
       MODAL DE PROJETOS
       ========================= */
    const projectCards = document.querySelectorAll(".project-card");
    const modalOverlay = document.getElementById("project-modal");

    if (projectCards.length > 0 && modalOverlay) {
        const modalImg = document.getElementById("project-modal-img");
        const modalTitle = document.getElementById("project-modal-title");
        const modalDesc = document.getElementById("project-modal-desc");
        const modalClose = document.querySelector(".project-modal-close");

        // Abre o modal ao clicar no cartão
        projectCards.forEach(card => {
            card.addEventListener("click", () => {
                const img = card.querySelector("img").src;
                const title = card.querySelector("h3").innerText;
                const desc = card.querySelector("p").innerText;

                modalImg.src = img;
                modalTitle.innerText = title;
                modalDesc.innerText = desc;

                modalOverlay.classList.add("active");
                document.body.style.overflow = "hidden"; // trava rolagem
            });
        });

        const fechaModal = () => {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = ""; // volta rolagem

            setTimeout(() => {
                modalImg.src = "";
                modalTitle.innerText = "";
                modalDesc.innerText = "";
            }, 300);
        };

        // Fechar ao clicar no botao
        if (modalClose) {
            modalClose.addEventListener("click", fechaModal);
        }

        // Fechar ao clicar fora do conteudo
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                fechaModal();
            }
        });

        // Fechar ao apertar ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
                fechaModal();
            }
        });
    }

});
