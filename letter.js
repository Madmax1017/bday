/* ===========================================================
   LETTER MODULE — unfold, typewriter, seal close
   =========================================================== */
const Letter = (() => {
  let isOpen = false;
  let typing = false;

  function typewrite(el, text, speed = 28) {
    el.textContent = '';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor-blink';
    cursorSpan.textContent = '|';

    let i = 0;
    typing = true;
    el.appendChild(cursorSpan);

    function step() {
      if (i < text.length) {
        cursorSpan.insertAdjacentText('beforebegin', text.charAt(i));
        i++;
        setTimeout(step, speed);
      } else {
        typing = false;
        cursorSpan.remove();
      }
    }
    step();
  }

  function openLetter() {
    if (isOpen) return;
    isOpen = true;

    const closed = document.getElementById('letterClosed');
    const paper = document.getElementById('letterPaper');
    const textEl = document.getElementById('typewriterText');

    if (window.gsap) {
      const tl = gsap.timeline();
      tl.to(closed, {
        scale: 0.85,
        opacity: 0,
        rotateX: -40,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => { closed.style.visibility = 'hidden'; },
      })
      .set(paper, { visibility: 'visible' })
      .fromTo(paper,
        { opacity: 0, scale: 0.88, rotateX: 12, transformOrigin: 'top center' },
        { opacity: 1, scale: 1, rotateX: 0, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.1'
      )
      .add(() => typewrite(textEl, SITE_DATA.letterText), '-=0.2');
    } else {
      closed.style.opacity = 0;
      closed.style.visibility = 'hidden';
      paper.style.visibility = 'visible';
      paper.style.opacity = 1;
      typewrite(textEl, SITE_DATA.letterText);
    }
  }

  function closeLetter() {
    if (!isOpen || typing) return;
    isOpen = false;

    const closed = document.getElementById('letterClosed');
    const paper = document.getElementById('letterPaper');

    if (window.gsap) {
      gsap.timeline()
        .to(paper, {
          opacity: 0,
          scale: 0.9,
          rotateX: 10,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => { paper.style.visibility = 'hidden'; },
        })
        .set(closed, { visibility: 'visible' })
        .fromTo(closed,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
        );
    } else {
      paper.style.opacity = 0;
      paper.style.visibility = 'hidden';
      closed.style.visibility = 'visible';
      closed.style.opacity = 1;
    }
  }

  function init() {
    document.getElementById('letterClosed')?.addEventListener('click', openLetter);
    document.getElementById('letterSealOpen')?.addEventListener('click', closeLetter);
  }

  return { init };
})();
