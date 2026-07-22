document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cashtag = document.getElementById('cashtag').value;
    
    const userData = {
        username: username,
        email: email,
        password: password,
        cashtag: cashtag
    };
    
    localStorage.setItem('infectiousUser', JSON.stringify(userData));
    
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'block';
});

window.addEventListener('load', function() {
    const user = localStorage.getItem('infectiousUser');
    if (user) {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'block';
    }
});