/* ===========================================================
   JAR MODULE — reasons I love you
   =========================================================== */
const Jar = (() => {
  let usedIndices = [];
  let isAnimating = false;

  function renderTinyNotes() {
    const container = document.getElementById('jarNotes');
    if (!container) return;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const note = document.createElement('div');
      note.className = 'jar-note';
      note.style.setProperty('--rot', `${Math.random() * 30 - 15}deg`);
      note.style.background = ['#F7CBAE', '#F8D9E3', '#DCD3F0'][i % 3];
      container.appendChild(note);
    }
  }

  function pickNote() {
    if (usedIndices.length >= SITE_DATA.jarNotes.length) usedIndices = [];
    let idx;
    do {
      idx = Math.floor(Math.random() * SITE_DATA.jarNotes.length);
    } while (usedIndices.includes(idx));
    usedIndices.push(idx);
    return SITE_DATA.jarNotes[idx];
  }

  function showNote(text) {
    const popup = document.getElementById('notePopup');
    const textEl = document.getElementById('noteText');
    textEl.textContent = text;

    popup.classList.add('is-open');

    if (window.gsap) {
      gsap.fromTo(popup,
        { opacity: 0, scale: 0.4, rotate: -8, y: -10 },
        { opacity: 1, scale: 1, rotate: -2, y: -40, duration: 0.7, ease: 'back.out(1.6)' }
      );
    } else {
      popup.style.opacity = 1;
    }
  }

  function hideNote() {
    const popup = document.getElementById('notePopup');
    if (window.gsap) {
      gsap.to(popup, {
        opacity: 0,
        scale: 0.5,
        y: -10,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => popup.classList.remove('is-open'),
      });
    } else {
      popup.style.opacity = 0;
      popup.classList.remove('is-open');
    }
  }

  function shakeJar() {
    if (isAnimating) return;
    isAnimating = true;

    const jar = document.getElementById('jar');
    jar.classList.add('is-shaking');

    if (document.getElementById('notePopup').classList.contains('is-open')) {
      hideNote();
    }

    setTimeout(() => {
      jar.classList.remove('is-shaking');
      showNote(pickNote());
      isAnimating = false;
    }, 500);
  }

  function init() {
    renderTinyNotes();
    document.getElementById('jar')?.addEventListener('click', shakeJar);
    document.getElementById('notePopup')?.addEventListener('click', hideNote);
  }

  return { init };
})();
