const scrollBtn = document.querySelector('[data-scroll-top]');

if (scrollBtn) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hiddenBtn = () => {
    const top = Math.round(window.pageYOffset);

    if (top < 600) {
      scrollBtn.classList.remove('scroll-top--visible')
    } else {
      scrollBtn.classList.add('scroll-top--visible')
    }
  }

  window.addEventListener('scroll', hiddenBtn);
  scrollBtn.addEventListener('click', () => scrollToTop());
}
