document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize Lenis (Smooth Scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Snappy dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth trailing outline via GSAP
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out",
            // Reset transform origin issue by overriding left/top in gsap instead if preferred
            // but we rely on fixed position + translate in CSS, so just animate x/y
        });

        // Manual override for GSAP transform translations on fixed elements
        cursorOutline.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px)`;
        cursorOutline.style.left = "0";
        cursorOutline.style.top = "0";
    });

    // Add hover states to links/buttons
    const hoverElements = document.querySelectorAll('a, button, .magnetic');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
    });

    // 3. Magnetic Effect for Buttons & Nav Links (Wix / Awwwards style)
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 4. GSAP ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    // Navbar blur effect on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileBtn.querySelector('i')) {
                    mobileBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
                }
            });
        });
    }

    // Hero Entry Animation Timeline
    const tl = gsap.timeline();

    tl.to('.hero-title .line', {
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
    })
        .to('.badge-reveal', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.6")
        .to('.hero-actions', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8");

    // Parallax Hero BG
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Scroll Fade Up Elements
    gsap.utils.toArray('.gsap-fade-up').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Staggered Cards (Services & Pricing)
    const staggerSections = document.querySelectorAll('.services-3col, .pricing-flex');
    staggerSections.forEach(section => {
        gsap.from(section.querySelectorAll('.gsap-stagger'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    });

    // Gallery Zoom Reveal
    gsap.utils.toArray('.gsap-zoom').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 3D Tilt Effect specifically for magnetic cards (CSS 3D perspective applied via JS bounds)
    const tiltCards = document.querySelectorAll('.magnetic-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
            const tiltY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
});
