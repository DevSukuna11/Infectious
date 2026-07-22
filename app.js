let themesData = {};
let particlesData = {};
let currentParticles = [];

const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');
const mainFrame = document.getElementById('mainFrame');
const searchInput = document.getElementById('searchInput');

let history = [];
let historyIndex = -1;

async function loadThemes() {
    try {
        const res = await fetch('themes.json');
        themesData = await res.json();
    } catch (e) {
        console.error('Failed to load themes', e);
    }
}

async function loadParticles() {
    try {
        const res = await fetch('particles.json');
        particlesData = await res.json();
    } catch (e) {
        console.error('Failed to load particles', e);
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || themesData.defaultTheme || 'emerald';
    const savedBg = localStorage.getItem('background') || '';
    
    document.body.className = `theme-${savedTheme}`;
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

function initializeParticles() {
    const savedParticle = localStorage.getItem('particles') || particlesData.defaultParticle || 'snowdots';
    const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
    
    if (particlesEnabled && savedParticle !== 'off') {
        spawnParticles(savedParticle);
    }
}

function spawnParticles(type) {
    if (!particlesData.particles || !particlesData.particles[type]) return;
    
    const particleConfig = particlesData.particles[type];
    const container = document.getElementById('particles-container') || createParticlesContainer();
    
    const speed = particleConfig.speed === 'slow' ? 8 : particleConfig.speed === 'fast' ? 3 : 5;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleConfig.emoji;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '-20px';
        particle.style.animationDuration = speed + Math.random() * 3 + 's';
        particle.style.delay = Math.random() * 0.5 + 's';
        
        container.appendChild(particle);
        currentParticles.push(particle);
        
        setTimeout(() => particle.remove(), (speed + 3) * 1000);
    }
    
    setInterval(() => {
        if (currentParticles.length < 50) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particleConfig.emoji;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '-20px';
            particle.style.animationDuration = speed + Math.random() * 3 + 's';
            particle.style.delay = '0s';
            
            container.appendChild(particle);
            currentParticles.push(particle);
            
            setTimeout(() => {
                particle.remove();
                currentParticles = currentParticles.filter(p => p !== particle);
            }, (speed + 3) * 1000);
        }
    }, 1000);
}

function createParticlesContainer() {
    const container = document.createElement('div');
    container.id = 'particles-container';
    container.className = 'particles-container';
    document.body.appendChild(container);
    return container;
}

function toggleMenu() {
    menuPanel.classList.toggle('active');
}

menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-menu')) {
        menuPanel.classList.remove('active');
    }
});

function navigateTo(page) {
    const pages = {
        home: 'home.html',
        games: 'coming-soon.html',
        watch: 'watch.html',
        apps: 'apps.html',
        music: 'music.html',
        chat: 'coming-soon.html',
        ai: 'coming-soon.html',
        browse: 'browse.html'
    };
    
    const url = pages[page];
    if (url) {
        loadPage(url);
        menuPanel.classList.remove('active');
    }
}

function loadPage(url) {
    mainFrame.innerHTML = `<iframe src="proxy.html?url=${encodeURIComponent(url)}" style="width:100%; height:100%; border:none;"></iframe>`;
    searchInput.value = url.startsWith('http') ? url : 'Infectious🦠://NewTab';
    
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(url);
    historyIndex++;
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        mainFrame.innerHTML = `<iframe src="proxy.html?url=${encodeURIComponent(history[historyIndex])}" style="width:100%; height:100%; border:none;"></iframe>`;
        searchInput.value = history[historyIndex].startsWith('http') ? history[historyIndex] : 'Infectious🦠://NewTab';
    }
}

function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        mainFrame.innerHTML = `<iframe src="proxy.html?url=${encodeURIComponent(history[historyIndex])}" style="width:100%; height:100%; border:none;"></iframe>`;
        searchInput.value = history[historyIndex].startsWith('http') ? history[historyIndex] : 'Infectious🦠://NewTab';
    }
}

function reload() {
    if (history[historyIndex]) {
        mainFrame.innerHTML = `<iframe src="proxy.html?url=${encodeURIComponent(history[historyIndex])}" style="width:100%; height:100%; border:none;"></iframe>`;
    }
}

function goHome() {
    loadPage('home.html');
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        let url = searchInput.value;
        if (!url.startsWith('http') && !url.includes('Infectious🦠://')) {
            url = 'https://' + url;
        }
        loadPage(url);
    }
}

function openSettings() {
    loadPage('settings.html');
}

window.addEventListener('load', async () => {
    await loadThemes();
    await loadParticles();
    initializeTheme();
    initializeParticles();
    goHome();
});