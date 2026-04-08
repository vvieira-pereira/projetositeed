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
                const desc = card.dataset.desc || "";

                modalImg.src = img;
                modalImg.classList.remove("zoomed"); // garante zoom zerado
                modalTitle.innerText = title;
                modalDesc.innerText = desc;

                modalOverlay.classList.add("active");
                document.body.style.overflow = "hidden";

                if (window._resetModalZoom) window._resetModalZoom();
                setTimeout(() => {
                    if (window.innerWidth <= 768 && window._setMobileZoom) {
                        window._setMobileZoom();
                    }
                }, 50);
            });
        });

        // ── PAN + ZOOM ENGINE ──────────────────────────────────────
        if (modalImg) {
            let scale = 1;
            let originX = 50; // % dentro da imagem
            let originY = 50;
            let isDragging = false;
            let startX, startY, lastTranslateX = 0, lastTranslateY = 0;
            let translateX = 0, translateY = 0;

            const MIN_SCALE = 1;
            const MAX_SCALE = 4;
            const ZOOM_STEP = 0.35;

            function applyTransform() {
                modalImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
                modalImg.style.cursor = scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in";
            }

            function resetZoom() {
                scale = 1;
                translateX = 0;
                translateY = 0;
                lastTranslateX = 0;
                lastTranslateY = 0;
                modalImg.style.transform = "";
                modalImg.style.cursor = "zoom-in";
            }

            // Scroll do mouse = zoom centrado no cursor
            modalImg.addEventListener("wheel", (e) => {
                e.preventDefault();
                const rect = modalImg.getBoundingClientRect();
                // posição do cursor dentro da imagem em %
                const cursorX = ((e.clientX - rect.left) / rect.width - 0.5);
                const cursorY = ((e.clientY - rect.top) / rect.height - 0.5);

                const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
                const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));

                if (newScale === scale) return;

                // ajusta translação para manter o ponto sob o cursor fixo
                translateX -= cursorX * (newScale - scale) * rect.width / scale;
                translateY -= cursorY * (newScale - scale) * rect.height / scale;
                scale = newScale;

                if (scale === MIN_SCALE) { translateX = 0; translateY = 0; }
                lastTranslateX = translateX;
                lastTranslateY = translateY;
                applyTransform();
            }, { passive: false });

            let hasDragged = false; // flag para distinguir drag de click

            // Drag para navegar (mouse) — ANTES do click para a flag funcionar
            modalImg.addEventListener("mousedown", (e) => {
                if (scale <= 1) return;
                e.preventDefault();
                isDragging = true;
                hasDragged = false;
                startX = e.clientX;
                startY = e.clientY;
                applyTransform();
            });

            window.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
                translateX = lastTranslateX + dx / scale;
                translateY = lastTranslateY + dy / scale;
                applyTransform();
            });

            window.addEventListener("mouseup", () => {
                if (!isDragging) return;
                isDragging = false;
                lastTranslateX = translateX;
                lastTranslateY = translateY;
                applyTransform();
            });

            // Click simples = zoom 2x no ponto clicado | zoom off se já ampliada
            // Só age se NÃO foi um drag
            modalImg.addEventListener("click", (e) => {
                e.stopPropagation();
                if (hasDragged) { hasDragged = false; return; } // ignorar cliques que eram drag
                if (scale > 1) {
                    resetZoom();
                } else {
                    const rect = modalImg.getBoundingClientRect();
                    const cx = ((e.clientX - rect.left) / rect.width - 0.5);
                    const cy = ((e.clientY - rect.top) / rect.height - 0.5);
                    scale = 2;
                    translateX = -cx * rect.width / 2;
                    translateY = -cy * rect.height / 2;
                    lastTranslateX = translateX;
                    lastTranslateY = translateY;
                    applyTransform();
                }
            });

            // Touch: pinch para zoom + drag com 1 dedo
            let lastDist = null;
            let touchStartX, touchStartY;

            modalImg.addEventListener("touchstart", (e) => {
                if (e.touches.length === 2) {
                    lastDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                } else if (e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    hasDragged = false;
                    if (scale > 1) {
                        isDragging = true;
                        startX = touchStartX;
                        startY = touchStartY;
                    }
                }
            }, { passive: true });

            modalImg.addEventListener("touchmove", (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    hasDragged = true;
                    const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    if (lastDist) {
                        const delta = (dist - lastDist) * 0.02;
                        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
                        if (scale <= MIN_SCALE) { scale = MIN_SCALE; translateX = 0; translateY = 0; }
                        lastTranslateX = translateX;
                        lastTranslateY = translateY;
                        applyTransform();
                    }
                    lastDist = dist;
                } else if (e.touches.length === 1 && isDragging) {
                    e.preventDefault();
                    const dx = e.touches[0].clientX - startX;
                    const dy = e.touches[0].clientY - startY;
                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
                    translateX = lastTranslateX + dx / scale;
                    translateY = lastTranslateY + dy / scale;
                    applyTransform();
                }
            }, { passive: false });

            modalImg.addEventListener("touchend", () => {
                lastDist = null;
                if (isDragging) {
                    isDragging = false;
                    lastTranslateX = translateX;
                    lastTranslateY = translateY;
                }
            });

            // Expõe reset para ser chamado ao fechar
            window._resetModalZoom = resetZoom;

            window._setMobileZoom = function() {
                scale = 2.3; // Aproxima a foto cortando as bordas brancas nativas
                translateX = 0;
                translateY = 0;
                lastTranslateX = 0;
                lastTranslateY = 0;
                applyTransform();
            };


        }
        // ── FIM PAN + ZOOM ENGINE ───────────────────────────────────


        const fechaModal = () => {
            if (window._resetModalZoom) window._resetModalZoom();
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "";

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
