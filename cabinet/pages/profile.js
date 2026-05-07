(function() {
    // ВЕСЬ КОД ФАЙЛУ ТУТ

// ========== ДАНІ ==========
var currentUser = null;
var currentAvatar = null;

function initProfile() {
    loadUser();
    loadProfileData();
    setupTabs();
    setupAccountTypeListener();
}

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) currentUser = JSON.parse(saved);
    else {
        currentUser = { name: 'Владислав Тараненко', username: 'vlad_tarasenko', email: 'vlad@example.com', phone: '+38 097 123 4567', location: 'Київ, Україна', bio: 'Продаю та купую на FasTik', birthdate: '2000-01-01', accountType: 'personal', joined: '2025-01-15' };
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    }
}

function loadProfileData() {
    document.getElementById('fullName').value = currentUser.name || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('location').value = currentUser.location || '';
    document.getElementById('bio').value = currentUser.bio || '';
    document.getElementById('birthdate').value = currentUser.birthdate || '';

    document.getElementById('previewName').textContent = currentUser.name || 'Користувач';
    document.getElementById('previewUsername').textContent = `@${currentUser.username || 'user'}`;
    document.getElementById('previewLocation').textContent = `📍 ${currentUser.location || 'Україна'}`;
    document.getElementById('previewJoined').textContent = `🗓️ Приєднався: ${currentUser.joined || 'січень 2025'}`;

    const myAds = JSON.parse(localStorage.getItem('fastik_ads') || '[]');
    document.getElementById('previewAdsCount').textContent = myAds.length;
    document.getElementById('previewRating').textContent = '4.8';
    document.getElementById('previewFollowers').textContent = '45';

    const savedAvatar = localStorage.getItem('fastik_avatar');
    if (savedAvatar) {
        currentAvatar = JSON.parse(savedAvatar);
        const av = document.getElementById('previewAvatar');
        if (currentAvatar.type === 'image') { av.style.backgroundImage = `url(${currentAvatar.url})`; av.style.backgroundSize = 'cover'; av.innerHTML = ''; }
        else { av.style.background = currentAvatar.color; av.innerHTML = currentAvatar.letter; }
    }

    if (currentUser.accountType === 'business') {
        document.querySelector('input[value="business"]').checked = true;
        document.getElementById('businessFields').style.display = 'block';
        document.getElementById('companyName').value = currentUser.companyName || '';
        document.getElementById('taxId').value = currentUser.taxId || '';
    }

    const social = currentUser.social || {};
    document.getElementById('facebookLink').value = social.facebook || '';
    document.getElementById('instagramLink').value = social.instagram || '';
    document.getElementById('telegramLink').value = social.telegram || '';
    document.getElementById('viberLink').value = social.viber || '';

    const badges = ['✅ Підтверджений email', '📱 Підтверджений телефон', '⭐ Рейтинг 4.8+', '📦 FasTik Доставка'];
    document.getElementById('badgesList').innerHTML = badges.map(b => `<div class="badge"><span>${b}</span></div>`).join('');
}

function setupTabs() {
    document.querySelectorAll('.edit-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const id = tab.dataset.tab;
            document.querySelectorAll('.edit-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.edit-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${id}Tab`).classList.add('active');
        });
    });
}

function savePersonalData() {
    currentUser.name = document.getElementById('fullName').value;
    currentUser.username = document.getElementById('username').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.phone = document.getElementById('phone').value;
    currentUser.location = document.getElementById('location').value;
    currentUser.bio = document.getElementById('bio').value;
    currentUser.birthdate = document.getElementById('birthdate').value;
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    document.getElementById('previewName').textContent = currentUser.name;
    document.getElementById('previewUsername').textContent = `@${currentUser.username}`;
    document.getElementById('previewLocation').textContent = `📍 ${currentUser.location}`;
    showToast('Особисті дані збережено!');
}

function setupAccountTypeListener() {
    document.querySelectorAll('input[name="accountType"]').forEach(r => {
        r.addEventListener('change', () => {
            document.getElementById('businessFields').style.display = r.value === 'business' ? 'block' : 'none';
        });
    });
}

function saveAccountType() {
    const selected = document.querySelector('input[name="accountType"]:checked')?.value;
    if (selected) {
        currentUser.accountType = selected;
        if (selected === 'business') {
            currentUser.companyName = document.getElementById('companyName').value;
            currentUser.taxId = document.getElementById('taxId').value;
        }
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
        showToast('Тип акаунту збережено!');
    }
}

function saveSocialLinks() {
    currentUser.social = {
        facebook: document.getElementById('facebookLink').value,
        instagram: document.getElementById('instagramLink').value,
        telegram: document.getElementById('telegramLink').value,
        viber: document.getElementById('viberLink').value
    };
    localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    showToast('Соціальні мережі збережено!');
}

function changePassword() {
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPass !== confirm) { showToast('Паролі не співпадають!', 'error'); return; }
    if (newPass.length < 6) { showToast('Пароль має бути ≥6 символів', 'error'); return; }
    showToast('Пароль змінено!');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function setup2FA() { showToast('Налаштування 2FA буде доступне найближчим часом'); }

function deactivateAccount() {
    openConfirmModal('Деактивація акаунту', 'Ви впевнені? Ви зможете відновити доступ пізніше.', () => {
        showToast('Акаунт деактивовано');
        closeModal('confirmModal');
    });
}

function deleteAccount() {
    openConfirmModal('Видалення акаунту', 'Це НЕЗВОРОТНО! Всі дані будуть видалені. Ви впевнені?', () => {
        localStorage.clear();
        showToast('Акаунт видалено');
        setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    });
}

function openAvatarModal() { document.getElementById('avatarModal').style.display = 'flex'; }
function uploadPhoto() { document.getElementById('avatarInput').click(); }
function previewAvatar(input) {
    if (input.files?.[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { currentAvatar = { type: 'image', url: e.target.result, letter: currentUser.name?.charAt(0) || 'В' };
            const disp = document.getElementById('currentAvatarDisplay');
            disp.style.backgroundImage = `url(${e.target.result})`; disp.style.backgroundSize = 'cover'; disp.innerHTML = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function setAvatarColor(color, letter) { currentAvatar = { type: 'color', color, letter };
    const disp = document.getElementById('currentAvatarDisplay');
    disp.style.background = color; disp.innerHTML = letter; disp.style.backgroundImage = 'none';
}
function removePhoto() { currentAvatar = null;
    const disp = document.getElementById('currentAvatarDisplay');
    disp.style.background = '#002f34'; disp.innerHTML = currentUser.name?.charAt(0) || 'В'; disp.style.backgroundImage = 'none';
}
function saveAvatar() {
    if (currentAvatar) {
        localStorage.setItem('fastik_avatar', JSON.stringify(currentAvatar));
        const av = document.getElementById('previewAvatar');
        if (currentAvatar.type === 'image') { av.style.backgroundImage = `url(${currentAvatar.url})`; av.style.backgroundSize = 'cover'; av.innerHTML = ''; }
        else { av.style.background = currentAvatar.color; av.innerHTML = currentAvatar.letter; av.style.backgroundImage = 'none'; }
        showToast('Аватар оновлено!');
    }
    closeModal('avatarModal');
}
function shareProfile() { navigator.clipboard.writeText(window.location.href); showToast('Посилання скопійовано!'); }
function reportProfile() { showToast('Скаргу надіслано модератору'); }

function openConfirmModal(title, msg, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = msg;
    document.getElementById('confirmModal').style.display = 'flex';
    document.getElementById('confirmActionBtn').onclick = () => { onConfirm(); closeModal('confirmModal'); };
}

function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='error'?'#dc3545':'#00a49f'};color:#fff;padding:12px 20px;border-radius:8px;z-index:9999`;
    t.textContent = msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2000);
}
function closeModal(id) { const m = document.getElementById(id); if(m) m.style.display = 'none'; }

initProfile();

})();