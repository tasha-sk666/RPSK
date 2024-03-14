import _vars from '../_vars.js';
import Swiper from 'swiper/bundle';

const heroSliderSpeed = 3000;
document.body.style.setProperty('--hero-slider-speed', heroSliderSpeed + 'ms');

const heroSlider = new Swiper(_vars.heroSliderEl, {
  slidesPerView: 1,
  loop: true,
  navigation: {
    nextEl: '.hero__next',
    prevEl: '.hero__prev',
  },
  speed: 1000,
  autoplay: {
    delay: heroSliderSpeed,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  pagination: {
    el: '.hero__pagination',
    type: 'bullets',
    clickable: true
  },
  on: {
    init: function () {
      const paginationBullets = document.querySelectorAll('.hero__pagination .swiper-pagination-bullet');

      paginationBullets.forEach(el => {
        el.innerHTML = `<span class="hero__bar"></span>`;
      });
    },
  },
});

const serviceSliderNav = new Swiper(_vars.serviceSliderNavEl, {
  freeMode: true,
  scrollbar: {
    el: '.service-nav__scrollbar',
    draggable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 5,
      direction: 'vertical',
      spaceBetween: 20,
    },
    320: {
      direction: 'horizontal',
      freeMode: false,
      slidesPerView: 1,
      spaceBetween: 15,
    },
  }
});

const serviceSlider = new Swiper(_vars.serviceSliderEl, {
  initialSlide: 0,
  spaceBetween: 20,
  mousewheel: true,
  grabCursor: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  thumbs: {
    swiper: serviceSliderNav
  },
});

serviceSlider.on('slideChangeTransitionEnd', function () {
  let idx = serviceSlider.activeIndex;
  serviceSliderNav.slideTo(idx);
});

serviceSliderNav.on('slideChangeTransitionEnd', function () {
  let idx = serviceSliderNav.activeIndex;
  serviceSlider.slideTo(idx);
});
