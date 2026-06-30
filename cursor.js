/* ===========================================================
   CURSOR MODULE — glowing cursor + click hearts/sparkles
   =========================================================== */
const Cursor = (() => {
  let dot, glow;
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  function init() {
    dot = document.getElementById('cursorDot');
    glow = document.getElementById('cursorGlow');
    if (!dot || window.matchMedia('(max-width: 768px)').matches) return;

    window.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);
    document.querySelectorAll('a, button, .polaroid, .letter-closed, .jar, .letter-seal-open')
      .forEach(addHoverListeners);

    // re-bind hover targets that get injected later
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .polaroid, .letter-closed, .jar, .letter-seal-open')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .polaroid, .letter-closed, .jar, .letter-seal-open')) {
        document.body.classList.remove('cursor-hover');
      }
    });

    raf();
  }

  function addHoverListeners(el) {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    }
  }

  function raf() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    if (glow) {
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
    }
    requestAnimationFrame(raf);
  }

  function onClick(e) {
    spawnBurst(e.clientX, e.clientY);
  }

  function spawnBurst(x, y) {
    const symbols = ['❤', '✨', '♥', '✦'];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'click-fx';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.color = Math.random() > 0.5 ? '#E384A9' : '#CDA45E';
      document.body.appendChild(el);

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 40 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 20;

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 1, scale: 0.4, x: 0, y: 0 },
          {
            opacity: 0,
            scale: 1 + Math.random() * 0.6,
            x: dx,
            y: dy,
            duration: 0.9 + Math.random() * 0.4,
            ease: 'power2.out',
            onComplete: () => el.remove(),
          }
        );
      } else {
        setTimeout(() => el.remove(), 900);
      }
    }
  }

  return { init };
})();
