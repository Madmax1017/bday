/* ===========================================================
   LOADER MODULE
   =========================================================== */
const Loader = (() => {
  function init(onComplete) {
    const loader = document.getElementById('loader');
    const minTime = 1800;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minTime - elapsed);
      setTimeout(() => {
        if (window.gsap) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
              loader.classList.add('is-hidden');
              loader.style.display = 'none';
              if (onComplete) onComplete();
            },
          });
        } else {
          loader.style.transition = 'opacity .9s ease';
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            if (onComplete) onComplete();
          }, 900);
        }
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
      // safety fallback
      setTimeout(finish, 4000);
    }
  }

  return { init };
})();
