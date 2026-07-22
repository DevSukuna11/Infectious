document.getElementById('menuToggle').addEventListener('click', function() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('active');
});

document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const toggle = document.getElementById('menuToggle');
    
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('active');
    }
});