/* ===========================================================
   TIMELINE MODULE
   =========================================================== */
const TimelineModule = (() => {
  function renderCards() {
    const track = document.getElementById('timelineTrack');
    if (!track) return;

    SITE_DATA.timeline.forEach((item, i) => {
      const side = i % 2 === 0 ? 'left' : 'right';
      const card = document.createElement('div');
      card.className = `timeline-card ${side}`;
      card.innerHTML = `
        <div class="tl-dot"></div>
        <div class="tl-card-inner">
          <img class="tl-photo" src="${item.img}" alt="${item.title}" loading="lazy" />
          <p class="tl-date">${item.date}</p>
          <h3 class="tl-title">${item.title}</h3>
          <p class="tl-desc">${item.desc}</p>
        </div>
      `;
      track.appendChild(card);
    });
  }

  function animate() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.utils.toArray('.tl-card-inner').forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // connector line grows with scroll progress through the section
    const line = document.querySelector('#timelineLine line');
    if (line) {
      const length = 1000;
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrap',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      });
    }
  }

  function init() {
    renderCards();
    // allow DOM to paint before wiring ScrollTrigger
    requestAnimationFrame(animate);
  }

  return { init };
})();
