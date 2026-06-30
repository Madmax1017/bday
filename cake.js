// cake.js
const Cake = {
    init() {
        this.candle = document.getElementById('candle');
        this.flame = this.candle ? this.candle.querySelector('.flame') : null;
        this.cakeWrap = document.querySelector('.cake-wrap');

        if (this.candle && this.flame) {
            this.candle.addEventListener('click', () => this.makeWish());
            // Handle pointer style
            this.candle.style.cursor = 'pointer';
        }
    },

    makeWish() {
        if (this.wished) return;
        this.wished = true;

        // 1. Extinguish flame
        gsap.to(this.flame, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                this.flickerSmoke();
            }
        });

        // 2. Play Audio Uplift (assuming bgMusic exists from index.html)
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            gsap.to(bgMusic, { volume: 1, duration: 2 });
            // Minor uplift in tempo if playbackRate supported
            try {
                gsap.to(bgMusic, { playbackRate: 1.1, duration: 2, ease: "power2.inOut" });
            } catch (e) { }
        }

        // 3. Fall Confetti
        this.createConfetti();

        // 4. Spread Sparkles
        this.createSparkles();
    },

    flickerSmoke() {
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        this.candle.appendChild(smoke);

        gsap.fromTo(smoke,
            { opacity: 0.8, y: 0, scale: 1, x: 0 },
            {
                opacity: 0,
                y: -50,
                scale: 3,
                x: () => (Math.random() - 0.5) * 20,
                duration: 2,
                ease: 'power1.out',
                onComplete: () => smoke.remove()
            }
        );
    },

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            this.cakeWrap.appendChild(conf);

            // Random starting positions (x) from top of viewport
            const startX = Math.random() * window.innerWidth;
            const startY = -20 - (Math.random() * 100);

            const colors = ['#f09cb8', '#e9b384', '#a1d4c6', '#fff'];
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.left = startX + 'px';
            conf.style.top = startY + 'px';
            conf.style.opacity = Math.random() + 0.5;

            gsap.to(conf, {
                y: window.innerHeight * 1.5,
                x: startX + (Math.random() - 0.5) * 200,
                rotationZ: Math.random() * 720,
                rotationX: Math.random() * 720,
                rotationY: Math.random() * 720,
                duration: 3 + Math.random() * 2,
                ease: 'power1.out',
                onComplete: () => conf.remove()
            });
        }
    },

    createSparkles() {
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.innerHTML = '✨';
            this.cakeWrap.appendChild(sparkle);

            // Center start
            const rect = this.candle.getBoundingClientRect();
            // Adjusting to relative position within wrap
            sparkle.style.left = '50%';
            sparkle.style.top = '40%';
            sparkle.style.transform = 'translate(-50%, -50%)';

            gsap.to(sparkle, {
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                opacity: 0,
                scale: Math.random() * 2 + 0.5,
                rotation: Math.random() * 360,
                duration: 1.5 + Math.random(),
                ease: 'power2.out',
                onComplete: () => sparkle.remove()
            });
        }
    }
};

window.Cake = Cake;
