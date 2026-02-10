document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CURSEUR & SON (Visuel) ---
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button, input, .cyber-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // --- 2. TILT 3D EFFECT (Sur toutes les cartes) ---
    // Fait bouger les cartes en fonction de la souris
    document.querySelectorAll('.cyber-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // --- 3. MATRIX RAIN ---
    const canvas = document.getElementById('bg-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize);
        resize();

        const chars = '01AZERTYUIOPQSDFGHJKLMWXCVBN';
        const fontSize = 14;
        const columns = canvas.width/fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for(let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i*fontSize, drops[i]*fontSize);
                if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(draw, 33);
    }

    // --- 4. HACKER TEXT SCRAMBLE ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    document.querySelectorAll('.hacker-text').forEach(el => {
        el.addEventListener('mouseover', event => {
            let iterations = 0;
            const original = el.dataset.value;
            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((l, i) => {
                        if(i < iterations) return original[i];
                        return letters[Math.floor(Math.random() * 26)];
                    }).join("");
                if(iterations >= original.length) clearInterval(interval);
                iterations += 1/3;
            }, 30);
        });
    });

    // --- 5. COMPTEUR DE STATS (Pour index.html) ---
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const inc = target / 100;
        function updateCount() {
            const count = +stat.innerText;
            if(count < target) {
                stat.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                stat.innerText = target;
            }
        }
        updateCount();
    });

    // --- 6. SCROLL REVEAL (Barres de compétences) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                const bars = entry.target.querySelectorAll('.bar-fill');
                bars.forEach(bar => { bar.style.width = bar.getAttribute('data-width'); });
            }
        });
    }, {threshold: 0.1});
    document.querySelectorAll('.cyber-card, .timeline-item').forEach(el => observer.observe(el));
});
