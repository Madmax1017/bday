/* ===========================================================
   STARRY NIGHT MODULE
   =========================================================== */
const Stars = (() => {
    const messages = [
        { type: "Compliment", text: "You have the most beautiful smile—the kind that makes the whole world feel softer and brighter." },
        { type: "Promise", text: "I promise to always hold your hand, listen to your worries, and celebrate every small victory with you." },
        { type: "Joke", text: "You're basically my favorite notification. Even when I'm busy, seeing your name makes my day." },
        { type: "Promise", text: "I promise to share the last coffee, laugh at your jokes, and stand by you through every season." },
        { type: "Compliment", text: "Your kindness is contagious. You make everyone around you feel valued, especially me." },
        { type: "Joke", text: "Are you a magician? Because whenever I look at you, everyone else disappears." },
        { type: "Romantic Note", text: "Every day with you feels like a quiet, beautiful miracle. I'm so lucky to get to love you." },
        { type: "Promise", text: "I promise to build a life of warmth and adventure with you, one silly moment at a time." },
        { type: "Compliment", text: "I love the way your eyes light up when you talk about the things you are passionate about." },
        { type: "Romantic Note", text: "Still falling for you, every single day. Happy birthday, my favorite person." }
    ];

    let activeMessage = null;

    function createStars() {
        const field = document.getElementById('starsField');
        if (!field) return;

        const starCount = window.innerWidth < 768 ? 100 : 220;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');

            // Determine if star is interactive (approx 15% of stars)
            const isInteractive = Math.random() < 0.12 && i > 10;

            star.className = isInteractive ? 'star star-interactive' : 'star';

            // Randomize position
            const x = Math.random() * 100;
            const y = Math.random() * 95; // avoid sticking too close to bottom boundary
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;

            // Randomize sizes (small and medium twinklers)
            const size = Math.random() * 3 + 1; // 1px to 4px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            // Randomize twinkling animation speed & delay
            const pulseDelay = Math.random() * -5;
            const pulseDuration = 2 + Math.random() * 4;
            star.style.animationDelay = `${pulseDelay}s`;
            star.style.animationDuration = `${pulseDuration}s`;

            field.appendChild(star);

            if (isInteractive) {
                bindStarEvents(star);
            }
        }
    }

    function bindStarEvents(star) {
        // Hover: Sparkle emitter
        let sparkleInterval;

        star.addEventListener('mouseenter', () => {
            // Glow and scale handled in CSS, let's emit micro sparkles
            sparkleInterval = setInterval(() => {
                spawnMicroSparkle(star);
            }, 250);
        });

        star.addEventListener('mouseleave', () => {
            clearInterval(sparkleInterval);
        });

        // Click: Open floating card
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            pickStarMessage();
        });
    }

    function spawnMicroSparkle(starElement) {
        const parentContainer = document.getElementById('starsField');
        if (!parentContainer) return;

        const rect = starElement.getBoundingClientRect();
        const parentRect = parentContainer.getBoundingClientRect();

        // relative position to the container
        const x = rect.left - parentRect.left + (rect.width / 2);
        const y = rect.top - parentRect.top + (rect.height / 2);

        const sparkle = document.createElement('span');
        sparkle.className = 'star-sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        // random directional offset
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 25;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 8;

        parentContainer.appendChild(sparkle);

        if (window.gsap) {
            gsap.fromTo(sparkle,
                { scale: 0.2, opacity: 1, x: 0, y: 0 },
                {
                    scale: 1,
                    opacity: 0,
                    x: dx,
                    y: dy,
                    duration: 0.8,
                    ease: 'power1.out',
                    onComplete: () => sparkle.remove()
                }
            );
        } else {
            setTimeout(() => sparkle.remove(), 800);
        }
    }

    function pickStarMessage() {
        let newMessage;
        do {
            newMessage = messages[Math.floor(Math.random() * messages.length)];
        } while (newMessage === activeMessage);

        activeMessage = newMessage;
        displayCard(newMessage);
    }

    function displayCard(msg) {
        const card = document.getElementById('starCard');
        const header = document.getElementById('starCardHeader');
        const text = document.getElementById('starCardText');
        const wrap = document.getElementById('starsSectionWrap');

        if (!card || !header || !text) return;

        header.textContent = msg.type;
        text.textContent = msg.text;

        card.classList.add('is-open');

        if (window.gsap) {
            gsap.killTweensOf(card);
            gsap.fromTo(card,
                { scale: 0.8, opacity: 0, y: 15 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'back.out(1.5)'
                }
            );
        } else {
            card.style.opacity = '1';
        }
    }

    function closeCard() {
        const card = document.getElementById('starCard');
        if (!card) return;

        if (window.gsap) {
            gsap.to(card, {
                scale: 0.8,
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
        createStars();
        document.getElementById('starCardClose')?.addEventListener('click', closeCard);

        // click background to close
        document.getElementById('stars')?.addEventListener('click', (e) => {
            if (e.target.id === 'stars' || e.target.id === 'starsField' || e.target.id === 'starsSectionWrap') {
                closeCard();
            }
        });
    }

    return { init };
})();
