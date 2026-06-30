/* ===========================================================
   BACKGROUND MODULE — floating petals + glowing particles
   =========================================================== */
const Background = (() => {
  function makePetal(field) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size = 10 + Math.random() * 16;
    const startX = Math.random() * 100;
    const duration = 14 + Math.random() * 12;
    const delay = Math.random() * -20;
    const colors = ['#F2A6C2', '#F7CBAE', '#DCD3F0', '#F8D9E3'];

    petal.style.width = size + 'px';
    petal.style.height = size * 0.8 + 'px';
    petal.style.left = startX + 'vw';
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];

    field.appendChild(petal);

    if (window.gsap) {
      gsap.set(petal, { rotation: Math.random() * 360 });
      gsap.to(petal, {
        y: '110vh',
        x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: `+=${180 + Math.random() * 360}`,
        duration,
        delay,
        repeat: -1,
        ease: 'none',
        onRepeat: () => {
          gsap.set(petal, { y: '-10vh', x: 0, left: Math.random() * 100 + 'vw' });
        },
      });
    }
  }

  function makeParticle(field) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = 2 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    field.appendChild(particle);

    if (window.gsap) {
      gsap.to(particle, {
        opacity: () => 0.2 + Math.random() * 0.6,
        y: `+=${(Math.random() - 0.5) * 60}`,
        x: `+=${(Math.random() - 0.5) * 60}`,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }
  }

  function init() {
    const petalsField = document.getElementById('petalsField');
    const particlesField = document.getElementById('particlesField');
    if (!petalsField || !particlesField) return;

    const petalCount = window.innerWidth < 768 ? 9 : 16;
    const particleCount = window.innerWidth < 768 ? 16 : 30;

    for (let i = 0; i < petalCount; i++) makePetal(petalsField);
    for (let i = 0; i < particleCount; i++) makeParticle(particlesField);
  }

  return { init };
})();
