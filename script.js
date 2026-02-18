const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const navLinks = document.querySelectorAll('#site-nav a');

if (header && menuToggle && siteNav) {
  const closeMenu = () => {
    header.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

const skillCards = Array.from(document.querySelectorAll('#habilidades .tarjeta'));
const skillsMobileMq = window.matchMedia('(max-width: 768px)');

if (skillCards.length) {
  const syncSkillAria = () => {
    skillCards.forEach((card) => {
      const title = card.querySelector('h3');
      if (!title) return;
      title.setAttribute('aria-expanded', String(card.classList.contains('is-open')));
    });
  };

  const toggleSkillCard = (targetCard) => {
    if (!skillsMobileMq.matches) return;
    skillCards.forEach((card) => {
      if (card === targetCard) {
        card.classList.toggle('is-open');
      } else {
        card.classList.remove('is-open');
      }
    });
    syncSkillAria();
  };

  const initSkillsAccordion = () => {
    skillCards.forEach((card) => {
      const title = card.querySelector('h3');
      if (!title) return;

      if (!card.dataset.accBound) {
        title.addEventListener('click', () => toggleSkillCard(card));
        title.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleSkillCard(card);
          }
        });
        card.dataset.accBound = '1';
      }

      if (skillsMobileMq.matches) {
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
      } else {
        card.classList.remove('is-open');
        title.removeAttribute('role');
        title.removeAttribute('tabindex');
        title.removeAttribute('aria-expanded');
      }
    });
    if (skillsMobileMq.matches) syncSkillAria();
  };

  initSkillsAccordion();
  window.addEventListener('resize', initSkillsAccordion);
}

const track = document.querySelector('.carousel__track');
const nav = document.querySelector('.carousel__nav');
const nextBtn = document.querySelector('.carousel__button.next');
const prevBtn = document.querySelector('.carousel__button.prev');

if (!track || !nav || !nextBtn || !prevBtn) {
  console.warn("Carrusel: falta algún elemento en el HTML");
} else {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let timer = null;

  // Crear indicadores
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel__indicator');
    if (i === 0) dot.classList.add('is-selected');
    nav.appendChild(dot);

    dot.addEventListener('click', () => {
      moveToSlide(i);
      resetAuto();
    });
  });

  const dots = Array.from(nav.children);

  function moveToSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove('is-selected');
    dots[index].classList.add('is-selected');
    currentIndex = index;
  }

  nextBtn.addEventListener('click', () => {
    moveToSlide((currentIndex + 1) % slides.length);
    resetAuto();
  });

  prevBtn.addEventListener('click', () => {
    moveToSlide((currentIndex - 1 + slides.length) % slides.length);
    resetAuto();
  });

  function startAuto() {
    timer = setInterval(() => {
      moveToSlide((currentIndex + 1) % slides.length);
    }, 30000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  startAuto();
}
