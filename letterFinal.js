// letterFinal.js
const LetterFinal = {
    init() {
        this.section = document.getElementById('finalLetter');
        this.lanternsField = document.getElementById('lanternsField');
        this.photosField = document.getElementById('driftingPhotosField');
        this.finalText = document.getElementById('finalTypedText');
        this.typed = false;

        // Sample placeholder letter text
        this.letterContent = `To the one who holds my heart,

This journey through our memories is just a small reflection of how much you mean to me. Every moment, every laugh, every shared silence is a treasure.

Here is space for a personalized, heartfelt message. I wanted this to feel calm and infinite, just like my love for you.

Happy Birthday, darling. May all your wishes come true.`;

        if (this.section) {
            this.createBackgroundElements();
            this.setupScrollTriggers();
        }
    },

    createBackgroundElements() {
        // Create dreamy lanterns
        for (let i = 0; i < 15; i++) {
            const lantern = document.createElement('div');
            lantern.classList.add('lantern');
            this.lanternsField.appendChild(lantern);

            gsap.set(lantern, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight + window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });

            gsap.to(lantern, {
                y: "-=150vh",
                x: "+=" + ((Math.random() - 0.5) * 200),
                duration: 15 + Math.random() * 15,
                repeat: -1,
                ease: 'none',
                delay: - Math.random() * 20
            });
        }

        // Create slowly drifting photos from earlier sections
        if (window.data && window.data.galleryImages) {
            window.data.galleryImages.forEach((imgSrc, i) => {
                const photo = document.createElement('img');
                photo.src = imgSrc;
                photo.classList.add('drifting-photo');
                this.photosField.appendChild(photo);

                // Initial positioning
                gsap.set(photo, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    rotation: (Math.random() - 0.5) * 60,
                    scale: 0.8 + Math.random() * 0.5
                });

                // Very slow drift
                gsap.to(photo, {
                    x: "+=" + ((Math.random() - 0.5) * 300),
                    y: "-=" + (200 + Math.random() * 200),
                    rotation: "+=" + ((Math.random() - 0.5) * 40),
                    duration: 40 + Math.random() * 20,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
        }
    },

    setupScrollTriggers() {
        ScrollTrigger.create({
            trigger: this.section,
            start: 'top 50%',
            onEnter: () => {
                // Modify scroll speed on lenis for an emotional slowdown
                if (window.lenis) {
                    window.lenis.options.duration = 2.5; // Very slow and calm
                }
                this.typeLetter();
            },
            onLeaveBack: () => {
                // Revert scroll speed
                if (window.lenis) {
                    window.lenis.options.duration = 1.2;
                }
            }
        });

        // Fade in signature elements gradually
        const fadeElements = this.section.querySelectorAll('.fade-in-element');
        gsap.fromTo(fadeElements,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 2,
                stagger: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.signature',
                    start: 'top 80%'
                }
            }
        );
    },

    typeLetter() {
        if (this.typed) return;
        this.typed = true;

        this.finalText.innerHTML = '';
        let i = 0;
        const speed = 40; // ms per char

        const typeWriter = () => {
            if (i < this.letterContent.length) {
                let char = this.letterContent.charAt(i);
                if (char === '\n') {
                    this.finalText.innerHTML += '<br>';
                } else {
                    this.finalText.innerHTML += char;
                }
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        typeWriter();
    }
};

window.LetterFinal = LetterFinal;
