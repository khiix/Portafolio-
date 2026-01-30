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
