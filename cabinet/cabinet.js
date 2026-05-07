// ========== ЗАВАНТАЖЕННЯ ВКЛАДОК ==========
function loadTab(tabName) {
    const contentDiv = document.getElementById('pageContent');
    if (!contentDiv) return;
    
    const url = `cabinet/pages/${tabName}.html`;
    
    contentDiv.innerHTML = '<div class="loading">⏳ Завантаження...</div>';
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Сторінку ${tabName} не знайдено`);
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            
            // Додаємо CSS
            const cssLink = document.querySelector(`link[href="cabinet/pages/${tabName}.css"]`);
            if (!cssLink) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `cabinet/pages/${tabName}.css`;
                document.head.appendChild(link);
            }
            
            // Видаляємо старий скрипт
            const oldScript = document.querySelector(`script[data-tab="${tabName}"]`);
            if (oldScript) oldScript.remove();
            
            // Додаємо новий скрипт
            const script = document.createElement('script');
            script.src = `cabinet/pages/${tabName}.js`;
            script.setAttribute('data-tab', tabName);
            document.body.appendChild(script);
        })
        .catch(error => {
            contentDiv.innerHTML = `<div class="error-message">❌ Помилка: ${error.message}</div>`;
        });
}

// ========== НАЛАШТУВАННЯ МЕНЮ ==========
function setupMenu() {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            if (!tab) return;
            
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            loadTab(tab);
        });
    });
}

// ========== ВИХІД ==========
function logout() {
    localStorage.removeItem('fastik_user');
    window.location.href = '../index.html';
}

// ========== ЗМІНА МОВИ ==========
function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        const lang = select.value;
        localStorage.setItem('fastik_lang', lang);
        location.reload();
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    loadTab('my-ads');
    
    // Завантаження даних користувача
    const savedUser = localStorage.getItem('fastik_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        document.getElementById('userName').textContent = user.name || 'Користувач';
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('userAvatar').textContent = (user.name || 'К')[0];
    }
});