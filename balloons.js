/* ===========================================================
   BALLOON SURPRISE MODULE
   =========================================================== */
const Balloons = (() => {
    const wishes = [
        { type: "Birthday Wish", text: "Wishing you a year ahead as bright, warm, and beautiful as your soul. Happy Birthday!" },
        { type: "Compliment", text: "You have an amazing ability to make anyone feel heard and loved. You are truly special." },
        { type: "Memory", text: "Remember that sunset we watched by the river? That remains one of my absolute favorite chapters with you." },
        { type: "Promise", text: "I promise to always make space for your dreams and encourage your wildest ideas." },
        { type: "Wish", text: "May this year bring you closer to all your creative callings, good books, and warm cups of tea." },
        { type: "Compliment", text: "I love your laugh. It's my absolute favorite sound in the whole entire world." },
        { type: "Romantic Note", text: "You are my home, my favorite adventure, and my sweetest dream. Happy birthday." },
        { type: "Memory", text: "Our first café date, where we talked for three hours straight and forgot to check the time." },
        { type: "Compliment", text: "You inspire me every day with your courage, your patience, and your sparkling mind." },
        { type: "Promise", text: "I promise to make you laugh on the blue days and celebrate you double on the golden ones." },
        { type: "Joke", text: "I love you more than hot cocoa on a freezing winter morning (and you know how much I love chocolate)." },
        { type: "Wish", text: "Wishing you endless laughter, peace in your thoughts, and joy in the smallest things today." },
        { type: "Memory", text: "The time we got completely lost looking for that viewpoint, and ended up just eating cookies in the car." },
        { type: "Compliment", text: "You represent everything soft, gentle, and strong in this world. Never change." }
    ];

    const colors = [
        '#FBD3E0', // soft pink
        '#E9E4F5', // lavender
        '#FFFBF7', // cream
        '#FDE4D8', // peach
        '#F8D9E3', // light rose
        '#F2A6C2'  // vibrant pink
    ];

    let balloonItems = [];
    let nextCardIndex = 0;
    let rafId = null;

    function createBalloons() {
        const field = document.getElementById('balloonsField');
        if (!field) return;

        const count = 14;
        const parentWidth = field.offsetWidth || window.innerWidth;

        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'balloon-wrapper';

            // Randomize layout parameters
            const startX = Math.random() * (parentWidth - 90);
            const startY = window.innerHeight + 100 + (i * 70); // staggered starting heights
            const speed = 1.1 + Math.random() * 1.5;
            const swayScale = 0.5 + Math.random() * 1.2;
            const swaySpeed = 0.01 + Math.random() * 0.02;
            const swayOffset = Math.random() * Math.PI * 2;
            const color = colors[i % colors.length];

            wrapper.style.left = `${startX}px`;
            wrapper.style.top = `${startY}px`;

            // Set custom attributes for calculation loop
            wrapper.dataset.x = startX;
            wrapper.dataset.y = startY;
            wrapper.dataset.speed = speed;
            wrapper.dataset.swayScale = swayScale;
            wrapper.dataset.swaySpeed = swaySpeed;
            wrapper.dataset.swayOffset = swayOffset;
            wrapper.dataset.time = "0";

            // Render balloon SVG inside the wrapper
            wrapper.innerHTML = `
        <svg class="balloon-svg" viewBox="0 0 100 135" width="85" height="115" style="color: ${color};">
          <!-- Shadow/Glow -->
          <defs>
            <radialGradient id="grad-${i}" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
              <stop offset="40%" stop-color="${color}"/>
              <stop offset="100%" stop-color="${darkenColor(color)}" stop-opacity="0.95"/>
            </radialGradient>
          </defs>
          <!-- Balloon body -->
          <path d="M50,10 C20,10 10,35 10,55 C10,75 25,95 50,95 C75,95 90,75 90,55 C90,35 80,10 50,10 Z" fill="url(#grad-${i})" />
          <!-- Balloon tie -->
          <polygon points="50,94 44,101 56,101" fill="${color}" />
          <!-- Strings -->
          <path d="M50,101 Q47,112 53,120 T49,134" stroke="rgba(74, 59, 67, 0.28)" stroke-width="1.6" fill="none" />
        </svg>
      `;

            field.appendChild(wrapper);
            balloonItems.push(wrapper);

            bindBalloonEvents(wrapper, i);
        }
    }

    function darkenColor(hex) {
        // Helper to supply a richer shadow inside balloon gradient
        if (hex === '#FFFBF7') return '#ebd9ca';
        if (hex === '#FBD3E0') return '#e2a3b9';
        if (hex === '#E9E4F5') return '#baaed8';
        if (hex === '#FDE4D8') return '#f0ba9d';
        if (hex === '#F8D9E3') return '#e1afc0';
        return '#c8799a';
    }

    function animateBalloons() {
        const parentWidth = document.getElementById('balloonsField')?.offsetWidth || window.innerWidth;

        balloonItems.forEach((balloon) => {
            let y = parseFloat(balloon.dataset.y);
            let x = parseFloat(balloon.dataset.x);
            const speed = parseFloat(balloon.dataset.speed);
            const swayScale = parseFloat(balloon.dataset.swayScale);
            const swaySpeed = parseFloat(balloon.dataset.swaySpeed);
            const swayOffset = parseFloat(balloon.dataset.swayOffset);
            let time = parseFloat(balloon.dataset.time);

            y -= speed;
            time += swaySpeed;

            // sway oscillation
            const localSway = Math.sin(time + swayOffset) * swayScale * 12;
            const currentX = x + localSway;

            // Reset to bottom if it floats past top boundary
            if (y < -150) {
                y = window.innerHeight + 100;
                x = Math.random() * (parentWidth - 90);
                balloon.dataset.x = x;
            }

            balloon.style.top = `${y}px`;
            balloon.style.left = `${currentX}px`;

            balloon.dataset.y = y;
            balloon.dataset.time = time;
        });

        rafId = requestAnimationFrame(animateBalloons);
    }

    function bindBalloonEvents(balloon, index) {
        balloon.addEventListener('mouseenter', () => {
            // gentle hover sway multiplier
            balloon.dataset.speed = parseFloat(balloon.dataset.speed) * 0.85;
        });

        balloon.addEventListener('mouseleave', () => {
            // restore normal speed
            balloon.dataset.speed = parseFloat(balloon.dataset.speed) / 0.85;
        });

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            popBalloon(balloon, index);
        });
    }

    function popBalloon(balloon, index) {
        // Squeeze animation before pop
        balloon.classList.add('balloon-pop-trigger');
        balloon.style.pointerEvents = 'none';

        setTimeout(() => {
            const rect = balloon.getBoundingClientRect();
            const field = document.getElementById('balloonsField');
            const parentRect = field.getBoundingClientRect();

            // coordinates inside parent
            const popX = rect.left - parentRect.left + (rect.width / 2);
            const popY = rect.top - parentRect.top + (rect.height / 3);

            // spawn confetti explosion
            spawnConfetti(popX, popY, balloon.querySelector('.balloon-svg').style.color || '#F2A6C2');

            // hide balloon
            balloon.remove();
            // Remove from calculation list
            balloonItems = balloonItems.filter(b => b !== balloon);

            // reveal secret card content
            revealPopCard();
        }, 280);
    }

    function spawnConfetti(x, y, baseColor) {
        const parentContainer = document.getElementById('balloonsField');
        if (!parentContainer) return;

        const count = 45;
        const colorsList = [baseColor, '#CDA45E', '#ffffff', '#E2DBF0', '#FDE4D8'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';

            const size = 5 + Math.random() * 8;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = colorsList[Math.floor(Math.random() * colorsList.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            parentContainer.appendChild(particle);

            // random trajectory
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 120;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance + (40 + Math.random() * 50); // falls downwards

            if (window.gsap) {
                gsap.fromTo(particle,
                    { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 },
                    {
                        scale: 0.2,
                        opacity: 0,
                        x: dx,
                        y: dy,
                        rotate: Math.random() * 360,
                        duration: 1.2 + Math.random() * 0.8,
                        ease: 'power3.out',
                        onComplete: () => particle.remove()
                    }
                );
            } else {
                setTimeout(() => particle.remove(), 1200);
            }
        }
    }

    function revealPopCard() {
        const wish = wishes[nextCardIndex];
        nextCardIndex = (nextCardIndex + 1) % wishes.length;

        const card = document.getElementById('balloonCard');
        const header = document.getElementById('balloonCardHeader');
        const text = document.getElementById('balloonCardText');

        if (!card || !header || !text) return;

        header.textContent = wish.type;
        text.textContent = wish.text;

        card.classList.add('is-open');

        if (window.gsap) {
            gsap.killTweensOf(card);
            gsap.fromTo(card,
                { scale: 0.8, opacity: 0, y: 15, filter: 'blur(10px)' },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.65,
                    ease: 'back.out(1.4)'
                }
            );
        } else {
            card.style.opacity = '1';
        }
    }

    function closeCard() {
        const card = document.getElementById('balloonCard');
        if (!card) return;

        if (window.gsap) {
            gsap.to(card, {
                scale: 0.85,
                opacity: 0,
                y: 10,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => card.classList.remove('is-open')
            });
        } else {
            card.style.opacity = '0';
            card.classList.remove('is-open');
        }
    }

    function init() {
        createBalloons();

        // start continuous animation loop
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animateBalloons);

        document.getElementById('balloonCardClose')?.addEventListener('click', closeCard);

        // click layout to close card
        document.getElementById('balloons')?.addEventListener('click', (e) => {
            if (e.target.id === 'balloons' || e.target.id === 'balloonsField') {
                closeCard();
            }
        });
    }

    return { init };
})();
