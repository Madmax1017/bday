/* ===========================================================
   INTERACTIVE HEART MODULE
   A broken heart the user drags together. On snap:
   glow, particles, background shift, and reveal message.
   =========================================================== */
const Heart = (() => {
    let leftHalf, rightHalf, heartSection, completionOverlay;
    let isDragging = null;
    let dragOffset = { x: 0, y: 0 };
    let hasCompleted = false;

    const SNAP_THRESHOLD = 35; // px

    function init() {
        leftHalf = document.getElementById('heartLeft');
        rightHalf = document.getElementById('heartRight');
        heartSection = document.getElementById('heart');
        completionOverlay = document.getElementById('heartCompletion');

        if (!leftHalf || !rightHalf) return;

        setupDrag(leftHalf);
        setupDrag(rightHalf);

        // Entrance animation
        if (window.gsap) {
            gsap.fromTo(leftHalf,
                { x: -80, opacity: 0, rotation: -15 },
                { x: 0, opacity: 1, rotation: -8, duration: 1.2, ease: 'power3.out', delay: 0.3 }
            );
            gsap.fromTo(rightHalf,
                { x: 80, opacity: 0, rotation: 15 },
                { x: 0, opacity: 1, rotation: 8, duration: 1.2, ease: 'power3.out', delay: 0.5 }
            );
        }
    }

    function setupDrag(el) {
        el.addEventListener('pointerdown', (e) => {
            if (hasCompleted) return;
            e.preventDefault();
            isDragging = el;
            el.setPointerCapture(e.pointerId);

            const rect = el.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left - rect.width / 2;
            dragOffset.y = e.clientY - rect.top - rect.height / 2;

            el.classList.add('is-dragging');

            // Kill any active GSAP transforms so manual positioning works
            if (window.gsap) gsap.killTweensOf(el);
        });

        el.addEventListener('pointermove', (e) => {
            if (isDragging !== el) return;
            e.preventDefault();

            const parent = el.parentElement.getBoundingClientRect();
            const newX = e.clientX - parent.left - parent.width / 2;
            const newY = e.clientY - parent.top - parent.height / 2;

            el.style.transform = `translate(${newX}px, ${newY}px) rotate(0deg)`;
        });

        el.addEventListener('pointerup', (e) => {
            if (isDragging !== el) return;
            isDragging = null;
            el.classList.remove('is-dragging');
            el.releasePointerCapture(e.pointerId);

            checkSnap();
        });

        el.addEventListener('pointercancel', (e) => {
            isDragging = null;
            el.classList.remove('is-dragging');
        });
    }

    function checkSnap() {
        if (hasCompleted) return;

        const lRect = leftHalf.getBoundingClientRect();
        const rRect = rightHalf.getBoundingClientRect();

        // Calculate distance between the inner edges
        const lCenter = { x: lRect.left + lRect.width / 2, y: lRect.top + lRect.height / 2 };
        const rCenter = { x: rRect.left + rRect.width / 2, y: rRect.top + rRect.height / 2 };
        const dist = Math.hypot(lCenter.x - rCenter.x, lCenter.y - rCenter.y);

        if (dist < SNAP_THRESHOLD + lRect.width * 0.5) {
            snapHeart();
        }
    }

    function snapHeart() {
        hasCompleted = true;

        const container = document.getElementById('heartHalvesWrap');
        if (!container) return;

        if (window.gsap) {
            const tl = gsap.timeline();

            // Snap both halves to center
            tl.to(leftHalf, {
                x: 0, y: 0, rotation: 0,
                duration: 0.4,
                ease: 'back.out(2)'
            }, 0);
            tl.to(rightHalf, {
                x: 0, y: 0, rotation: 0,
                duration: 0.4,
                ease: 'back.out(2)'
            }, 0);

            // Satisfying bounce scale
            tl.to(container, {
                scale: 1.15,
                duration: 0.25,
                ease: 'power2.out'
            }, 0.35);
            tl.to(container, {
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            }, 0.6);

            // After snap animation, trigger effects
            tl.call(() => {
                playGlow();
                burstParticles();
                shiftBackground();
                revealMessage();
            }, null, 0.8);
        } else {
            leftHalf.style.transform = 'translate(0,0) rotate(0deg)';
            rightHalf.style.transform = 'translate(0,0) rotate(0deg)';
            revealMessage();
        }
    }

    function playGlow() {
        const glow = document.getElementById('heartGlow');
        if (!glow || !window.gsap) return;

        glow.style.display = 'block';
        gsap.fromTo(glow,
            { scale: 0.3, opacity: 0.9 },
            {
                scale: 3,
                opacity: 0,
                duration: 1.8,
                ease: 'power2.out',
                onComplete: () => { glow.style.display = 'none'; }
            }
        );
    }

    function burstParticles() {
        const container = document.getElementById('heartHalvesWrap');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const parentRect = container.parentElement.getBoundingClientRect();
        const cx = rect.left - parentRect.left + rect.width / 2;
        const cy = rect.top - parentRect.top + rect.height / 2;

        const particleChars = ['❤️', '💕', '✨', '💗', '♥', '💖'];
        const count = 50;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'heart-burst-particle';
            p.textContent = particleChars[Math.floor(Math.random() * particleChars.length)];
            p.style.left = `${cx}px`;
            p.style.top = `${cy}px`;
            container.parentElement.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 140;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            if (window.gsap) {
                gsap.fromTo(p,
                    { scale: 0.5, opacity: 1 },
                    {
                        x: dx,
                        y: dy,
                        scale: 1 + Math.random() * 0.5,
                        opacity: 0,
                        rotation: Math.random() * 360,
                        duration: 1.2 + Math.random() * 0.8,
                        ease: 'power3.out',
                        onComplete: () => p.remove()
                    }
                );
            } else {
                setTimeout(() => p.remove(), 1500);
            }
        }
    }

    function shiftBackground() {
        if (!heartSection || !window.gsap) return;
        gsap.to(heartSection, {
            background: 'linear-gradient(180deg, #fce4ec 0%, #f8bbd0 40%, #f48fb1 100%)',
            duration: 2,
            ease: 'power1.inOut'
        });
    }

    function revealMessage() {
        if (!completionOverlay) return;

        completionOverlay.classList.add('is-visible');

        if (window.gsap) {
            gsap.fromTo(completionOverlay,
                { scale: 0.85, opacity: 0, y: 20 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.6,
                    ease: 'back.out(1.4)'
                }
            );
        }
    }

    return { init };
})();
