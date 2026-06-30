/* ===========================================================
   GALLERY MODULE — polaroids + lightbox
   =========================================================== */
const Gallery = (() => {
  let currentIndex = 0;

  function renderPolaroids() {
    const field = document.getElementById('polaroidField');
    if (!field) return;

    SITE_DATA.gallery.forEach((item, i) => {
      const rotation = (Math.random() * 10 - 5).toFixed(1);
      const card = document.createElement('div');
      card.className = 'polaroid';
      card.style.transform = `rotate(${rotation}deg)`;
      card.dataset.index = i;
      card.innerHTML = `
        <img src="${item.img}" alt="${item.caption}" loading="lazy" />
        <p class="polaroid-caption">${item.caption}</p>
      `;

      card.addEventListener('mouseenter', () => {
        if (window.gsap) {
          gsap.to(card, { y: -10, rotate: 0, scale: 1.04, duration: 0.4, ease: 'power3.out' });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(card, { y: 0, rotate: rotation, scale: 1, duration: 0.4, ease: 'power3.out' });
        }
      });
      card.addEventListener('click', () => openLightbox(i));

      field.appendChild(card);
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    updateLightboxContent();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = SITE_DATA.gallery[currentIndex];
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    if (window.gsap) {
      gsap.fromTo('#lightboxImg, #lightboxCaption',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
    img.src = item.img;
    img.alt = item.caption;
    caption.textContent = item.caption;
  }

  function next() {
    currentIndex = (currentIndex + 1) % SITE_DATA.gallery.length;
    updateLightboxContent();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + SITE_DATA.gallery.length) % SITE_DATA.gallery.length;
    updateLightboxContent();
  }

  function bindLightboxControls() {
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lightboxNext')?.addEventListener('click', next);
    document.getElementById('lightboxPrev')?.addEventListener('click', prev);
    document.getElementById('lightbox')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-blur')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('lightbox').classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  function init() {
    renderPolaroids();
    bindLightboxControls();
  }

  return { init };
})();
