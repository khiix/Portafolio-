const MOBILE_BREAKPOINT = 768;
const CAROUSEL_INTERVAL_MS = 30000;

const query = (selector, root = document) => root.querySelector(selector);
const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function initMobileMenu() {
  const header = query("header");
  const menuToggle = query(".menu-toggle");
  const siteNav = query("#site-nav");

  if (!header || !menuToggle || !siteNav) return;

  const navLinks = queryAll("a", siteNav);

  const closeMenu = () => {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
  });
}

function initSkillsAccordion() {
  const skillCards = queryAll("#habilidades .tarjeta");
  if (!skillCards.length) return;

  const mobileMq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const getTitle = (card) => query("h3", card);

  const syncAria = () => {
    skillCards.forEach((card) => {
      const title = getTitle(card);
      if (!title) return;
      title.setAttribute("aria-expanded", String(card.classList.contains("is-open")));
    });
  };

  const toggleCard = (targetCard) => {
    if (!mobileMq.matches) return;

    skillCards.forEach((card) => {
      if (card === targetCard) {
        card.classList.toggle("is-open");
      } else {
        card.classList.remove("is-open");
      }
    });

    syncAria();
  };

  const bindCard = (card) => {
    if (card.dataset.accBound) return;

    const title = getTitle(card);
    if (!title) return;

    title.addEventListener("click", () => toggleCard(card));
    title.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleCard(card);
    });

    card.dataset.accBound = "1";
  };

  const applyMode = () => {
    skillCards.forEach((card) => {
      bindCard(card);
      const title = getTitle(card);
      if (!title) return;

      if (mobileMq.matches) {
        title.setAttribute("role", "button");
        title.setAttribute("tabindex", "0");
      } else {
        card.classList.remove("is-open");
        title.removeAttribute("role");
        title.removeAttribute("tabindex");
        title.removeAttribute("aria-expanded");
      }
    });

    if (mobileMq.matches) syncAria();
  };

  applyMode();
  window.addEventListener("resize", applyMode);
}

function initProjectsCarousel() {
  const track = query(".carousel__track");
  const nav = query(".carousel__nav");
  const nextBtn = query(".carousel__button.next");
  const prevBtn = query(".carousel__button.prev");

  if (!track || !nav || !nextBtn || !prevBtn) {
    console.warn("Carrusel: falta algún elemento en el HTML");
    return;
  }

  const slides = Array.from(track.children);
  if (!slides.length) return;

  let currentIndex = 0;
  let timerId = null;

  const moveToSlide = (index, dots) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove("is-selected");
    dots[index].classList.add("is-selected");
    currentIndex = index;
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel__indicator");
    if (index === 0) dot.classList.add("is-selected");
    nav.appendChild(dot);
  });

  const dots = Array.from(nav.children);

  const goNext = () => moveToSlide((currentIndex + 1) % slides.length, dots);
  const goPrev = () => moveToSlide((currentIndex - 1 + slides.length) % slides.length, dots);

  const startAuto = () => {
    timerId = setInterval(goNext, CAROUSEL_INTERVAL_MS);
  };

  const resetAuto = () => {
    clearInterval(timerId);
    startAuto();
  };

  nextBtn.addEventListener("click", () => {
    goNext();
    resetAuto();
  });

  prevBtn.addEventListener("click", () => {
    goPrev();
    resetAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      moveToSlide(index, dots);
      resetAuto();
    });
  });

  startAuto();
}

function boot() {
  initMobileMenu();
  initSkillsAccordion();
  initProjectsCarousel();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
