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

  // ==== Интерактивный калькулятор стоимости (SEO & Поведенческие факторы) ====
  const calcData = {
    pc: {
      name: "Компьютер (ПК)",
      problems: [
        {
          id: "pc_clean",
          name: "Комплексная чистка от пыли + замена термопасты CPU",
          price: "1 000 – 1 300 ₽",
          time: "40–60 минут",
          materials: "Arctic MX-4 включена, продувка компрессором, тест в OCCT",
          warranty: "30 дней"
        },
        {
          id: "pc_ssd",
          name: "Ускорение ПК (установка SSD + чистая Windows 10/11 + перенос файлов)",
          price: "1 500 ₽",
          time: "1.5–2 часа",
          materials: "Монтаж SSD, сохранение данных, пакет драйверов и программ",
          warranty: "30 дней"
        },
        {
          id: "pc_diag",
          name: "Обслуживание видеокарты (GPU) или диагностика неисправности",
          price: "1 000 – 1 500 ₽ (диагностика 500 ₽ при отказе)",
          time: "40–90 минут",
          materials: "Очистка радиатора, замена термопасты чипа, прокладки VRAM/VRM по прайсу",
          warranty: "30 дней"
        },
        {
          id: "pc_build",
          name: "Сборка ПК на заказ / модульная замена деталей",
          price: "2 400 ₽ (модульная замена 200–500 ₽)",
          time: "2.5–3.5 часа",
          materials: "Кабель-менеджмент, обновление BIOS, XMP, установка ОС и стресс-тест",
          warranty: "60 дней"
        },
        {
          id: "pc_tune",
          name: "Тонкая настройка: андервольтинг GPU/CPU, разгон (DRAM + Curve)",
          price: "1 000 – 2 000 ₽",
          time: "40 мин – 3 часа",
          materials: "Снижение шума и температур на 7–15°C без потери производительности",
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
          price: "1 500 – 2 000 ₽",
          time: "1.5–2 часа",
          materials: "Honeywell PTM7950 с высоким прижимом, ревизия термопрокладок VRM",
          warranty: "30 дней"
        },
        {
          id: "lap_std",
          name: "Чистка стандартного ноутбука с заменой термоинтерфейса",
          price: "1 200 – 1 600 ₽",
          time: "1–1.5 часа",
          materials: "Удаление пылевого войлока с радиатора, чистка кулера, PTM7950",
          warranty: "30 дней"
        },
        {
          id: "lap_slow",
          name: "Комплекс «Второе дыхание» (монтаж SSD + Windows 10/11 + софт)",
          price: "1 500 ₽",
          time: "1.5–2 часа",
          materials: "SSD отдельно, установка ОС, перенос фото и документов со старого диска",
          warranty: "30 дней"
        },
        {
          id: "lap_win",
          name: "Установка Windows 10/11 с драйверами или удаление вирусов",
          price: "500 – 900 ₽",
          time: "40–80 минут",
          materials: "Драйверы, базовый софт и оптимизация без накруток / очистка от майнеров",
          warranty: "14–30 дней"
        },
        {
          id: "lap_fan",
          name: "Замена / смазка шумящего кулера ноутбука",
          price: "400 ₽",
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
          price: "1 100 – 1 400 ₽",
          time: "1–1.5 часа",
          materials: "Винты Torx Security, продувка радиатора, PTM7950 на APU, прокладки GDDR5",
          warranty: "60 дней"
        },
        {
          id: "con_xbox",
          name: "Полное ТО Xbox One / Series S / Series X",
          price: "1 100 – 2 000 ₽",
          time: "1–2 часа",
          materials: "Очистка испарительной камеры и турбины, Honeywell PTM7950 на APU",
          warranty: "60 дней"
        },
        {
          id: "con_ps5",
          name: "Профилактика PlayStation 5 (пылеуловители и кулер без вскрытия ЖМ)",
          price: "500 ₽",
          time: "40–60 минут",
          materials: "Снятие панелей, очистка сопел пылесборников, продувка теплообменника",
          warranty: "30 дней"
        },
        {
          id: "con_ssd",
          name: "Замена стандартного HDD в PS4 / Xbox на быстрый SSD",
          price: "900 ₽",
          time: "40–60 минут",
          materials: "Монтаж SSD 2.5\", установка свежей прошивки через официальный Recovery",
          warranty: "90 дней"
        },
        {
          id: "con_hen",
          name: "Прошивка / активация HEN / GoldHEN (PS4 / PS5)",
          price: "900 ₽",
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
