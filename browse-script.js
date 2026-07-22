let tabs = [];
let activeTab = 0;

function initBrowser() {
    const saved = localStorage.getItem('infectiousTabs');
    const shortcuts = localStorage.getItem('infectiousShortcuts');
    
    if (saved) {
        tabs = JSON.parse(saved);
    } else {
        tabs = [{id: 1, name: 'NewTAB', url: ''}];
    }
    
    renderTabs();
    
    if (shortcuts) {
        renderShortcuts(JSON.parse(shortcuts));
    }
}

function renderTabs() {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '';
    
    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${index === activeTab ? 'active' : ''}`;
        tabEl.innerHTML = `
            <span onclick="switchTab(${index})">${tab.name}</span>
            <span class="tab-close" onclick="closeTab(${index})">✕</span>
        `;
        tabsList.appendChild(tabEl);
    });
    
    if (tabs[activeTab] && tabs[activeTab].url) {
        document.getElementById('browserFrame').src = `https://duckduckgo.com/?q=${encodeURIComponent(tabs[activeTab].url)}`;
    }
}

function switchTab(index) {
    activeTab = index;
    renderTabs();
}

function closeTab(index) {
    tabs.splice(index, 1);
    if (activeTab >= tabs.length) activeTab = tabs.length - 1;
    if (tabs.length === 0) {
        tabs.push({id: Date.now(), name: 'NewTAB', url: ''});
    }
    saveTabs();
    renderTabs();
}

document.getElementById('newTabBtn').addEventListener('click', function() {
    tabs.push({id: Date.now(), name: 'NewTAB', url: ''});
    activeTab = tabs.length - 1;
    saveTabs();
    renderTabs();
});

document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        tabs[activeTab].url = query;
        tabs[activeTab].name = query.substring(0, 20);
        document.getElementById('browserFrame').src = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        saveTabs();
        renderTabs();
    }
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

document.getElementById('addShortcutBtn').addEventListener('click', function() {
    document.getElementById('shortcutModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('shortcutModal').style.display = 'none';
});

window.addEventListener('click', function(e) {
    const modal = document.getElementById('shortcutModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('shortcutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('shortcutName').value;
    const url = document.getElementById('shortcutURL').value;
    const image = document.getElementById('shortcutImage').value;
    
    let shortcuts = localStorage.getItem('infectiousShortcuts');
    shortcuts = shortcuts ? JSON.parse(shortcuts) : [];
    
    shortcuts.push({name, url, image});
    localStorage.setItem('infectiousShortcuts', JSON.stringify(shortcuts));
    
    renderShortcuts(shortcuts);
    document.getElementById('shortcutForm').reset();
    document.getElementById('shortcutModal').style.display = 'none';
});

function renderShortcuts(shortcuts) {
    const shortcutsDiv = document.getElementById('shortcuts');
    shortcutsDiv.innerHTML = '';
    
    shortcuts.forEach(shortcut => {
        const shortcutEl = document.createElement('a');
        shortcutEl.className = 'shortcut';
        shortcutEl.href = shortcut.url;
        shortcutEl.target = '_blank';
        shortcutEl.innerHTML = `
            ${shortcut.image ? `<img src="${shortcut.image}" class="shortcut-icon" alt="${shortcut.name}">` : '<div style="width: 50px; height: 50px; background: var(--neon-green); border-radius: 3px;"></div>'}
            <div class="shortcut-text">${shortcut.name}</div>
        `;
        shortcutsDiv.appendChild(shortcutEl);
    });
}

function saveTabs() {
    localStorage.setItem('infectiousTabs', JSON.stringify(tabs));
}

window.addEventListener('load', initBrowser);