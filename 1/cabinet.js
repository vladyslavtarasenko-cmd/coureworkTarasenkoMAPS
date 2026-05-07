// ========== ДАНІ КОРИСТУВАЧА ==========
let currentUser = {
    name: 'Владислав',
    email: 'vlad.tarasenko2005@gmail.com',
    phone: '',
    location: '',
    balance: 250,
    bonus: 15
};

let userAds = [];
let userMessages = [];
let userPayments = [];
let userFavorites = [];
let userSavedSearches = [];
let userRecentViews = [];

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUserUI();
    loadMyAds();
    loadChats();
    loadPayments();
    loadRatings();
    loadFavorites();
    loadRecentViews();
    setupTabs();
    setupFilters();
});

// ========== ЗАВАНТАЖЕННЯ ДАНИХ ==========
function loadData() {
    // Завантаження з localStorage
    const savedUser = localStorage.getItem('fastik_user');
    if (savedUser) {
        const parsed = JSON.parse(savedUser);
        currentUser = { ...currentUser, ...parsed };
    }
    
    const savedAds = localStorage.getItem('fastik_ads');
    if (savedAds) {
        const allAds = JSON.parse(savedAds);
        userAds = allAds.filter(ad => ad.userId === currentUser.email || ad.userId === 'current');
    }
    
    const savedMessages = localStorage.getItem('fastik_messages');
    if (savedMessages) {
        userMessages = JSON.parse(savedMessages);
    } else {
        userMessages = [
            { id: 1, name: 'Світлана', text: 'Вітаю! Купувала в Україні, не можу брати ві...', date: '31.01', read: false, product: 'New balance 530' },
            { id: 2, name: 'Олександр', text: 'Добрий день, товар ще актуальний?', date: '30.01', read: false, product: 'iPhone 13 Pro' },
            { id: 3, name: 'Марія', text: 'Дякую за покупку! Все дуже сподобалось', date: '28.01', read: true, product: 'Диван' }
        ];
    }
    
    const savedPayments = localStorage.getItem('fastik_payments');
    if (savedPayments) {
        userPayments = JSON.parse(savedPayments);
    } else {
        userPayments = [
            { id: 1, date: '15.01.2025', description: 'Поповнення балансу', amount: 100, type: 'credit' },
            { id: 2, date: '20.01.2025', description: 'Платне оголошення', amount: -50, type: 'debit' },
            { id: 3, date: '25.01.2025', description: 'Бонус за реєстрацію', amount: 10, type: 'credit' }
        ];
    }
}

// ========== ОНОВЛЕННЯ UI ==========
function updateUserUI() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userBalance').textContent = currentUser.balance;
    document.getElementById('userBonus').textContent = currentUser.bonus;
    
    const firstLetter = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = firstLetter;
    
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone;
    document.getElementById('profileLocation').value = currentUser.location;
}

// ========== МОЇ ОГОЛОШЕННЯ ==========
function loadMyAds(filter = 'all') {
    const container = document.getElementById('myAdsList');
    let filteredAds = [...userAds];
    
    if (filter === 'active') {
        filteredAds = userAds.filter(ad => ad.active !== false);
    } else if (filter === 'inactive') {
        filteredAds = userAds.filter(ad => ad.active === false);
    }
    
    if (filteredAds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                📭 У вас ще немає оголошень<br>
                <button class="btn-create" style="margin-top: 16px;" onclick="window.location.href='create-ad.html'">Створити перше оголошення</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredAds.map(ad => `
        <div class="ad-item">
            <img src="${ad.image || 'https://via.placeholder.com/70'}" alt="${ad.title}">
            <div class="ad-info">
                <h4>${ad.title}</h4>
                <p>${ad.price.toLocaleString()} грн</p>
                <small>ID: ${ad.id} | ${ad.date || 'Нове'}</small>
            </div>
            <div class="ad-actions">
                <button class="btn-small" onclick="editAd(${ad.id})">Редагувати</button>
                <button class="btn-small danger" onclick="deleteAd(${ad.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadMyAds(btn.dataset.filter);
        });
    });
}

function deleteAd(id) {
    if (confirm('Видалити це оголошення?')) {
        userAds = userAds.filter(ad => ad.id !== id);
        localStorage.setItem('fastik_ads', JSON.stringify(userAds));
        loadMyAds();
    }
}

function editAd(id) {
    const ad = userAds.find(a => a.id === id);
    if (ad) {
        const newTitle = prompt('Нова назва:', ad.title);
        const newPrice = prompt('Нова ціна:', ad.price);
        if (newTitle) ad.title = newTitle;
        if (newPrice) ad.price = parseFloat(newPrice);
        localStorage.setItem('fastik_ads', JSON.stringify(userAds));
        loadMyAds();
    }
}

// ========== ЧАТ ==========
function loadChats(filter = 'unread') {
    const container = document.getElementById('chatList');
    let filtered = userMessages;
    
    if (filter === 'unread') {
        filtered = userMessages.filter(m => !m.read);
    } else {
        filtered = userMessages.filter(m => m.read);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">💬 У вас поки що немає повідомлень</div>';
        return;
    }
    
    container.innerHTML = filtered.map(msg => `
        <div class="chat-message ${!msg.read ? 'unread' : ''}" onclick="openChat(${msg.id})">
            <div class="chat-name">${msg.name}</div>
            <div class="chat-text">${msg.text}</div>
            <div class="chat-date">${msg.date}</div>
            ${msg.product ? `<small>📦 ${msg.product}</small>` : ''}
        </div>
    `).join('');
}

function setupChatTabs() {
    const tabs = document.querySelectorAll('.chat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadChats(tab.dataset.chat);
        });
    });
}

function openChat(id) {
    const msg = userMessages.find(m => m.id === id);
    if (msg && !msg.read) {
        msg.read = true;
        localStorage.setItem('fastik_messages', JSON.stringify(userMessages));
        loadChats();
        document.getElementById('chatBadge').textContent = userMessages.filter(m => !m.read).length;
    }
    alert(`Чат з ${msg.name}\nПовідомлення: ${msg.text}\n\n(Функція повного чату в розробці)`);
}

// ========== ПЛАТЕЖІ ==========
function loadPayments(type = 'history') {
    const container = document.getElementById('paymentsList');
    
    if (userPayments.length === 0 || type === 'invoices') {
        container.innerHTML = '<div class="empty-state">💰 Тут зберігатиметься вся історія ваших платежів на FasTik.</div>';
        return;
    }
    
    container.innerHTML = userPayments.map(p => `
        <div class="payment-item">
            <span>${p.date}</span>
            <span>${p.description}</span>
            <span style="color: ${p.amount > 0 ? '#00a49f' : '#dc3545'}">${p.amount > 0 ? '+' : ''}${p.amount} грн</span>
        </div>
    `).join('');
}

function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadPayments(tab.dataset.payment);
        });
    });
}

function searchPayments() {
    const query = document.getElementById('paymentSearch').value.toLowerCase();
    const filtered = userPayments.filter(p => 
        p.description.toLowerCase().includes(query)
    );
    const container = document.getElementById('paymentsList');
    container.innerHTML = filtered.map(p => `
        <div class="payment-item">
            <span>${p.date}</span>
            <span>${p.description}</span>
            <span style="color: ${p.amount > 0 ? '#00a49f' : '#dc3545'}">${p.amount > 0 ? '+' : ''}${p.amount} грн</span>
        </div>
    `).join('');
}

// ========== РЕЙТИНГ ==========
function loadRatings() {
    const container = document.getElementById('ratingsList');
    container.innerHTML = '<div class="empty-state">⭐ Поки немає оцінок. Коли ви отримаєте посилку з FasTik Доставка, ви зможете оцінити продавця.</div>';
}

// ========== ШУКАЮ РОБОТУ ==========
function saveJobPreferences() {
    const position = document.getElementById('desiredPosition').value;
    const region = document.getElementById('desiredRegion').value;
    
    if (position || region) {
        localStorage.setItem('job_preferences', JSON.stringify({ position, region }));
        alert('Ваші вподобання збережено! Ми знайдемо для вас відповідні вакансії.');
    } else {
        alert('Будь ласка, заповніть хоча б одне поле');
    }
}

// ========== ПРОФІЛЬ ==========
function saveProfile() {
    currentUser.name = document.getElementById('profileName').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.location = document.getElementById('profileLocation').value;
    
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    updateUserUI();
    alert('Профіль збережено!');
}

function changeAccountType() {
    const type = confirm('Приватна особа - OK, Компанія - Скасувати');
    alert(type ? 'Тип акаунту: Приватна особа' : 'Тип акаунту: Компанія (потрібні додаткові документи)');
}

// ========== НАЛАШТУВАННЯ ==========
function changePassword() {
    const newPass = prompt('Введіть новий пароль (мін. 6 символів):');
    if (newPass && newPass.length >= 6) {
        localStorage.setItem('user_password', newPass);
        alert('Пароль змінено!');
    } else if (newPass) {
        alert('Пароль має бути не менше 6 символів');
    }
}

function changeEmail() {
    const newEmail = prompt('Введіть нову електронну пошту:');
    if (newEmail && newEmail.includes('@')) {
        currentUser.email = newEmail;
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
        updateUserUI();
        alert('Email змінено!');
    } else if (newEmail) {
        alert('Введіть коректний email');
    }
}

function changePhone() {
    const newPhone = prompt('Введіть новий номер телефону (+38XXXXXXXXX):');
    if (newPhone && newPhone.length >= 10) {
        currentUser.phone = newPhone;
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
        updateUserUI();
        alert('Телефон змінено!');
    } else if (newPhone) {
        alert('Введіть коректний номер телефону');
    }
}

function openNotifications() {
    alert('Налаштування сповіщень:\n✓ Email сповіщення\n✓ Push сповіщення\n✗ СМС сповіщення');
}

function enable2FA() {
    alert('Двофакторна автентифікація буде налаштована найближчим часом.');
}

function logoutAllDevices() {
    if (confirm('Ви впевнені, що хочете вийти на всіх пристроях?')) {
        localStorage.removeItem('fastik_user');
        window.location.href = 'index.html';
    }
}

// ========== ОБРАНІ ==========
function loadFavorites() {
    const saved = localStorage.getItem('fastik_favorites');
    if (saved) userFavorites = JSON.parse(saved);
    document.getElementById('favCount').textContent = userFavorites.length;
}

function loadRecentViews() {
    const saved = localStorage.getItem('fastik_recent');
    if (saved) userRecentViews = JSON.parse(saved);
}

// ========== ПЕРЕМИКАННЯ ВКЛАДОК ==========
function setupTabs() {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.cabinet-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    setupChatTabs();
    setupPaymentTabs();
}

// ========== ВИХІД ==========
function logout() {
    localStorage.removeItem('fastik_user');
    window.location.href = 'index.html';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}