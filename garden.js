/* ===========================================================
   BLOOMING GARDEN MODULE
   Symbolises love growing over time — one flower blooms,
   then cascades into a lush, living garden.
   =========================================================== */
const Garden = (() => {
    const FLOWER_COLORS = [
        { petal: '#F2A6C2', center: '#CDA45E' },
        { petal: '#E9E4F5', center: '#D4A0E0' },
        { petal: '#FDE4D8', center: '#E8B87A' },
        { petal: '#FBD3E0', center: '#F09CB8' },
        { petal: '#FFE0EC', center: '#CDA45E' },
        { petal: '#D7C4F2', center: '#B394D6' },
        { petal: '#FFEBC6', center: '#E8B87A' },
    ];

    let hasBloomedInitial = false;
    let gardenFlowers = [];

    /* ---- Flower DOM builder ---- */
    function createFlowerEl(x, y, size, colorSet, delay) {
        const flower = document.createElement('div');
        flower.className = 'garden-flower';
        flower.style.left = `${x}%`;
        flower.style.top = `${y}%`;
        flower.style.setProperty('--size', `${size}px`);
        flower.style.setProperty('--delay', `${delay}s`);

        // Build petals (6)
        for (let p = 0; p < 6; p++) {
            const petal = document.createElement('div');
            petal.className = 'garden-petal';
            petal.style.background = colorSet.petal;
            petal.style.transform = `rotate(${p * 60}deg) translateY(-${size * 0.38}px)`;
            petal.style.width = `${size * 0.42}px`;
            petal.style.height = `${size * 0.58}px`;
            flower.appendChild(petal);
        }

        // Center
        const center = document.createElement('div');
        center.className = 'garden-flower-center';
        center.style.background = colorSet.center;
        center.style.width = `${size * 0.32}px`;
        center.style.height = `${size * 0.32}px`;
        flower.appendChild(center);

        // Stem
        const stem = document.createElement('div');
        stem.className = 'garden-stem';
        stem.style.height = `${40 + Math.random() * 50}px`;
        flower.appendChild(stem);

        return flower;
    }

    /* ---- Initial single flower ---- */
    function plantInitialFlower() {
        const field = document.getElementById('gardenField');
        if (!field) return;

        const color = FLOWER_COLORS[0];
        const flower = createFlowerEl(50, 55, 50, color, 0);
        flower.classList.add('garden-flower-initial');
        flower.style.cursor = 'pointer';

        // Scale to 0 initially, bloom on click
        flower.style.transform = 'scale(0)';
        field.appendChild(flower);

        if (window.gsap) {
            gsap.to(flower, {
                scale: 1,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)',
                delay: 0.3
            });
        } else {
            flower.style.transform = 'scale(1)';
        }

        flower.addEventListener('click', (e) => {
            e.stopPropagation();
            if (hasBloomedInitial) return;
            hasBloomedInitial = true;
            bloomFlower(flower, () => {
                cascadeGarden();
            });
        });
    }

    /* ---- Bloom a single flower ---- */
    function bloomFlower(flowerEl, onComplete) {
        const petals = flowerEl.querySelectorAll('.garden-petal');
        if (!window.gsap) {
            if (onComplete) onComplete();
            return;
        }

        const tl = gsap.timeline({ onComplete });
        tl.to(flowerEl, { scale: 1.15, duration: 0.3, ease: 'power2.out' })
            .to(petals, {
                scale: 1.3,
                opacity: 1,
                stagger: 0.08,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, '-=0.15')
            .to(flowerEl, { scale: 1, duration: 0.4, ease: 'power1.inOut' });
    }

    /* ---- Cascade garden growth ---- */
    function cascadeGarden() {
        const field = document.getElementById('gardenField');
        if (!field) return;

        const positions = generateGardenPositions(35);
        const tl = window.gsap ? gsap.timeline() : null;

        positions.forEach((pos, i) => {
            const color = FLOWER_COLORS[i % FLOWER_COLORS.length];
            const size = 22 + Math.random() * 30;
            const flower = createFlowerEl(pos.x, pos.y, size, color, i * 0.12);
            flower.style.transform = 'scale(0)';
            flower.classList.add('garden-flower-grown');
            field.appendChild(flower);
            gardenFlowers.push(flower);

            if (tl) {
                tl.to(flower, {
                    scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.6)'
                }, i * 0.12);
            } else {
                setTimeout(() => {
                    flower.style.transform = 'scale(1)';
                }, i * 120);
            }
        });

        // After flowers, add butterflies and petals
        const butterflyDelay = positions.length * 0.12 * 1000 * 0.4;
        setTimeout(() => {
            spawnButterflies(field, 6);
            startFallingPetals(field);
            startGlowParticles(field);
        }, butterflyDelay);
    }

    function generateGardenPositions(count) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            // Spread across the section, avoiding too-tight center cluster
            const x = 8 + Math.random() * 84;
            const y = 30 + Math.random() * 60;
            positions.push({ x, y });
        }
        // Sort by distance from center for radial cascade effect
        positions.sort((a, b) => {
            const dA = Math.hypot(a.x - 50, a.y - 55);
            const dB = Math.hypot(b.x - 50, b.y - 55);
            return dA - dB;
        });
        return positions;
    }

    /* ---- Butterflies ---- */
    function spawnButterflies(container, count) {
        for (let i = 0; i < count; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'garden-butterfly';
            butterfly.innerHTML = '🦋';
            butterfly.style.left = `${10 + Math.random() * 80}%`;
            butterfly.style.top = `${20 + Math.random() * 50}%`;
            butterfly.style.fontSize = `${1.2 + Math.random() * 1}rem`;
            butterfly.style.animationDelay = `${Math.random() * 3}s`;
            butterfly.style.animationDuration = `${6 + Math.random() * 6}s`;
            container.appendChild(butterfly);

            // GSAP random path movement
            if (window.gsap) {
                animateButterfly(butterfly);
            }
        }
    }

    function animateButterfly(el) {
        const xRange = 60 + Math.random() * 100;
        const yRange = 30 + Math.random() * 60;
        const duration = 8 + Math.random() * 7;

        gsap.to(el, {
            x: `+=${(Math.random() - 0.5) * xRange}`,
            y: `+=${(Math.random() - 0.5) * yRange}`,
            rotation: (Math.random() - 0.5) * 20,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }

    /* ---- Falling petals ---- */
    function startFallingPetals(container) {
        const petalColors = ['#F2A6C2', '#FBD3E0', '#FDE4D8', '#E9E4F5', '#FFE0EC'];
        setInterval(() => {
            if (gardenFlowers.length === 0) return;
            const petal = document.createElement('div');
            petal.className = 'garden-falling-petal';
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
            const size = 8 + Math.random() * 10;
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.3}px`;
            container.appendChild(petal);

            if (window.gsap) {
                gsap.fromTo(petal,
                    { y: -20, x: 0, rotation: 0, opacity: 0.8 },
                    {
                        y: container.offsetHeight + 30,
                        x: (Math.random() - 0.5) * 120,
                        rotation: 180 + Math.random() * 180,
                        opacity: 0,
                        duration: 4 + Math.random() * 3,
                        ease: 'none',
                        onComplete: () => petal.remove()
                    }
                );
            } else {
                setTimeout(() => petal.remove(), 5000);
            }
        }, 600);
    }

    /* ---- Glow particles ---- */
    function startGlowParticles(container) {
        setInterval(() => {
            const p = document.createElement('div');
            p.className = 'garden-glow-particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${30 + Math.random() * 60}%`;
            container.appendChild(p);

            if (window.gsap) {
                gsap.fromTo(p,
                    { scale: 0, opacity: 0.7 },
                    {
                        scale: 1.5,
                        opacity: 0,
                        y: -(20 + Math.random() * 40),
                        duration: 2.5 + Math.random() * 2,
                        ease: 'power1.out',
                        onComplete: () => p.remove()
                    }
                );
            } else {
                setTimeout(() => p.remove(), 3000);
            }
        }, 800);
    }

    function init() {
        plantInitialFlower();
    }

    return { init };
})();
