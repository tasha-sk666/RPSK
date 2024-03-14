import _vars from '../_vars.js';
import GraphModal from 'graph-modal';
import Swiper from 'swiper/bundle';

const projectList = document.querySelector('.project__items .swiper-wrapper');
const cardModal = document.querySelector('[data-graph-target="card-modal"] .graph-modal__content');
const cardModalMainTitle = document.querySelector('.modal-card__title');
const cardModalSlider = document.querySelector('.modal-card__slider');
const cardModalSliderWrapper = document.querySelector('.modal-card__slider .swiper-wrapper');
const cardModalPreview = document.querySelector('.modal-preview');
const cardModalInfo = document.querySelector('.modal-card__info');
const cardModalDescr = document.querySelector('.modal-descr__list');
let dataLength = null;
let modal = null;

const cardSlider = new Swiper(cardModalSlider, {
  slidesPerView: 1,
  spaceBetween: 20,
  grabCursor: true,
  navigation: {
    nextEl: '.modal-card__next',
    prevEl: '.modal-card__prev',
  },
});

const projectSlider = new Swiper(_vars.projectSliderEl, {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: '.project__next',
    prevEl: '.project__prev',
  },
  pagination: {
    el: ".project__pagination",
    type: "fraction",
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
      spaceBetween: 20
    },
    576: {
      slidesPerView: 2,
      spaceBetween: 20
    },
  }
});

if (projectList) {
  const loadProjects = () => {
    fetch('../data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;
        projectList.innerHTML = '';

        for (let i = 0; i < dataLength; i++) {
          let item = data[i]
          
          projectList.innerHTML += `
          <div class="swiper-slide">
            <div class="project-item">
              <div class="project-item__image">
                <img src="${item.mainImage}" alt="${item.title}" class="project-item__image">
              </div>
              <div class="project-item__content">
                <h3 class="project-item__title">${item.title}</h3>
                ${item.place === undefined ? '' : `<p class="project-item__descr">${item.place}</p>`}
                <button class="project-item__btn btn btn--stroke btn--stroke-accent btn-reset" data-graph-path="card-modal" data-id="${item.id}">подробнее</button>
              </div>
            </div>
          </div>
        `
        }

        projectSlider.update();
      })
      .then(() => {
        const projectBtns = document.querySelectorAll('.project-item__btn');

        projectBtns.forEach(el => {
          el.addEventListener('click', () => {
            cardSlider.update();
            cardSlider.slideTo(0);
          })

          el.addEventListener('focus', (e) => {
            e.currentTarget.classList.add('project-item__btn--active');
          }, true);

          el.addEventListener('blur', (e) => {
            e.currentTarget.classList.remove('project-item__btn--active');
          }, true);
        });

        modal = new GraphModal({
          isOpen: (modal) => {
            if (modal.modalContainer.classList.contains('modal-card')) {
              const openBtnId = modal.previousActiveElement.dataset.id;

              loadModalData(openBtnId);
              cardSlider.update();
            }
          },
        });
      })
  };

  loadProjects();

  const loadModalData = (id = 1) => {
    fetch('../data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        cardModalMainTitle.innerHTML = ''
        cardModalSliderWrapper.innerHTML = '';
        cardModalPreview.innerHTML = '';
        cardModalInfo.innerHTML = '';
        cardModalDescr.innerHTML = '';

        for (let dataItem of data) {
          if (dataItem.id == id) {

            cardModalMainTitle.textContent = dataItem.title.trim('');

            const slides = dataItem.gallery.map((image, idx) => {
              return `
              <div class="swiper-slide modal-card__slide" data-index="${idx}">
                <div class="modal-card__image">
                  <img src="${image}" alt="">
                </div>
              </div>
            `;
            });

            const preview = dataItem.gallery.map((image, idx) => {
              return `
                <div class="modal-preview__item ${idx === 0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${idx}">
                  <img src="${image}" alt="">
                </div>
              `;
            });

            const descrItems = dataItem.description.map((item) => {
              return `
              <li class="main-list__item modal-descr__item">${item}</li>
            `;
            })

            let infoItems = '';

            Object.keys(dataItem.info).forEach(function eachKey(key) {
              infoItems += `
              <li class="modal-info__item">
                <div class="modal-info__title">${key}</div>
                <div class="modal-info__descr">${dataItem.info[key]}</div>
              </li>
              `
            });

            cardModalSliderWrapper.innerHTML = slides.join('');
            cardModalPreview.innerHTML = preview.join('');
            cardModalDescr.innerHTML = descrItems.join('');
            cardModalInfo.innerHTML = infoItems;
          };
        };
      })
      .then(() => {
        cardSlider.update();

        cardSlider.on('slideChangeTransitionEnd', function () {
          let idx = cardSlider.activeIndex;
          document.querySelectorAll('.modal-preview__item').forEach(el => { el.classList.remove('modal-preview__item--active') });
          document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
        });

        document.querySelectorAll('.modal-preview__item').forEach(el => {
          el.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            document.querySelectorAll('.modal-preview__item').forEach(el => { el.classList.remove('modal-preview__item--active'); });
            e.currentTarget.classList.add('modal-preview__item--active');
            cardSlider.slideTo(idx);
          });
        });
      });
  };
};

