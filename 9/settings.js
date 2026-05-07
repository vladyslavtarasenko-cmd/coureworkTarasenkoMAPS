// ========== ДАНІ ==========
let currentUser = null;

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadSettings();
    setupNavigation();
    loadSavedSettings();
});

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = {
            name: 'Владислав Тараненко',
            username: 'vlad_tarasenko',
            email: 'vlad.tarasenko@example.com',
            phone: '+38 097 123 4567',
            location: 'Київ, Україна',
            bio: 'Продаю та купую на FasTik.'
        };
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('fastik_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('settingsUsername').value = settings.username || currentUser.username;
        document.getElementById('settingsBio').value = settings.bio || currentUser.bio;
        document.getElementById('settingsLocation').value = settings.location || currentUser.location;
        document.getElementById('settingsEmail').value = settings.email || currentUser.email;
        document.getElementById('settingsPhone').value = settings.phone || currentUser.phone;
        
        // Фото профілю
        const avatar = localStorage.getItem('fastik_avatar');
        if (avatar) {
            const avatarData = JSON.parse(avatar);
            const preview = document.getElementById('profilePhotoPreview');
            if (avatarData.type === 'image') {
                preview.style.backgroundImage = `url(${avatarData.url})`;
                preview.style.backgroundSize = 'cover';
                preview.innerHTML = '';
            } else {
                preview.style.background = avatarData.color || '#002f34';
                preview.innerHTML = avatarData.letter || currentUser.name?.charAt(0) || 'В';
            }
        }
    } else {
        document.getElementById('settingsUsername').value = currentUser.username;
        document.getElementById('settingsBio').value = currentUser.bio;
        document.getElementById('settingsLocation').value = currentUser.location;
        document.getElementById('settingsEmail').value = currentUser.email;
        document.getElementById('settingsPhone').value = currentUser.phone;
    }
}

function loadSavedSettings() {
    const saved = localStorage.getItem('fastik_user_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        // Сповіщення
        if (settings.pushNotifications) document.getElementById('pushNotifications').checked = settings.pushNotifications;
        if (settings.emailNotifications) document.getElementById('emailNotifications').checked = settings.emailNotifications;
        if (settings.smsNotifications) document.getElementById('smsNotifications').checked = settings.smsNotifications;
        if (settings.chatNotifications) document.getElementById('chatNotifications').checked = settings.chatNotifications;
        if (settings.reviewNotifications) document.getElementById('reviewNotifications').checked = settings.reviewNotifications;
        if (settings.promoNotifications) document.getElementById('promoNotifications').checked = settings.promoNotifications;
        
        // Конфіденційність
        if (settings.privateProfile) document.getElementById('privateProfile').checked = settings.privateProfile;
        if (settings.hidePhone) document.getElementById('hidePhone').checked = settings.hidePhone;
        if (settings.showOnlineStatus) document.getElementById('showOnlineStatus').checked = settings.showOnlineStatus;
        if (settings.whoCanMessage) document.getElementById('whoCanMessage').value = settings.whoCanMessage;
        
        // Безпека
        if (settings.twoFactor) document.getElementById('twoFactorToggle').checked = settings.twoFactor;
        
        // Оголошення
        if (settings.autoRenew) document.getElementById('autoRenew').checked = settings.autoRenew;
        if (settings.moderationAlerts) document.getElementById('moderationAlerts').checked = settings.moderationAlerts;
        
        // Платні послуги
        if (settings.autoBoost) document.getElementById('autoBoost').checked = settings.autoBoost;
    }
}

// ========== НАВІГАЦІЯ ==========
function setupNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}Section`).classList.add('active');
        });
    });
}

// ========== ЗБЕРЕЖЕННЯ НАЛАШТУВАНЬ ==========
function saveUsername() {
    const username = document.getElementById('settingsUsername').value;
    if (username) {
        currentUser.username = username;
        saveUser();
        showNotification('Ім\'я користувача збережено!');
    }
}

function saveBio() {
    const bio = document.getElementById('settingsBio').value;
    currentUser.bio = bio;
    saveUser();
    showNotification('Інформацію про себе збережено!');
}

function saveLocation() {
    const location = document.getElementById('settingsLocation').value;
    currentUser.location = location;
    saveUser();
    showNotification('Місцезнаходження збережено!');
}

function saveEmail() {
    const email = document.getElementById('settingsEmail').value;
    if (email && email.includes('@')) {
        currentUser.email = email;
        saveUser();
        showNotification('Email збережено!');
    } else {
        showNotification('Введіть коректний email', 'error');
    }
}

function savePhone() {
    const phone = document.getElementById('settingsPhone').value;
    currentUser.phone = phone;
    saveUser();
    showNotification('Номер телефону збережено!');
}

function saveUser() {
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
}

function saveAllSettings() {
    const settings = {
        // Сповіщення
        pushNotifications: document.getElementById('pushNotifications')?.checked || false,
        emailNotifications: document.getElementById('emailNotifications')?.checked || false,
        smsNotifications: document.getElementById('smsNotifications')?.checked || false,
        chatNotifications: document.getElementById('chatNotifications')?.checked || false,
        reviewNotifications: document.getElementById('reviewNotifications')?.checked || false,
        promoNotifications: document.getElementById('promoNotifications')?.checked || false,
        
        // Конфіденційність
        privateProfile: document.getElementById('privateProfile')?.checked || false,
        hidePhone: document.getElementById('hidePhone')?.checked || false,
        showOnlineStatus: document.getElementById('showOnlineStatus')?.checked || true,
        whoCanMessage: document.getElementById('whoCanMessage')?.value || 'all',
        
        // Безпека
        twoFactor: document.getElementById('twoFactorToggle')?.checked || false,
        
        // Оголошення
        autoRenew: document.getElementById('autoRenew')?.checked || false,
        moderationAlerts: document.getElementById('moderationAlerts')?.checked || true,
        
        // Платні послуги
        autoBoost: document.getElementById('autoBoost')?.checked || false
    };
    
    localStorage.setItem('fastik_user_settings', JSON.stringify(settings));
    showNotification('Налаштування збережено!');
}

// ========== АВТОЗБЕРЕЖЕННЯ ПРИ ЗМІНІ ==========
document.querySelectorAll('.toggle-switch input, #whoCanMessage').forEach(el => {
    el.addEventListener('change', () => saveAllSettings());
});

// ========== ЗМІНА ПАРОЛЯ ==========
function openPasswordModal() {
    document.getElementById('passwordModal').style.display = 'flex';
}

function changePassword(event) {
    event.preventDefault();
    
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirm = document.getElementById('confirmPass').value;
    
    if (newPass !== confirm) {
        showNotification('Паролі не співпадають!', 'error');
        return;
    }
    
    if (newPass.length < 6) {
        showNotification('Пароль має бути не менше 6 символів!', 'error');
        return;
    }
    
    // Тут була б перевірка поточного пароля
    showNotification('Пароль успішно змінено!');
    closeModal('passwordModal');
    document.getElementById('passwordModal').querySelector('form').reset();
}

// ========== АВАТАР ==========
function openAvatarSettings() {
    // Відкриваємо модалку зміни аватара (з profile.js)
    if (typeof openAvatarModal === 'function') {
        openAvatarModal();
    } else {
        // Спрощена версія
        const newAvatar = prompt('Введіть першу літеру вашого імені:', currentUser.name?.charAt(0) || 'В');
        if (newAvatar) {
            document.getElementById('profilePhotoPreview').innerHTML = newAvatar;
            document.getElementById('profilePhotoPreview').style.background = '#002f34';
            document.getElementById('profilePhotoPreview').style.backgroundImage = 'none';
            showNotification('Аватар оновлено!');
        }
    }
}

// ========== СЕСІЇ ==========
function logoutSession(btn) {
    const sessionItem = btn.closest('.session-item');
    if (sessionItem && !sessionItem.classList.contains('current')) {
        sessionItem.remove();
        showNotification('Сесію завершено');
    } else {
        showNotification('Не можна завершити поточну сесію', 'error');
    }
}

function logoutAllDevices() {
    if (confirm('Ви впевнені? Ви будете вийдені з усіх пристроїв, крім поточного.')) {
        showNotification('Вихід з усіх пристроїв...');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// ========== ПЛАТНІ ПОСЛУГИ ==========
function uploadLogo() {
    showNotification('Функція завантаження логотипу буде доступна найближчим часом');
}

function setupInvoices() {
    showNotification('Налаштування рахунків-фактур відкриється у новому вікні');
}

function setupCategorySubscription() {
    showNotification('Виберіть категорії для підписки у вікні, що відкриється');
}

// ========== ВИДАЛЕННЯ АКАУНТУ ==========
function openDeleteConfirm() {
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

function confirmDeleteAccount() {
    const password = document.getElementById('deletePassword').value;
    
    if (!password) {
        showNotification('Введіть пароль для підтвердження', 'error');
        return;
    }
    
    if (confirm('Це дійсно незворотна дія! Ви впевнені, що хочете видалити акаунт назавжди?')) {
        // Видалення всіх даних
        localStorage.removeItem('fastik_user');
        localStorage.removeItem('fastik_ads');
        localStorage.removeItem('fastik_user_settings');
        localStorage.removeItem('fastik_favorites');
        localStorage.removeItem('fastik_chats');
        localStorage.removeItem('fastik_transactions');
        localStorage.removeItem('fastik_invoices');
        localStorage.removeItem('myAds');
        
        showNotification('Акаунт видалено. Дякуємо, що користувалися FasTik!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// ========== ДОДАТКОВІ ФУНКЦІЇ ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#00a49f'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        showNotification(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}

// Додаємо анімацію
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);