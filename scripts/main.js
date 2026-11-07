/* KurskPC — минимальный интерактив (мобильное меню, скролл, FAQ, цели) */

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
      if (currentScrollY <= 0) {
        header?.classList.remove("header-hidden");
      } else if (currentScrollY > 120 && (currentScrollY - lastScrollY > 8)) {
        header?.classList.add("header-hidden");
      } else if (lastScrollY - currentScrollY > 8) {
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
    burger?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  burger?.addEventListener("click", () => toggleMenu());
  backdrop?.addEventListener("click", () => toggleMenu(false));

  // Закрытие меню при клике по ссылкам
  nav?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => toggleMenu(false));
  });

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  // Сброс блокировки скролла при ресайзе выше 768px
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && nav?.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  // Плавный скролл с компенсацией высоты прилипающей шапки (76px)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // FAQ accordion с поддержкой доступности
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("open");
        i.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Мобильный аккордеон для прайс-листа с поддержкой клавиатуры
  document.querySelectorAll(".price-card").forEach(card => {
    const toggleCard = () => {
      if (window.innerWidth <= 768) {
        const isOpen = card.classList.toggle("open");
        card.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    };
    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          toggleCard();
        }
      }
    });
  });

  // Отправка целей в Яндекс.Метрику при кликах на контакты
  document.querySelectorAll("[data-ym-goal]").forEach(el => {
    el.addEventListener("click", () => {
      const goal = el.getAttribute("data-ym-goal");
      if (goal && typeof window.ym === "function") {
        window.ym(114042643, "reachGoal", goal);
      }
    });
  });
});
