document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos
    const menuToggle = document.querySelector(".menu-toggle");
    const menuList = document.querySelector("nav ul"); 
    
    // Só adiciona o evento se o botão existir no HTML
    if (menuToggle && menuList) {
        menuToggle.addEventListener("click", () => {
            menuList.classList.toggle("active");
            // Opcional: Animar ícone do menu
            menuToggle.classList.toggle("open");
        });

        // Fecha o menu ao clicar em um link
        const menuLinks = document.querySelectorAll("nav ul li a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuList.classList.remove("active");
                menuToggle.classList.remove("open");
            });
        });
    }
});

