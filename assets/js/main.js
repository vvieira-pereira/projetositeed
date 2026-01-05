document.addEventListener("DOMContentLoaded", () => {

    // MENU MOBILE
    const menuToggle = document.querySelector(".menu-toggle");
    const menuList = document.querySelector("nav ul");

    if (menuToggle && menuList) {
        menuToggle.addEventListener("click", () => {
            menuList.classList.toggle("active");
            menuToggle.classList.toggle("open");
        });

        const menuLinks = document.querySelectorAll("nav ul li a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuList.classList.remove("active");
                menuToggle.classList.remove("open");
            });
        });
    }

});

/* GOOGLE TRANSLATE */
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'pt',
            autoDisplay: false
        },
        'google_translate_element'
    );
}

function translateTo(lang) {
    const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');

        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
            clearInterval(interval);
        }
    }, 100);
}

