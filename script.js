document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ANIMATION DE FOND (Canvas Particules) ---
    // Crée l'élément canvas dynamiquement
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration des particules
    const particleCount = 80; // Nombre de points
    const connectionDistance = 150; // Distance pour tracer une ligne
    const particleSpeed = 0.5; // Vitesse de mouvement

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebond sur les bords
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Couleur néon cyan pour les points
            ctx.fillStyle = 'rgba(0, 255, 234, 0.7)'; 
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Dessiner les connexions
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 234, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    // Lancement du background animé
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animateParticles();


    // --- 2. ANIMATION AU SCROLL (Intersection Observer) ---
    // Fait apparaître les sections quand elles entrent dans l'écran
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.2 // Déclenche quand 20% de l'élément est visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // On arrête d'observer une fois apparu
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- 3. EFFET TILT 3D SUR LES PROJETS (Si on est sur la page projets) ---
    const projectCards = document.querySelectorAll('.project-item');
    
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                // Calcule la position de la souris par rapport au centre de la carte
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Calcule l'angle de rotation (multiplie pour ajuster l'intensité)
                const rotateY = x * 0.05; 
                const rotateX = y * -0.05;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            // Remet la carte à plat quand la souris sort
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }


    // --- 4. EFFET MACHINE À ÉCRIRE (Page d'accueil) ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const textToType = typingText.getAttribute('data-text');
        typingText.textContent = '';
        let i = 0;
        const typeSpeed = 30; // Vitesse de frappe

        function typeWriter() {
            if (i < textToType.length) {
                typingText.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        // Petit délai avant de commencer
        setTimeout(typeWriter, 500);
    }
});