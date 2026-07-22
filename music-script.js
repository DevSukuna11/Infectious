document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        const url = `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/search?q=${encodeURIComponent(query)}`;
        document.getElementById('soundcloudFrame').src = url;
    }
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});