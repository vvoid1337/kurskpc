/* KurskPC Lab — минимальный интерактив (мобильное меню, скролл, FAQ) */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("navBackdrop");

  // Умная шапка: скрывается при скролле вниз, плавно появляется при скролле вверх
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Тень шапки при отрыве от самого верха
    header?.classList.toggle("scrolled", currentScrollY > 20);

    // Скрытие шапки на мобильных устройствах при скролле вниз (если меню закрыто)
    if (window.innerWidth <= 768 && !nav?.classList.contains("open")) {
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        header?.classList.add("header-hidden");
      } else {
        header?.classList.remove("header-hidden");
      }
    } else {
      header?.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // Функция переключения меню
  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    backdrop?.classList.toggle("active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  burger?.addEventListener("click", () => toggleMenu());
  backdrop?.addEventListener("click", () => toggleMenu(false));

  // Закрытие меню при клике по ссылкам
  nav?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => toggleMenu(false));
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Мобильный аккордеон для прайс-листа
  document.querySelectorAll(".price-card").forEach(card => {
    card.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        card.classList.toggle("open");
      }
    });
  });
});
