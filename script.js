document.getElementById('settingsBtn').addEventListener('click', function() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
});

if (document.getElementById('closeSettings')) {
    document.getElementById('closeSettings').addEventListener('click', function() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    });
}

document.addEventListener('click', function(e) {
    const panel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settingsBtn');
    if (panel && !panel.contains(e.target) && !settingsBtn.contains(e.target)) {
        panel.classList.remove('active');
    }
});