import { throttle } from '../functions/throttle';

const fixFullheight = () => {
  const headerHeight = document?.querySelector('.header').offsetHeight;
  let vh = window.innerHeight;

  document.documentElement.style.setProperty('--vh', `calc(${vh}px - ${headerHeight}px`);
};

let fixHeight = throttle(fixFullheight);

fixHeight();

window.addEventListener('resize', fixHeight);
