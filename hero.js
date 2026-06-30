/* ===========================================================
   HERO MODULE
   =========================================================== */
const Hero = (() => {
  function playIntro() {
    if (!window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.1)
      .from('.eyebrow', { y: 16, duration: 0.8 }, 0.1)
      .to('.hero-title', { opacity: 1, duration: 1.1 }, 0.3)
      .from('.hero-title', { y: 40, duration: 1.1 }, 0.3)
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.9 }, 0.7)
      .from('.hero-subtitle', { y: 20, duration: 0.9 }, 0.7)
      .to('.begin-btn', { opacity: 1, y: 0, duration: 0.9 }, 0.95)
      .from('.begin-btn', { y: 20, duration: 0.9 }, 0.95)
      .to('.scroll-hint', { opacity: 1, duration: 0.8 }, 1.3);
  }

  function bindBeginButton() {
    const btn = document.getElementById('beginBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      startMusic();

      // brief flash/fade transition
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:fixed;inset:0;z-index:8000;background:#FBF4ED;
        opacity:0;pointer-events:none;
      `;
      document.body.appendChild(flash);

      if (window.gsap) {
        gsap.timeline()
          .to(flash, { opacity: 0.55, duration: 0.35, ease: 'power1.in' })
          .to(flash, {
            opacity: 0, duration: 0.55, ease: 'power1.out',
            onComplete: () => flash.remove(),
          });
      } else {
        flash.remove();
      }

      SmoothScroll.scrollTo('#letter', { offset: 0 });
    });
  }

  function startMusic() {
    const audio = document.getElementById('bgMusic');
    if (!audio || !audio.src) return; // no track wired yet — Part 2
    audio.volume = 0.5;
    audio.play().catch(() => {/* autoplay restrictions — silently ignore */});
  }

  function init() {
    playIntro();
    bindBeginButton();
  }

  return { init };
})();
