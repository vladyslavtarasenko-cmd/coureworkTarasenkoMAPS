// Завантаження даних користувача
let currentUser = {
    name: '',
    email: '',
    phone: '',
    location: '',
    balance: 0,
    bonus: 0
};

let userAds = [];
let userMessages = [];
let userPayments = [];
let userRatings = [];
let userJobPreferences = {};

// Ініціалізація кабінету
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadMyAds();
    loadMessages();
    loadPayments();
    loadRatings();
    loadJobVacancies();
    loadDeliveryOrders();
    setupTabSwitching();
    setupChatTabs();
    setupPaymentTabs();
    setupRatingTabs();
    setupDeliveryTabs();
});

// Завантаження даних користувача з localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    } else {
        currentUser = {
            name: localStorage.getItem('userName') || 'Користувач',
            email: localStorage.getItem('userEmail') || 'user@example.com',
            phone: '',
            location: '',
            balance: 0,
            bonus: 0
        };
    }
    
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone;
    document.getElementById('profileLocation').value = currentUser.location;
    document.getElementById('userBalance').innerText = currentUser.balance;
    document.getElementById('userBonus').innerText = currentUser.bonus;
}

// Збереження профілю
function saveProfile() {
    currentUser.name = document.getElementById('profileName').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.location = document.getElementById('profileLocation').value;
    
    localStorage.setItem('userData', JSON.stringify(currentUser));
    alert('Профіль збережено!');
}

// Завантаження моїх оголошень
function loadMyAds() {
    const savedAds = localStorage.getItem('myAds');
    if (savedAds) {
        userAds = JSON.parse(savedAds);
    } else {
        userAds = JSON.parse(localStorage.getItem('ads')) || [];
    }
    
    const container = document.getElementById('myAdsList');
    if (userAds.length === 0) {
        container.innerHTML = '<div class="empty-state">У вас ще немає оголошень. Створіть перше!</div>';
        return;
    }
    
    container.innerHTML = userAds.map(ad => `
        <div class="ad-item">
            <img src="${ad.image || 'https://via.placeholder.com/60'}" alt="${ad.title}">
            <div class="ad-info">
                <h4>${ad.title}</h4>
                <p>${ad.price} грн</p>
                <small>${ad.date || new Date().toLocaleDateString()}</small>
            </div>
            <div class="ad-actions">
                <button class="btn-small" onclick="editAd(${ad.id})">Редагувати</button>
                <button class="btn-small danger" onclick="deleteAd(${ad.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

// Видалення оголошення
function deleteAd(id) {
    if (confirm('Видалити оголошення?')) {
        userAds = userAds.filter(ad => ad.id !== id);
        localStorage.setItem('myAds', JSON.stringify(userAds));
        loadMyAds();
    }
}

// Редагування оголошення
function editAd(id) {
    const ad = userAds.find(a => a.id === id);
    if (ad) {
        const newTitle = prompt('Нова назва:', ad.title);
        const newPrice = prompt('Нова ціна:', ad.price);
        if (newTitle) ad.title = newTitle;
        if (newPrice) ad.price = parseFloat(newPrice);
        localStorage.setItem('myAds', JSON.stringify(userAds));
        loadMyAds();
    }
}

// Завантаження повідомлень
function loadMessages() {
    const container = document.getElementById('chatList');
    const messages = [
        { name: 'Світланка', text: 'Вітаю! Купувала в Україні...', date: '31.01', read: false },
        { name: 'Олександр', text: 'Добрий день, товар ще актуальний?', date: '30.01', read: false },
        { name: 'Марія', text: 'Дякую за покупку!', date: '29.01', read: true }
    ];
    
    container.innerHTML = messages.map(msg => `
        <div class="chat-message ${msg.read ? 'read' : 'unread'}" onclick="openChat('${msg.name}')">
            <div class="chat-name">${msg.name}</div>
            <div class="chat-text">${msg.text}</div>
            <div class="chat-date">${msg.date}</div>
        </div>
    `).join('');
}

// Завантаження платежів
function loadPayments() {
    const container = document.getElementById('paymentsList');
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    
    if (payments.length === 0) {
        container.innerHTML = '<div class="empty-state">Тут зберігатиметься вся історія ваших платежів на FasTik.</div>';
        return;
    }
    
    container.innerHTML = payments.map(p => `
        <div class="payment-item">
            <span>${p.date}</span>
            <span>${p.description}</span>
            <span class="${p.amount > 0 ? 'positive' : 'negative'}">${p.amount} грн</span>
        </div>
    `).join('');
}

// Завантаження рейтингів
function loadRatings() {
    const container = document.getElementById('ratingsList');
    container.innerHTML = '<div class="empty-state">Поки немає оцінок</div>';
}

// Завантаження вакансій
function loadJobVacancies() {
    const saved = localStorage.getItem('jobPreferences');
    if (saved) {
        userJobPreferences = JSON.parse(saved);
        document.getElementById('desiredPosition').value = userJobPreferences.position || '';
        document.getElementById('desiredRegion').value = userJobPreferences.region || '';
    }
}

// Збереження вподобань для роботи
function saveJobPreferences() {
    userJobPreferences = {
        position: document.getElementById('desiredPosition').value,
        region: document.getElementById('desiredRegion').value
    };
    localStorage.setItem('jobPreferences', JSON.stringify(userJobPreferences));
    alert('Вподобання збережено! Ми знайдемо для вас відповідні вакансії.');
}

// Завантаження замовлень доставки
function loadDeliveryOrders() {
    const container = document.getElementById('deliveryList');
    container.innerHTML = '<div class="empty-state">На цей момент замовлень немає</div>';
}

// Перемикання вкладок
function setupTabSwitching() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.cabinet-tab').forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Функції для налаштувань
function changePassword() {
    const newPass = prompt('Введіть новий пароль:');
    if (newPass && newPass.length >= 6) {
        localStorage.setItem('userPassword', newPass);
        alert('Пароль змінено!');
    } else if (newPass) {
        alert('Пароль має бути не менше 6 символів');
    }
}

function changeEmail() {
    const newEmail = prompt('Введіть нову електронну пошту:');
    if (newEmail && newEmail.includes('@')) {
        currentUser.email = newEmail;
        localStorage.setItem('userData', JSON.stringify(currentUser));
        document.getElementById('profileEmail').value = newEmail;
        alert('Email змінено!');
    } else if (newEmail) {
        alert('Введіть коректний email');
    }
}

function changePhone() {
    const newPhone = prompt('Введіть новий номер телефону (+38XXXXXXXXX):');
    if (newPhone && newPhone.length >= 10) {
        currentUser.phone = newPhone;
        localStorage.setItem('userData', JSON.stringify(currentUser));
        document.getElementById('profilePhone').value = newPhone;
        alert('Телефон змінено!');
    } else if (newPhone) {
        alert('Введіть коректний номер телефону');
    }
}

function openNotifications() {
    alert('Налаштування сповіщень:\n- Email сповіщення\n- Push сповіщення\n- СМС сповіщення');
}

function enable2FA() {
    alert('Двофакторна автентифікація буде налаштована найближчим часом.');
}

function logoutAllDevices() {
    if (confirm('Ви впевнені, що хочете вийти на всіх пристроях?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
}

function changeAccountType() {
    const type = confirm('Приватна особа - OK, Компанія - Скасувати');
    if (type) {
        alert('Тип акаунту: Приватна особа');
    } else {
        alert('Тип акаунту: Компанія (потрібні додаткові документи)');
    }
}

function openChat(name) {
    alert(`Чат з ${name} буде доступний найближчим часом.`);
}

function searchPayments() {
    const query = document.getElementById('paymentSearch').value.toLowerCase();
    alert(`Пошук платежів: "${query}" (функція в розробці)`);
}

// Функція виходу
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}