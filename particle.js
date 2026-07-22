class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
        this.config = null;
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
        
        // Create initial batch
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleConfig, speed, Math.random() * 0.5);
        }
        
        // Continuous spawn
        if (this.animationId) cancelAnimationFrame(this.animationId);
        
        const spawnInterval = setInterval(() => {
            if (this.particles.length < 50) {
                this.createParticle(particleConfig, speed, 0);
            }
        }, 500);
        
        window.addEventListener('beforeunload', () => clearInterval(spawnInterval));
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
    const savedParticles = localStorage.getItem('particles') || 'snowdots';
    const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
    if (particlesEnabled) {
        particleSystem.start(savedParticles);
    }
});
