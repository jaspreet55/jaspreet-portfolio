document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loader Overlay Logic
    document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader-overlay");
    
    if(loader) {
        // Wait for exactly 3.5 seconds (3s animation + 0.5s pause)
        setTimeout(() => {
            loader.classList.add("hidden"); // Boom! Portfolio visible smoothly
            
            // DOM se hata do taaki background click block na ho
            setTimeout(() => {
                loader.style.display = "none";
            }, 500); 
        }, 3500); 
    }
});

    // 2. Dynamic Navbar Text Color Logic (Collision Detection)
    const navbar = document.getElementById('navbar');
    const darkCards = document.querySelectorAll('.glass-card, #skills, .featured-projects-section, #contact-reveal, #contact, .footer-section');

    window.addEventListener('scroll', () => {
        let isOverDark = false;
        
        // Navbar ki position screen par (Thoda offset liya hai taaki text par aate hi color change ho)
        const navBottom = navbar.getBoundingClientRect().bottom - 20; 

        darkCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Agar navbar ka bottom hissa kisi bhi black card ke coordinates se takra raha hai
            if (rect.top <= navBottom && rect.bottom >= navBottom) {
                isOverDark = true;
            }
        });

        // Condition 1: Agar black card par hai -> text white (.nav-over-dark)
        if (isOverDark) {
            navbar.classList.add('nav-over-dark');
            navbar.classList.remove('scrolled');
        } 
        // Condition 2: Agar hero section (Red) se niche white bg par hai -> text black (.scrolled)
        else if (window.scrollY > window.innerHeight - 80) { 
            navbar.classList.add('scrolled');
            navbar.classList.remove('nav-over-dark');
        } 
        // Condition 3: Agar hero section (Red) par hai -> text white (default)
        else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('nav-over-dark');
        }
    });

    // 3. Initial Hero Reveal
    function initHeroAnimations() {
        gsap.from(".gs-reveal", {
            y: 50, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out"
        });
    }

    // 4. DIORAMA CINEMATIC CAMERA (NO FADE ISSUE)
    gsap.registerPlugin(ScrollTrigger);
    const cinematicSections = document.querySelectorAll(".cinematic-section");
    
    cinematicSections.forEach((section) => {
        const cards = section.querySelectorAll('.glass-card');

        // Reveal section 100% when in view
        gsap.fromTo(section, 
            { opacity: 0 }, 
            {
                opacity: 1, duration: 1,
                scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" }
            }
        );

        if(cards.length > 0) {
            gsap.fromTo(cards, 
                { y: 50, opacity: 0 }, 
                {
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
                    scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" }
                }
            );
        }
    });

    // 5. Mobile Menu Toggle Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const closeMenu = document.getElementById('close-menu');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => { navLinks.classList.add('active'); });
        closeMenu.addEventListener('click', () => { navLinks.classList.remove('active'); });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => { navLinks.classList.remove('active'); });
        });
    }

    // 6. Interactive 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.glass-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.5, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
        });
    });

// 7. Hanging ID Card Animation (Bounce Drop)
    const hangingCard = document.getElementById('hanging-card');
    if (hangingCard) {
        // Set initial state: Hidden way above the view
        gsap.set(hangingCard, { y: -400, opacity: 0 });

        // Trigger animation when the section comes into view
        gsap.to(hangingCard, {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: "elastic.out", // This gives it the cool hanging/bouncing effect
            scrollTrigger: {
                trigger: ".persona-section",
                start: "top 60%", // Starts animating when the section is 60% down the screen
                toggleActions: "play none none reverse"
            }
        });
    }
    // 8. Progress Bars Animation
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach(bar => {
        // HTML mein data-width attribute mein jo percentage di hai, usse extract karo
        const targetWidth = bar.getAttribute('data-width');
        
        gsap.to(bar, {
            width: targetWidth, // Animate from 0% to targetWidth
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bar,
                start: "top 80%", // Starts when bar is 80% down the screen
                toggleActions: "play none none reverse"
            }
        });
    });

    // 9. Process Section Winding Line & Cards Activation
    const processSection = document.getElementById('process');
    if (processSection) {
        
        // A. Animate the SVG Mask height (Line turns black tied to scroll)
        const maskRect = document.getElementById('snake-mask-rect');
        
        gsap.to(maskRect, {
            attr: { height: 100 }, // Fills mask to 100%
            ease: "none",
            scrollTrigger: {
                trigger: ".process-timeline-col",
                start: "top 60%",   // Start blackening as soon as top hits screen
                end: "bottom 80%",  // Finish when bottom hits screen
                scrub: 0.5 // Tied perfectly to scrolling
            }
        });

        // B. Animate Cards (Turn Red when fully visible)
        const processCards = document.querySelectorAll('.process-card');
        processCards.forEach(card => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 65%", // Becomes ACTIVE when card is comfortably in view
                end: "bottom 35%", 
                toggleClass: "active", // Triggers Red background + Heartbeat CSS
            });
        });
    }
});
// 10. Update Dynamic Navbar Text Color Logic
    const dynamicNavbar = document.getElementById('navbar');
    // Dark sections list updated to include the giant sticky contact and the red contact form
    const darkSections = document.querySelectorAll('.glass-card, #skills, .featured-projects-section, #contact-reveal, #contact');

    window.addEventListener('scroll', () => {
        let isOverDark = false;
        const navBottom = dynamicNavbar.getBoundingClientRect().bottom - 20; 

        darkSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navBottom && rect.bottom >= navBottom) {
                isOverDark = true;
            }
        });

        if (isOverDark) {
            dynamicNavbar.classList.add('nav-over-dark');
            dynamicNavbar.classList.remove('scrolled');
        } else if (window.scrollY > window.innerHeight - 80) { 
            dynamicNavbar.classList.add('scrolled');
            dynamicNavbar.classList.remove('nav-over-dark');
        } else {
            dynamicNavbar.classList.remove('scrolled');
            dynamicNavbar.classList.remove('nav-over-dark');
        }
    });

    // ==================== SUNRISE / SUNSET PARALLAX EFFECT ====================
    // Ye text ko white section ke peechhe se nikalega aur red section ke peechhe chhupayega
    gsap.fromTo(".giant-text-container", 
        { 
            yPercent: 80 // Start mein text black box ke ekdum bottom mein chhupa rahega
        }, 
        {
            yPercent: -80, // End mein text black box ke ekdum top par chala jayega
            ease: "none",
            scrollTrigger: {
                trigger: ".contact-reveal-wrapper",
                start: "top bottom", // Jaise hi black box screen par aaye
                end: "bottom top",   // Jab black box screen se nikal jaye
                scrub: 0.5 // Scroll ke saath perfectly sync karega
            }
        }
    );

    // Contact Form Real Transmission (FORMSPREE)
    const newForm = document.getElementById('transmission-form');
    if(newForm) {
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const btn = newForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            const formData = new FormData();
            formData.append('First Name', document.getElementById('sender-fname').value);
            formData.append('Last Name', document.getElementById('sender-lname').value);
            formData.append('Email', document.getElementById('sender-email').value);
            formData.append('Message', document.getElementById('sender-message').value);
            formData.append('Permission', document.getElementById('sender-permission').checked ? "Yes" : "No");

            btn.innerHTML = "Sending...";
            btn.style.opacity = "0.7";
            
            try {
                // REPLACE THIS WITH YOUR FORMSPREE ID (e.g., https://formspree.io/f/xljrnewz)
                const response = await fetch('https://formspree.io/f/xljrnewz', {
                    method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
                });
                if(response.ok) { 
                    btn.innerHTML = "Message Sent ✓"; 
                    btn.style.backgroundColor = "#fff";
                    btn.style.color = "var(--accent)";
                    newForm.reset();
                } else { 
                    btn.innerHTML = "Error Sending"; 
                }
            } catch (error) { 
                btn.innerHTML = "Network Error"; 
            }

            setTimeout(() => { 
                btn.innerHTML = originalText; 
                btn.style.backgroundColor = "transparent";
                btn.style.color = "#fff";
                btn.style.opacity = "1";
            }, 4000);
        });
    }
    // ==================== VIDEO PLAY/PAUSE LOGIC ====================
    const videoBtns = document.querySelectorAll('.video-toggle-btn');
    const heroVideo = document.getElementById('hero-video');
    const heroImage = document.getElementById('hero-image');

    if(videoBtns.length > 0 && heroVideo && heroImage) {
        videoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const icons = document.querySelectorAll('.play-icon');
                const texts = document.querySelectorAll('.play-text');

                // Image chupao, video dikhao
                if(!heroVideo.classList.contains('active')) {
                    heroVideo.classList.add('active');
                    heroImage.style.opacity = '0';
                }

                if (heroVideo.paused) {
                    heroVideo.play();
                    // Dono buttons ko PAUSE state mein badlo
                    icons.forEach(i => i.className = "ph-fill ph-pause-circle play-icon");
                    texts.forEach(t => t.innerText = "PAUSE");
                } else {
                    heroVideo.pause();
                    // Dono buttons ko PLAY state mein badlo
                    icons.forEach(i => i.className = "ph-fill ph-play-circle play-icon");
                    texts.forEach(t => t.innerText = "PLAY");
                }
            });
        });

        // Jab video automatically khatam ho jaye
        heroVideo.addEventListener('ended', () => {
            const icons = document.querySelectorAll('.play-icon');
            const texts = document.querySelectorAll('.play-text');
            
            // Buttons wapas reset karo
            icons.forEach(i => i.className = "ph-fill ph-play-circle play-icon");
            texts.forEach(t => t.innerText = "PLAY REEL");
            
            // Video chupa do, original image wapas le aao
            heroVideo.classList.remove('active');
            heroImage.style.opacity = '1';
        });
    }
    