const pages = {
    home: 'home.html',
    games: 'coming-soon.html',
    watch: 'https://www.youtube.com',
    apps: 'apps.html',
    music: 'https://open.spotify.com',
    chat: 'coming-soon.html',
    ai: 'coming-soon.html',
    browse: 'browse.html'
};

const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');
const mainFrame = document.getElementById('mainFrame');
const searchInput = document.getElementById('searchInput');

let history = [];
let historyIndex = -1;

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'emerald';
    const savedBg = localStorage.getItem('background') || '';
    
    document.body.className = `theme-${savedTheme}`;
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

function toggleMenu() {
    menuPanel.classList.toggle('active');
}

// Menu toggle event listener - FIXED
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
    const url = pages[page];
    if (url) {
        loadPage(url);
        menuPanel.classList.remove('active');
    }
}

function loadPage(url) {
    mainFrame.src = url;
    searchInput.value = url;
    
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(url);
    historyIndex++;
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        mainFrame.src = history[historyIndex];
        searchInput.value = history[historyIndex];
    }
}

function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        mainFrame.src = history[historyIndex];
        searchInput.value = history[historyIndex];
    }
}

function reload() {
    mainFrame.src = mainFrame.src;
}

function goHome() {
    loadPage(pages.home);
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        let url = searchInput.value;
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        loadPage(url);
    }
}

function openSettings() {
    loadPage('settings.html');
}

// Initialize on page load - FIXED
window.addEventListener('load', () => {
    initializeTheme();
    goHome();
});