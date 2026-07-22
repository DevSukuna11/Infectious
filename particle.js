class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
        this.config = null;
        this.spawnInterval = null;
    }

    async init() {
        try {
            const res = await fetch('particles.json');
            this.config = await res.json();
        } catch (e) {
            console.error('Failed to load particles.json', e);
        }
        this.createContainer();
    }

    createContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'particles-container';
            this.container.className = 'particles-container';
            document.body.insertBefore(this.container, document.body.firstChild);
        }
    }

    start(particleType) {
        this.clearParticles();
        if (particleType === 'off') return;
        
        const particleConfig = this.config.particles[particleType];
        if (!particleConfig) return;

        const speed = particleConfig.speed === 'slow' ? 8 : particleConfig.speed === 'fast' ? 3 : 5;
        
        // Create initial batch - MORE particles at once
        for (let i = 0; i < 80; i++) {
            this.createParticle(particleConfig, speed, Math.random() * 0.5);
        }
        
        // Continuous spawn
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        
        this.spawnInterval = setInterval(() => {
            if (this.particles.length < 80) {
                this.createParticle(particleConfig, speed, 0);
            }
        }, 300);
    }

    createParticle(config, speed, delay) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = config.emoji;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '-30px';
        particle.style.position = 'absolute';
        particle.style.fontSize = '1.5rem';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `fall ${speed + Math.random() * 3}s linear ${delay}s forwards`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        setTimeout(() => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
        }, (speed + 3 + delay) * 1000);
    }

    clearParticles() {
        this.particles.forEach(p => p.remove());
        this.particles = [];
        if (this.spawnInterval) clearInterval(this.spawnInterval);
    }

    destroy() {
        this.clearParticles();
        if (this.container) this.container.remove();
    }
}

// Global instance
const particleSystem = new ParticleSystem();

window.addEventListener('load', async () => {
    await particleSystem.init();
    const savedParticles = localStorage.getItem('particles') || 'off';
    if (savedParticles !== 'off') {
        particleSystem.start(savedParticles);
    }
});
