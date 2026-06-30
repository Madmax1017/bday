// gift.js
const GiftBox = {
    init() {
        this.gift = document.getElementById('gift');
        this.lid = document.querySelector('.gift-lid');
        this.bow = document.querySelector('.gift-bow');
        this.ribbonBase = document.querySelector('.ribbon-vertical-base');
        this.ribbonH = document.querySelector('.ribbon-horizontal');
        this.glow = document.querySelector('.gift-glow');
        this.surprises = document.getElementById('giftSurprises');

        if (this.gift) {
            this.gift.addEventListener('click', () => this.openGift());
            this.gift.style.cursor = 'pointer';
        }
    },

    openGift() {
        if (this.opened) return;
        this.opened = true;

        // Stop hover subtle floating
        this.gift.classList.remove('float-subtle');

        const tl = gsap.timeline();

        // 1. Untie ribbon (bow pieces fly off or dissolve)
        tl.to([this.bow, '.ribbon-vertical'], {
            opacity: 0,
            scale: 0.5,
            y: -20,
            duration: 0.8,
            ease: 'back.in(1.7)'
        }, 0);

        // Fade out base ribbons
        tl.to([this.ribbonBase, this.ribbonH], {
            opacity: 0,
            duration: 0.5
        }, 0.3);

        // 2. Open Lid (animate origin and rotation)
        gsap.set(this.lid, { transformOrigin: 'top right' });
        tl.to(this.lid, {
            rotationZ: 15,
            rotationX: 45,
            y: -30,
            x: 30,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut'
        }, 0.6);

        // 3. Emit Warm Glowing Light
        tl.to(this.glow, {
            opacity: 1,
            scale: 5,
            duration: 2,
            ease: 'power1.inOut'
        }, 1);

        // 4. Emerge Floating Hearts
        tl.add(() => {
            this.releaseHearts();
        }, 1.2);
    },

    releaseHearts() {
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('escaping-heart');
            heart.innerHTML = '❤️';
            this.surprises.appendChild(heart);

            heart.style.left = '50%';
            heart.style.top = '100%';
            heart.style.transform = 'translate(-50%, -100%)';
            heart.style.position = 'absolute';

            gsap.to(heart, {
                y: - (Math.random() * window.innerHeight * 0.8) - 100,
                x: (Math.random() - 0.5) * window.innerWidth * 0.5,
                opacity: 0,
                scale: Math.random() * 2 + 1,
                rotation: (Math.random() - 0.5) * 90,
                duration: 2 + Math.random() * 2,
                ease: 'power1.out',
                delay: Math.random() * 1.5,
                onComplete: () => heart.remove()
            });
        }
    }
};

window.GiftBox = GiftBox;
