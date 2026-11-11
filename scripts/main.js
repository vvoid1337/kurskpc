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

  // Сброс блокировки скролла при ресайзе выше 1220px
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1220 && nav?.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  // Плавный скролл с компенсацией высоты прилипающей шапки (76px)
  const isHomePage = location.pathname === "/" || location.pathname === "/index.html";
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "/#") return;
      if (href.startsWith("/#") && !isHomePage) return;
      const id = href.startsWith("/#") ? href.slice(1) : href;
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

  // ==== Согласие на cookie и отложенный запуск Яндекс.Метрики (без Вебвизора) ====
  const METRIKA_ID = 114042643;
  const CONSENT_KEY = "kurskpc_cookie_consent";
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
  const cookieDeclineBtn = document.getElementById("cookieDeclineBtn");
  const cookieSettingsBtn = document.getElementById("cookieSettingsBtn");

  let metrikaLoaded = false;

  const getConsent = () => {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch {
      return null;
    }
  };

  const setConsent = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Игнорируем ошибку в режиме ограниченного хранилища
    }
  };

  const clearMetrikaCookies = () => {
    const cookies = document.cookie.split(";");
    const hostParts = location.hostname.split(".");
    const domains = [location.hostname];
    if (hostParts.length >= 2) {
      domains.push("." + hostParts.slice(-2).join("."));
    }
    cookies.forEach(c => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("_ym_")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        domains.forEach(d => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
        });
      }
    });
  };

  const loadYandexMetrika = () => {
    if (metrikaLoaded) return;
    metrikaLoaded = true;

    (function(m, e, t, r, i, k, a) {
      m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`, "ym");

    window.ym(METRIKA_ID, "init", {
      ssr: true,
      webvisor: false,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  };

  const showCookieBanner = () => {
    if (cookieBanner) cookieBanner.hidden = false;
  };

  const hideCookieBanner = () => {
    if (cookieBanner) cookieBanner.hidden = true;
  };

  const savedConsent = getConsent();
  if (savedConsent === "accepted") {
    loadYandexMetrika();
  } else if (savedConsent !== "declined") {
    showCookieBanner();
  }

  cookieAcceptBtn?.addEventListener("click", () => {
    setConsent("accepted");
    hideCookieBanner();
    loadYandexMetrika();
  });

  cookieDeclineBtn?.addEventListener("click", () => {
    const wasLoaded = metrikaLoaded;
    setConsent("declined");
    hideCookieBanner();
    if (wasLoaded) {
      clearMetrikaCookies();
    }
  });

  cookieSettingsBtn?.addEventListener("click", () => {
    showCookieBanner();
  });

  // Отправка целей в Яндекс.Метрику при кликах на контакты (только после согласия)
  document.querySelectorAll("[data-ym-goal]").forEach(el => {
    el.addEventListener("click", () => {
      if (getConsent() !== "accepted") return;
      const goal = el.getAttribute("data-ym-goal");
      if (goal && typeof window.ym === "function") {
        window.ym(METRIKA_ID, "reachGoal", goal);
      }
    });
  });

  // ==== Интерактивный калькулятор стоимости (SEO & Поведенческие факторы) ====
  const calcData = {
    pc: {
      name: "Компьютер (ПК)",
      problems: [
        {
          id: "pc_clean",
          name: "Комплексная чистка от пыли + замена термопасты CPU",
          price: "1 500 – 1 800 ₽",
          time: "40–60 минут",
          materials: "Arctic MX-4 включена, продувка компрессором, тест в OCCT",
          warranty: "30 дней"
        },
        {
          id: "pc_ssd",
          name: "Ускорение ПК (установка SSD + чистая Windows 10/11 + перенос файлов)",
          price: "2 200 ₽",
          time: "1.5–2 часа",
          materials: "Монтаж SSD, сохранение данных, пакет драйверов и программ",
          warranty: "30 дней"
        },
        {
          id: "pc_diag",
          name: "Обслуживание видеокарты (GPU) или диагностика неисправности",
          price: "1 500 – 2 500 ₽ (диагностика 800 ₽ при отказе)",
          time: "40–90 минут",
          materials: "Очистка радиатора, замена пасты/PTM7950, прокладки VRAM/VRM отдельно",
          warranty: "30 дней"
        },
        {
          id: "pc_build",
          name: "Сборка ПК на заказ / модульная замена деталей",
          price: "3 500 – 5 000 ₽ (замена детали 500–1 000 ₽)",
          time: "2.5–3.5 часа",
          materials: "Кабель-менеджмент, обновление BIOS, XMP, установка ОС и стресс-тест",
          warranty: "60 дней"
        },
        {
          id: "pc_tune",
          name: "Тонкая настройка: андервольтинг GPU/CPU, ручной тюнинг таймингов DRAM",
          price: "1 500 – 4 500 ₽",
          time: "40 мин – 3 часа",
          materials: "Андервольтинг 1 500–2 000 ₽; ручной тюнинг таймингов DRAM + Curve 3 000–4 500 ₽",
          warranty: "30 дней / Стабильность"
        }
      ]
    },
    laptop: {
      name: "Ноутбук",
      problems: [
        {
          id: "lap_game",
          name: "Чистка игрового ноутбука с фазовым переходом Honeywell PTM7950",
          price: "2 500 – 3 500 ₽",
          time: "1.5–2 часа",
          materials: "Honeywell PTM7950 с высоким прижимом, ревизия термопрокладок VRM",
          warranty: "30 дней"
        },
        {
          id: "lap_std",
          name: "Чистка стандартного ноутбука с заменой термоинтерфейса",
          price: "1 600 – 2 200 ₽",
          time: "1–1.5 часа",
          materials: "Удаление пылевого войлока с радиатора, чистка кулера, PTM7950",
          warranty: "30 дней"
        },
        {
          id: "lap_slow",
          name: "Комплекс «Второе дыхание» (монтаж SSD + Windows 10/11 + софт)",
          price: "2 200 ₽",
          time: "1.5–2 часа",
          materials: "SSD отдельно, установка ОС, перенос фото и документов со старого диска",
          warranty: "30 дней"
        },
        {
          id: "lap_win",
          name: "Установка Windows 10/11 с драйверами или удаление вирусов",
          price: "1 000 – 1 500 ₽",
          time: "40–80 минут",
          materials: "Windows с драйверами 1 400 ₽ / удаление вирусов и майнеров 1 000–1 500 ₽",
          warranty: "14–30 дней"
        },
        {
          id: "lap_fan",
          name: "Замена / смазка шумящего кулера ноутбука",
          price: "700 ₽ (400 ₽ к чистке)",
          time: "20–30 минут",
          materials: "Смазка подшипника синтетическим маслом включена или замена вентилятора",
          warranty: "14 дней"
        }
      ]
    },
    console: {
      name: "Игровая приставка (PS & Xbox)",
      problems: [
        {
          id: "con_ps4",
          name: "Полное ТО PlayStation 4 (Fat / Slim / Pro) с нанесением Honeywell PTM7950",
          price: "1 800 – 2 400 ₽",
          time: "1–1.5 часа",
          materials: "Винты Torx Security, продувка радиатора, PTM7950 на APU, прокладки GDDR5",
          warranty: "60 дней"
        },
        {
          id: "con_xbox",
          name: "Полное ТО Xbox One / Series S / Series X",
          price: "1 800 – 3 000 ₽",
          time: "1–2 часа",
          materials: "One/Series S: 1 800–2 400 ₽; Series X: 2 500–3 000 ₽, Honeywell PTM7950",
          warranty: "60 дней"
        },
        {
          id: "con_ps5",
          name: "Профилактика PlayStation 5 (пылеуловители и кулер без вскрытия ЖМ)",
          price: "1 000 – 1 200 ₽",
          time: "40–60 минут",
          materials: "Снятие панелей, очистка сопел пылесборников, продувка теплообменника",
          warranty: "30 дней"
        },
        {
          id: "con_ssd",
          name: "Замена стандартного HDD в PS4 / Xbox на быстрый SSD",
          price: "1 200 ₽",
          time: "40–60 минут",
          materials: "Монтаж SSD 2.5\", установка свежей прошивки через официальный Recovery",
          warranty: "90 дней"
        },
        {
          id: "con_hen",
          name: "Прошивка / активация HEN / GoldHEN (PS4 / PS5)",
          price: "1 200 ₽",
          time: "40–80 минут",
          materials: "Настройка хоста, запуск игр с внешнего диска, инструктаж",
          warranty: "Консультация"
        }
      ]
    }
  };

  const devButtons = document.querySelectorAll(".calc-dev-btn");
  const problemsContainer = document.getElementById("calcProblems");
  const priceDisplay = document.getElementById("calcPrice");
  const timeDisplay = document.getElementById("calcTime");
  const matsDisplay = document.getElementById("calcMats");
  const warrantyDisplay = document.getElementById("calcWarranty");
  const tgBtn = document.getElementById("calcTgBtn");

  let currentDevice = "pc";
  let currentProblemIndex = 0;

  const renderCalculator = () => {
    if (!problemsContainer) return;
    const devData = calcData[currentDevice];
    if (!devData) return;

    problemsContainer.innerHTML = "";
    devData.problems.forEach((prob, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `calc-prob-btn ${idx === currentProblemIndex ? "active" : ""}`;
      btn.setAttribute("aria-pressed", idx === currentProblemIndex ? "true" : "false");
      btn.innerHTML = `
        <span>${prob.name}</span>
        <span class="prob-indicator"></span>
      `;
      btn.addEventListener("click", () => {
        currentProblemIndex = idx;
        renderCalculator();
      });
      problemsContainer.appendChild(btn);
    });

    const activeProb = devData.problems[currentProblemIndex] || devData.problems[0];
    if (priceDisplay) priceDisplay.textContent = activeProb.price;
    if (timeDisplay) timeDisplay.textContent = activeProb.time;
    if (matsDisplay) matsDisplay.textContent = activeProb.materials;
    if (warrantyDisplay) warrantyDisplay.textContent = activeProb.warranty;

    if (tgBtn) {
      const text = encodeURIComponent(`Здравствуйте! Рассчитал на сайте kurskpc.ru:
Устройство: ${devData.name}
Услуга: ${activeProb.name}
Ориентир стоимости: ${activeProb.price}
Хочу вызвать мастера.`);
      tgBtn.href = `https://t.me/kurskpc?text=${text}`;
    }
  };

  devButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const dev = btn.getAttribute("data-device");
      if (dev && calcData[dev]) {
        currentDevice = dev;
        currentProblemIndex = 0;
        devButtons.forEach(b => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        renderCalculator();
      }
    });
  });

  renderCalculator();
});
