// Данные пользователя (имитация)
let currentUser = {
    name: "Владислав",
    balance: 0,
    bonus: 0,
    phone: "Не вказано",
    email: "user@example.com",
    location: "Не вказано"
};

// Переключение вкладок
function switchTab(tabId) {
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Показать выбранную
    document.getElementById(tabId).classList.add('active');
    
    // Обновить активный пункт меню
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.sidebar-item').classList.add('active');
    
    // Если нужно обновить данные
    if (tabId === 'my-ads') {
        loadMyAds();
    } else if (tabId === 'profile') {
        updateProfileForm();
    }
}

// Загрузка моих объявлений
function loadMyAds() {
    const container = document.getElementById('myAdsList');
    if (!container) return;
    
    // Берем объявления из localStorage или глобального массива
    let myAds = JSON.parse(localStorage.getItem('myAds')) || [];
    
    if (myAds.length === 0) {
        container.innerHTML = '<div class="empty-state">У вас ще немає оголошень. Створіть перше!</div>';
        return;
    }
    
    container.innerHTML = myAds.map(ad => `
        <div class="info-row">
            <div><strong>${ad.title}</strong><br><small>${ad.price} грн</small></div>
            <button class="btn-outline" onclick="deleteAd(${ad.id})">Видалити</button>
        </div>
    `).join('');
}

// Удаление объявления
function deleteAd(id) {
    let myAds = JSON.parse(localStorage.getItem('myAds')) || [];
    myAds = myAds.filter(ad => ad.id !== id);
    localStorage.setItem('myAds', myAds);
    loadMyAds();
}

// Обновление формы профиля
function updateProfileForm() {
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profilePhone').value = currentUser.phone;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileLocation').value = currentUser.location;
}

// Сохранение профиля
function saveProfile() {
    currentUser.name = document.getElementById('profileName').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.location = document.getElementById('profileLocation').value;
    alert('Профіль збережено!');
    updateProfileForm();
}

// Смена пароля
function changePassword() {
    const newPass = prompt('Введіть новий пароль');
    if (newPass) alert('Пароль змінено!');
}

// Смена email
function changeEmail() {
    const newEmail = prompt('Введіть нову електронну пошту');
    if (newEmail) {
        currentUser.email = newEmail;
        alert('Email змінено!');
        updateProfileForm();
    }
}

// Смена телефона
function changePhone() {
    const newPhone = prompt('Введіть новий номер телефону');
    if (newPhone) {
        currentUser.phone = newPhone;
        alert('Телефон змінено!');
        updateProfileForm();
    }
}

// Смена типа аккаунта
function changeAccountType() {
    alert('Функція зміни типу акаунта (приватна особа / компанія)');
}

// Выход
function logout() {
    if (confirm('Вийти з акаунту?')) {
        window.location.href = 'index.html';
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем мои объявления из localStorage, если есть
    const savedAds = localStorage.getItem('myAds');
    if (!savedAds) {
        // Переносим существующие объявления из ads в myAds
        if (typeof ads !== 'undefined' && ads.length) {
            localStorage.setItem('myAds', JSON.stringify(ads));
        }
    }
    
    loadMyAds();
    updateProfileForm();
    
    // Обновляем баланс
    document.getElementById('userBalance').innerText = currentUser.balance;
});

// Для мобильного меню
function toggleMobileMenu() {
    document.querySelector('.sidebar').classList.toggle('open');
}