let themesData = {};
let currentTheme = localStorage.getItem('theme') || 'emerald';
let currentBackgroundPattern = localStorage.getItem('bgPattern') || 'grid';

const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');
const mainFrame = document.getElementById('mainFrame');
const searchInput = document.getElementById('searchInput');
const tabsContainer = document.querySelector('.tabs-container');

let tabs = [];
let activeTabId = 0;
let tabCounter = 1;
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

function applyTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme} bg-${currentBackgroundPattern}`;
    localStorage.setItem('theme', theme);
    
    // Restart particles with new theme
    if (particleSystem) {
        const savedParticles = localStorage.getItem('particles') || 'snowdots';
        const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
        if (particlesEnabled) {
            particleSystem.start(savedParticles);
        }
    }
}

function applyBackgroundPattern(pattern) {
    currentBackgroundPattern = pattern;
    document.body.className = `theme-${currentTheme} bg-${pattern}`;
    localStorage.setItem('bgPattern', pattern);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || themesData.defaultTheme || 'emerald';
    const savedBg = localStorage.getItem('background') || '';
    const savedPattern = localStorage.getItem('bgPattern') || 'grid';
    
    document.body.className = `theme-${savedTheme} bg-${savedPattern}`;
    
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }
    currentTheme = savedTheme;
    currentBackgroundPattern = savedPattern;
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

function createTab(url) {
    const tabId = tabCounter++;
    const tab = {
        id: tabId,
        url: url,
        history: [url],
        historyIndex: 0
    };
    tabs.push(tab);
    activeTabId = tabId;
    renderTabs();
    loadPageInTab(tab);
}

function renderTabs() {
    tabsContainer.innerHTML = '';
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabElement.innerHTML = `
            <span onclick="switchTab(${tab.id})">Infectious🦠 Tab ${tabs.indexOf(tab) + 1}</span>
            <span class="tab-close" onclick="closeTab(${tab.id})">×</span>
        `;
        tabsContainer.appendChild(tabElement);
    });
}

function switchTab(tabId) {
    activeTabId = tabId;
    renderTabs();
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        loadPageInTab(tab);
    }
}

function closeTab(tabId) {
    tabs = tabs.filter(t => t.id !== tabId);
    if (tabs.length === 0) {
        createTab('home.html');
    } else if (activeTabId === tabId) {
        activeTabId = tabs[tabs.length - 1].id;
    }
    renderTabs();
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
        loadPageInTab(activeTab);
    }
}

function loadPageInTab(tab) {
    const proxyUrl = tab.url.startsWith('http') 
        ? `proxy.html?url=${encodeURIComponent(tab.url)}`
        : `proxy.html?url=${encodeURIComponent(tab.url)}`;
    
    mainFrame.innerHTML = `<iframe src="${proxyUrl}" style="width:100%; height:100%; border:none;"></iframe>`;
    searchInput.value = tab.url.startsWith('http') ? tab.url : 'Infectious🦠://NewTab';
}

function loadPage(url) {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
        activeTab.url = url;
        if (activeTab.historyIndex < activeTab.history.length - 1) {
            activeTab.history = activeTab.history.slice(0, activeTab.historyIndex + 1);
        }
        activeTab.history.push(url);
        activeTab.historyIndex++;
        loadPageInTab(activeTab);
    }
}

function goBack() {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && activeTab.historyIndex > 0) {
        activeTab.historyIndex--;
        activeTab.url = activeTab.history[activeTab.historyIndex];
        loadPageInTab(activeTab);
    }
}

function goForward() {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
        activeTab.historyIndex++;
        activeTab.url = activeTab.history[activeTab.historyIndex];
        loadPageInTab(activeTab);
    }
}

function reload() {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
        loadPageInTab(activeTab);
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
    initializeTheme();
    createTab('home.html');
});
