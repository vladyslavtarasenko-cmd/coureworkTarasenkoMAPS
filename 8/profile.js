// ========== ДАНІ ==========
let currentUser = null;
let currentAvatar = null;
let pendingAction = null;

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadProfileData();
    setupTabs();
    setupAccountTypeListener();
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
            bio: 'Продаю та купую на FasTik. Відповідаю швидко!',
            birthdate: '2000-01-01',
            accountType: 'personal',
            joined: '2025-01-15'
        };
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    }
}

function loadProfileData() {
    // Заповнення форми
    document.getElementById('fullName').value = currentUser.name || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('location').value = currentUser.location || '';
    document.getElementById('bio').value = currentUser.bio || '';
    document.getElementById('birthdate').value = currentUser.birthdate || '';
    
    // Оновлення прев'ю
    document.getElementById('previewName').textContent = currentUser.name || 'Користувач';
    document.getElementById('previewUsername').textContent = `@${currentUser.username || 'user'}`;
    document.getElementById('previewLocation').textContent = `📍 ${currentUser.location || 'Україна'}`;
    
    // Аватар
    const savedAvatar = localStorage.getItem('fastik_avatar');
    if (savedAvatar) {
        currentAvatar = savedAvatar;
        document.getElementById('previewAvatar').style.background = currentAvatar.color || 'linear-gradient(135deg, #002f34, #004d54)';
        document.getElementById('previewAvatar').innerHTML = currentAvatar.letter || currentUser.name?.charAt(0) || 'В';
        document.getElementById('currentAvatarDisplay').style.background = currentAvatar.color || '#002f34';
        document.getElementById('currentAvatarDisplay').innerHTML = currentAvatar.letter || currentUser.name?.charAt(0) || 'В';
    }
    
    // Тип акаунту
    if (currentUser.accountType === 'business') {
        document.querySelector('input[value="business"]').checked = true;
        document.getElementById('businessFields').style.display = 'block';
        document.getElementById('companyName').value = currentUser.companyName || '';
        document.getElementById('taxId').value = currentUser.taxId || '';
        document.getElementById('legalAddress').value = currentUser.legalAddress || '';
    }
    
    // Соціальні мережі
    const social = currentUser.social || {};
    document.getElementById('facebookLink').value = social.facebook || '';
    document.getElementById('instagramLink').value = social.instagram || '';
    document.getElementById('telegramLink').value = social.telegram || '';
    document.getElementById('viberLink').value = social.viber || '';
    document.getElementById('twitterLink').value = social.twitter || '';
    document.getElementById('linkedinLink').value = social.linkedin || '';
    
    // Статистика
    const myAds = JSON.parse(localStorage.getItem('myAds') || '[]');
    document.getElementById('previewAdsCount').textContent = myAds.length;
    
    // Відзнаки
    renderBadges();
}

function renderBadges() {
    const container = document.getElementById('badgesList');
    const badges = [
        { icon: '✅', name: 'Підтверджений email' },
        { icon: '📱', name: 'Підтверджений телефон' },
        { icon: '⭐', name: 'Рейтинг 4.8+' },
        { icon: '📦', name: 'FasTik Доставка' }
    ];
    
    container.innerHTML = badges.map(b => `
        <div class="badge">
            <span>${b.icon}</span>
            <span>${b.name}</span>
        </div>
    `).join('');
}

// ========== ВКЛАДКИ ==========
function setupTabs() {
    const tabs = document.querySelectorAll('.edit-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.edit-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// ========== ЗБЕРЕЖЕННЯ ОСОБИСТИХ ДАНИХ ==========
function savePersonalData(event) {
    event.preventDefault();
    
    currentUser.name = document.getElementById('fullName').value;
    currentUser.username = document.getElementById('username').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.phone = document.getElementById('phone').value;
    currentUser.location = document.getElementById('location').value;
    currentUser.bio = document.getElementById('bio').value;
    currentUser.birthdate = document.getElementById('birthdate').value;
    
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    
    // Оновлення прев'ю
    document.getElementById('previewName').textContent = currentUser.name;
    document.getElementById('previewUsername').textContent = `@${currentUser.username}`;
    document.getElementById('previewLocation').textContent = `📍 ${currentUser.location}`;
    
    showNotification('Особисті дані збережено!');
}

// ========== ТИП АКАНТУТУ ==========
function setupAccountTypeListener() {
    const radios = document.querySelectorAll('input[name="accountType"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'business') {
                document.getElementById('businessFields').style.display = 'block';
            } else {
                document.getElementById('businessFields').style.display = 'none';
            }
        });
    });
}

function saveAccountType() {
    const selected = document.querySelector('input[name="accountType"]:checked').value;
    currentUser.accountType = selected;
    
    if (selected === 'business') {
        currentUser.companyName = document.getElementById('companyName').value;
        currentUser.taxId = document.getElementById('taxId').value;
        currentUser.legalAddress = document.getElementById('legalAddress').value;
    }
    
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    showNotification('Тип акаунту збережено!');
}

// ========== СОЦІАЛЬНІ МЕРЕЖІ ==========
function saveSocialLinks() {
    currentUser.social = {
        facebook: document.getElementById('facebookLink').value,
        instagram: document.getElementById('instagramLink').value,
        telegram: document.getElementById('telegramLink').value,
        viber: document.getElementById('viberLink').value,
        twitter: document.getElementById('twitterLink').value,
        linkedin: document.getElementById('linkedinLink').value
    };
    
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    showNotification('Соціальні мережі збережено!');
}

// ========== БЕЗПЕКА ==========
function changePassword(event) {
    event.preventDefault();
    
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirm) {
        showNotification('Паролі не співпадають!', 'error');
        return;
    }
    
    if (newPass.length < 6) {
        showNotification('Пароль має бути не менше 6 символів!', 'error');
        return;
    }
    
    // Перевірка поточного пароля (в демо-режимі пропускаємо)
    showNotification('Пароль успішно змінено!');
    document.getElementById('passwordForm').reset();
}

function setup2FA() {
    showNotification('Налаштування 2FA буде доступне найближчим часом');
}

function deactivateAccount() {
    openConfirmModal(
        'Деактивація акаунту',
        'Ви впевнені, що хочете деактивувати акаунт? Ви зможете відновити доступ пізніше.',
        () => {
            showNotification('Акаунт деактивовано. Для відновлення зверніться до підтримки.');
            closeModal('confirmModal');
        }
    );
}

function deleteAccount() {
    openConfirmModal(
        'Видалення акаунту',
        'Ця дія НЕЗВОРОТНА! Всі ваші оголошення, дані та історія будуть видалені назавжди. Ви впевнені?',
        () => {
            localStorage.removeItem('fastik_user');
            localStorage.removeItem('fastik_ads');
            localStorage.removeItem('myAds');
            showNotification('Акаунт видалено. Дякуємо, що були з нами!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    );
}

// ========== АВАТАР ==========
function openAvatarModal() {
    document.getElementById('avatarModal').style.display = 'flex';
}

function uploadPhoto() {
    document.getElementById('avatarInput').click();
}

function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentAvatar = {
                type: 'image',
                url: e.target.result,
                letter: currentUser.name?.charAt(0) || 'В'
            };
            document.getElementById('currentAvatarDisplay').style.backgroundImage = `url(${e.target.result})`;
            document.getElementById('currentAvatarDisplay').style.backgroundSize = 'cover';
            document.getElementById('currentAvatarDisplay').innerHTML = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function setAvatarColor(color, letter) {
    currentAvatar = {
        type: 'color',
        color: color,
        letter: letter
    };
    document.getElementById('currentAvatarDisplay').style.background = color;
    document.getElementById('currentAvatarDisplay').innerHTML = letter;
    document.getElementById('currentAvatarDisplay').style.backgroundImage = 'none';
}

function removePhoto() {
    currentAvatar = null;
    document.getElementById('currentAvatarDisplay').style.background = '#002f34';
    document.getElementById('currentAvatarDisplay').innerHTML = currentUser.name?.charAt(0) || 'В';
    document.getElementById('currentAvatarDisplay').style.backgroundImage = 'none';
}

function saveAvatar() {
    if (currentAvatar) {
        localStorage.setItem('fastik_avatar', JSON.stringify(currentAvatar));
        document.getElementById('previewAvatar').style.background = currentAvatar.color || '#002f34';
        document.getElementById('previewAvatar').innerHTML = currentAvatar.letter || currentUser.name?.charAt(0) || 'В';
        if (currentAvatar.type === 'image') {
            document.getElementById('previewAvatar').style.backgroundImage = `url(${currentAvatar.url})`;
            document.getElementById('previewAvatar').style.backgroundSize = 'cover';
            document.getElementById('previewAvatar').innerHTML = '';
        }
    }
    closeModal('avatarModal');
    showNotification('Аватар оновлено!');
}

// ========== ЗАГАЛЬНІ ФУНКЦІЇ ==========
function shareProfile() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showNotification('Посилання на профіль скопійовано!');
}

function reportProfile() {
    showNotification('Скаргу надіслано модератору. Дякуємо за пильність!');
}

function openConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    pendingAction = onConfirm;
    document.getElementById('confirmModal').style.display = 'flex';
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.onclick = () => {
        if (pendingAction) pendingAction();
    };
}

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
    document.getElementById(modalId).style.display = 'none';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        showNotification(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}