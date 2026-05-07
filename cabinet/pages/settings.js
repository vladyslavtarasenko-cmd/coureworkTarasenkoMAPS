let currentUser = null;

function initSettings() {
    loadUser();
    loadSettings();
    setupNavigation();
    loadSavedSettings();
    setupAutoSave();
}

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    currentUser = saved ? JSON.parse(saved) : { name: 'Владислав', username: 'vlad_tarasenko', email: 'vlad@example.com', phone: '+38 097 123 4567', location: 'Київ' };
}

function loadSettings() {
    const s = localStorage.getItem('fastik_settings');
    if (s) {
        const set = JSON.parse(s);
        document.getElementById('settingsUsername').value = set.username || currentUser.username;
        document.getElementById('settingsLocation').value = set.location || currentUser.location;
        document.getElementById('settingsEmail').value = set.email || currentUser.email;
        document.getElementById('settingsPhone').value = set.phone || currentUser.phone;
    } else {
        document.getElementById('settingsUsername').value = currentUser.username;
        document.getElementById('settingsLocation').value = currentUser.location;
        document.getElementById('settingsEmail').value = currentUser.email;
        document.getElementById('settingsPhone').value = currentUser.phone;
    }
    const avatar = localStorage.getItem('fastik_avatar');
    if (avatar) {
        const a = JSON.parse(avatar);
        const p = document.getElementById('profilePhotoPreview');
        if (a.type === 'image') { p.style.backgroundImage = `url(${a.url})`; p.style.backgroundSize = 'cover'; p.innerHTML = ''; }
        else { p.style.background = a.color; p.innerHTML = a.letter; }
    }
}

function loadSavedSettings() {
    const saved = localStorage.getItem('fastik_user_settings');
    if (saved) {
        const s = JSON.parse(saved);
        if (s.pushNotifications) document.getElementById('pushNotifications').checked = s.pushNotifications;
        if (s.emailNotifications) document.getElementById('emailNotifications').checked = s.emailNotifications;
        if (s.smsNotifications) document.getElementById('smsNotifications').checked = s.smsNotifications;
        if (s.chatNotifications) document.getElementById('chatNotifications').checked = s.chatNotifications;
        if (s.reviewNotifications) document.getElementById('reviewNotifications').checked = s.reviewNotifications;
        if (s.privateProfile) document.getElementById('privateProfile').checked = s.privateProfile;
        if (s.hidePhone) document.getElementById('hidePhone').checked = s.hidePhone;
        if (s.showOnlineStatus !== undefined) document.getElementById('showOnlineStatus').checked = s.showOnlineStatus;
        if (s.whoCanMessage) document.getElementById('whoCanMessage').value = s.whoCanMessage;
        if (s.twoFactor) document.getElementById('twoFactorToggle').checked = s.twoFactor;
    }
}

function setupNavigation() {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sec = item.dataset.section;
            document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(`${sec}Section`).classList.add('active');
        });
    });
}

function saveUsername() { let v = document.getElementById('settingsUsername').value; if(v){ currentUser.username=v; saveUser(); showToast('Збережено!'); } }
function saveLocation() { let v = document.getElementById('settingsLocation').value; if(v){ currentUser.location=v; saveUser(); showToast('Збережено!'); } }
function saveEmail() { let v = document.getElementById('settingsEmail').value; if(v && v.includes('@')){ currentUser.email=v; saveUser(); showToast('Email збережено!'); } else showToast('Невірний email','error'); }
function savePhone() { let v = document.getElementById('settingsPhone').value; if(v){ currentUser.phone=v; saveUser(); showToast('Телефон збережено!'); } }
function saveUser() { localStorage.setItem('fastik_user', JSON.stringify(currentUser)); }

function saveAllSettings() {
    const settings = {
        pushNotifications: document.getElementById('pushNotifications')?.checked || false,
        emailNotifications: document.getElementById('emailNotifications')?.checked || false,
        smsNotifications: document.getElementById('smsNotifications')?.checked || false,
        chatNotifications: document.getElementById('chatNotifications')?.checked || false,
        reviewNotifications: document.getElementById('reviewNotifications')?.checked || false,
        privateProfile: document.getElementById('privateProfile')?.checked || false,
        hidePhone: document.getElementById('hidePhone')?.checked || false,
        showOnlineStatus: document.getElementById('showOnlineStatus')?.checked || true,
        whoCanMessage: document.getElementById('whoCanMessage')?.value || 'all',
        twoFactor: document.getElementById('twoFactorToggle')?.checked || false
    };
    localStorage.setItem('fastik_user_settings', JSON.stringify(settings));
    showToast('Налаштування збережено!');
}

function setupAutoSave() {
    document.querySelectorAll('.toggle-switch input, #whoCanMessage').forEach(el => {
        el.addEventListener('change', () => saveAllSettings());
    });
}

function openPasswordModal() { document.getElementById('passwordModal').style.display = 'flex'; }
function changePassword() {
    let newPass = document.getElementById('newPass').value;
    let conf = document.getElementById('confirmPass').value;
    if (newPass !== conf) { showToast('Паролі не співпадають','error'); return; }
    if (newPass.length < 6) { showToast('Мінімум 6 символів','error'); return; }
    showToast('Пароль змінено!');
    closeModal('passwordModal');
    document.getElementById('currentPass').value = '';
    document.getElementById('newPass').value = '';
    document.getElementById('confirmPass').value = '';
}

function openAvatarSettings() {
    const newLetter = prompt('Введіть першу літеру імені:', currentUser.name?.charAt(0) || 'В');
    if (newLetter) {
        let p = document.getElementById('profilePhotoPreview');
        p.innerHTML = newLetter;
        p.style.background = '#002f34';
        p.style.backgroundImage = 'none';
        localStorage.setItem('fastik_avatar', JSON.stringify({ type: 'color', color: '#002f34', letter: newLetter }));
        showToast('Аватар оновлено!');
    }
}

function logoutSession(btn) {
    let item = btn.closest('.session-item');
    if (item && !item.classList.contains('current')) { item.remove(); showToast('Сесію завершено'); }
    else showToast('Не можна завершити поточну сесію','error');
}
function logoutAllDevices() { if(confirm('Вийти з усіх пристроїв?')){ showToast('Вихід...'); setTimeout(()=>location.reload(),1500); } }

function openDeleteConfirm() { document.getElementById('deleteConfirmModal').style.display = 'flex'; }
function confirmDeleteAccount() {
    let pass = document.getElementById('deletePassword').value;
    if(!pass){ showToast('Введіть пароль','error'); return; }
    if(confirm('Це незворотньо! Видалити?')){
        localStorage.clear();
        showToast('Акаунт видалено');
        setTimeout(()=>{ window.location.href = '../index.html'; },1500);
    }
}

function showToast(msg, type='success') {
    let t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='error'?'#dc3545':'#00a49f'};color:#fff;padding:12px 20px;border-radius:8px;z-index:9999`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2000);
}

function closeModal(id) { let m = document.getElementById(id); if(m) m.style.display = 'none'; }

initSettings();