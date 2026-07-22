let themesData = {};
let currentTheme = localStorage.getItem('theme') || 'emerald';
let currentBackgroundPattern = localStorage.getItem('bgPattern') || 'none';

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
        const savedParticles = localStorage.getItem('particles') || 'off';
        if (savedParticles !== 'off') {
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
    const savedPattern = localStorage.getItem('bgPattern') || 'none';
    
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
    
    const pageName = page.charAt(0).toUpperCase() + page.slice(1);
    const url = pages[page];
    if (url) {
        createTab(url, `Infectious🦠__${pageName}`);
        menuPanel.classList.remove('active');
    }
}

function createTab(url, name = null) {
    const tabId = tabCounter++;
    const tabName = name || `Infectious🦠__Tab${tabId}`;
    const tab = {
        id: tabId,
        url: url,
        name: tabName,
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
            <span onclick="switchTab(${tab.id})">${tab.name}</span>
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
    mainFrame.innerHTML = `<div class="loading-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.8)); display:flex; align-items:center; justify-content:center; z-index:100; flex-direction:column; gap:20px;"><div style="font-size:3rem; animation:spin 2s infinite;">🦠</div><div style="color:var(--primary); font-size:1.2rem; text-shadow:0 0 10px var(--primary);">Infectious🦠... loading</div></div><iframe src="${tab.url}" style="width:100%; height:100%; border:none; position:absolute; top:0; left:0;" onload="this.previousElementSibling.style.display='none';"></iframe>`;
    searchInput.value = tab.url.startsWith('http') ? tab.url : 'Infectious🦠://Home';
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
    createTab('home.html', 'Infectious🦠__Home');
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
    createTab('settings.html', 'Infectious🦠__Settings');
}

window.addEventListener('load', async () => {
    await loadThemes();
    initializeTheme();
    createTab('home.html', 'Infectious🦠__Home');
});
