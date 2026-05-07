(function() {
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
        const fullNameEl = document.getElementById('fullName');
        const usernameEl = document.getElementById('username');
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const locationEl = document.getElementById('location');
        const bioEl = document.getElementById('bio');
        const birthdateEl = document.getElementById('birthdate');
        
        if (fullNameEl) fullNameEl.value = currentUser.name || '';
        if (usernameEl) usernameEl.value = currentUser.username || '';
        if (emailEl) emailEl.value = currentUser.email || '';
        if (phoneEl) phoneEl.value = currentUser.phone || '';
        if (locationEl) locationEl.value = currentUser.location || '';
        if (bioEl) bioEl.value = currentUser.bio || '';
        if (birthdateEl) birthdateEl.value = currentUser.birthdate || '';

        const previewName = document.getElementById('previewName');
        const previewUsername = document.getElementById('previewUsername');
        const previewLocation = document.getElementById('previewLocation');
        const previewJoined = document.getElementById('previewJoined');
        const previewAdsCount = document.getElementById('previewAdsCount');
        const previewRating = document.getElementById('previewRating');
        const previewFollowers = document.getElementById('previewFollowers');
        
        if (previewName) previewName.textContent = currentUser.name || 'Користувач';
        if (previewUsername) previewUsername.textContent = `@${currentUser.username || 'user'}`;
        if (previewLocation) previewLocation.textContent = `📍 ${currentUser.location || 'Україна'}`;
        if (previewJoined) previewJoined.textContent = `🗓️ Приєднався: ${currentUser.joined || 'січень 2025'}`;

        const myAds = JSON.parse(localStorage.getItem('fastik_ads') || '[]');
        if (previewAdsCount) previewAdsCount.textContent = myAds.length;
        if (previewRating) previewRating.textContent = '4.8';
        if (previewFollowers) previewFollowers.textContent = '45';

        const savedAvatar = localStorage.getItem('fastik_avatar');
        if (savedAvatar) {
            currentAvatar = JSON.parse(savedAvatar);
            const av = document.getElementById('previewAvatar');
            if (av) {
                if (currentAvatar.type === 'image') { 
                    av.style.backgroundImage = `url(${currentAvatar.url})`; 
                    av.style.backgroundSize = 'cover'; 
                    av.innerHTML = ''; 
                } else { 
                    av.style.background = currentAvatar.color; 
                    av.innerHTML = currentAvatar.letter; 
                }
            }
        }

        if (currentUser.accountType === 'business') {
            const businessRadio = document.querySelector('input[value="business"]');
            const businessFields = document.getElementById('businessFields');
            const companyNameEl = document.getElementById('companyName');
            const taxIdEl = document.getElementById('taxId');
            if (businessRadio) businessRadio.checked = true;
            if (businessFields) businessFields.style.display = 'block';
            if (companyNameEl) companyNameEl.value = currentUser.companyName || '';
            if (taxIdEl) taxIdEl.value = currentUser.taxId || '';
        }

        const social = currentUser.social || {};
        const facebookLink = document.getElementById('facebookLink');
        const instagramLink = document.getElementById('instagramLink');
        const telegramLink = document.getElementById('telegramLink');
        const viberLink = document.getElementById('viberLink');
        
        if (facebookLink) facebookLink.value = social.facebook || '';
        if (instagramLink) instagramLink.value = social.instagram || '';
        if (telegramLink) telegramLink.value = social.telegram || '';
        if (viberLink) viberLink.value = social.viber || '';

        const badges = ['✅ Підтверджений email', '📱 Підтверджений телефон', '⭐ Рейтинг 4.8+', '📦 FasTik Доставка'];
        const badgesList = document.getElementById('badgesList');
        if (badgesList) badgesList.innerHTML = badges.map(b => `<div class="badge"><span>${b}</span></div>`).join('');
    }

    function setupTabs() {
        document.querySelectorAll('.edit-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const id = tab.dataset.tab;
                document.querySelectorAll('.edit-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.edit-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const activeTab = document.getElementById(`${id}Tab`);
                if (activeTab) activeTab.classList.add('active');
            });
        });
    }

    function savePersonalData() {
        const fullName = document.getElementById('fullName');
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const location = document.getElementById('location');
        const bio = document.getElementById('bio');
        const birthdate = document.getElementById('birthdate');
        
        if (fullName) currentUser.name = fullName.value;
        if (username) currentUser.username = username.value;
        if (email) currentUser.email = email.value;
        if (phone) currentUser.phone = phone.value;
        if (location) currentUser.location = location.value;
        if (bio) currentUser.bio = bio.value;
        if (birthdate) currentUser.birthdate = birthdate.value;
        
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
        
        const previewName = document.getElementById('previewName');
        const previewUsername = document.getElementById('previewUsername');
        const previewLocation = document.getElementById('previewLocation');
        
        if (previewName) previewName.textContent = currentUser.name;
        if (previewUsername) previewUsername.textContent = `@${currentUser.username}`;
        if (previewLocation) previewLocation.textContent = `📍 ${currentUser.location}`;
        
        showToast('Особисті дані збережено!');
    }

    function setupAccountTypeListener() {
        document.querySelectorAll('input[name="accountType"]').forEach(r => {
            r.addEventListener('change', () => {
                const businessFields = document.getElementById('businessFields');
                if (businessFields) businessFields.style.display = r.value === 'business' ? 'block' : 'none';
            });
        });
    }

    function saveAccountType() {
        const selected = document.querySelector('input[name="accountType"]:checked')?.value;
        if (selected) {
            currentUser.accountType = selected;
            if (selected === 'business') {
                const companyName = document.getElementById('companyName');
                const taxId = document.getElementById('taxId');
                if (companyName) currentUser.companyName = companyName.value;
                if (taxId) currentUser.taxId = taxId.value;
            }
            localStorage.setItem('fastik_user', JSON.stringify(currentUser));
            showToast('Тип акаунту збережено!');
        }
    }

    function saveSocialLinks() {
        const facebookLink = document.getElementById('facebookLink');
        const instagramLink = document.getElementById('instagramLink');
        const telegramLink = document.getElementById('telegramLink');
        const viberLink = document.getElementById('viberLink');
        
        currentUser.social = {
            facebook: facebookLink?.value || '',
            instagram: instagramLink?.value || '',
            telegram: telegramLink?.value || '',
            viber: viberLink?.value || ''
        };
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
        showToast('Соціальні мережі збережено!');
    }

    function changePassword() {
        const newPass = document.getElementById('newPassword')?.value || '';
        const confirm = document.getElementById('confirmPassword')?.value || '';
        if (newPass !== confirm) { showToast('Паролі не співпадають!', 'error'); return; }
        if (newPass.length < 6) { showToast('Пароль має бути ≥6 символів', 'error'); return; }
        showToast('Пароль змінено!');
        const currentPass = document.getElementById('currentPassword');
        const newPassEl = document.getElementById('newPassword');
        const confirmPassEl = document.getElementById('confirmPassword');
        if (currentPass) currentPass.value = '';
        if (newPassEl) newPassEl.value = '';
        if (confirmPassEl) confirmPassEl.value = '';
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

    function openAvatarModal() { 
        const modal = document.getElementById('avatarModal');
        if (modal) modal.style.display = 'flex'; 
    }
    
    function uploadPhoto() { 
        const input = document.getElementById('avatarInput');
        if (input) input.click(); 
    }
    
    function previewAvatar(input) {
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (e) => { 
                currentAvatar = { type: 'image', url: e.target.result, letter: currentUser.name?.charAt(0) || 'В' };
                const disp = document.getElementById('currentAvatarDisplay');
                if (disp) {
                    disp.style.backgroundImage = `url(${e.target.result})`; 
                    disp.style.backgroundSize = 'cover'; 
                    disp.innerHTML = '';
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    function setAvatarColor(color, letter) { 
        currentAvatar = { type: 'color', color, letter };
        const disp = document.getElementById('currentAvatarDisplay');
        if (disp) {
            disp.style.background = color; 
            disp.innerHTML = letter; 
            disp.style.backgroundImage = 'none';
        }
    }
    
    function removePhoto() { 
        currentAvatar = null;
        const disp = document.getElementById('currentAvatarDisplay');
        if (disp) {
            disp.style.background = '#002f34'; 
            disp.innerHTML = currentUser.name?.charAt(0) || 'В'; 
            disp.style.backgroundImage = 'none';
        }
    }
    
    function saveAvatar() {
        if (currentAvatar) {
            localStorage.setItem('fastik_avatar', JSON.stringify(currentAvatar));
            const av = document.getElementById('previewAvatar');
            if (av) {
                if (currentAvatar.type === 'image') { 
                    av.style.backgroundImage = `url(${currentAvatar.url})`; 
                    av.style.backgroundSize = 'cover'; 
                    av.innerHTML = ''; 
                } else { 
                    av.style.background = currentAvatar.color; 
                    av.innerHTML = currentAvatar.letter; 
                    av.style.backgroundImage = 'none';
                }
            }
            showToast('Аватар оновлено!');
        }
        closeModal('avatarModal');
    }
    
    function shareProfile() { 
        navigator.clipboard.writeText(window.location.href); 
        showToast('Посилання скопійовано!'); 
    }
    
    function reportProfile() { 
        showToast('Скаргу надіслано модератору'); 
    }

    function openConfirmModal(title, msg, onConfirm) {
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmModal = document.getElementById('confirmModal');
        const confirmBtn = document.getElementById('confirmActionBtn');
        
        if (confirmTitle) confirmTitle.textContent = title;
        if (confirmMessage) confirmMessage.textContent = msg;
        if (confirmModal) confirmModal.style.display = 'flex';
        if (confirmBtn) confirmBtn.onclick = () => { onConfirm(); closeModal('confirmModal'); };
    }

    function showToast(msg, type = 'success') {
        const t = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='error'?'#dc3545':'#00a49f'};color:#fff;padding:12px 20px;border-radius:8px;z-index:9999`;
        t.textContent = msg; 
        document.body.appendChild(t); 
        setTimeout(()=>t.remove(),2000);
    }
    
    function closeModal(id) { 
        const m = document.getElementById(id); 
        if (m) m.style.display = 'none'; 
    }

    // Робимо функції глобальними для HTML
    window.savePersonalData = savePersonalData;
    window.saveAccountType = saveAccountType;
    window.saveSocialLinks = saveSocialLinks;
    window.changePassword = changePassword;
    window.setup2FA = setup2FA;
    window.deactivateAccount = deactivateAccount;
    window.deleteAccount = deleteAccount;
    window.openAvatarModal = openAvatarModal;
    window.uploadPhoto = uploadPhoto;
    window.previewAvatar = previewAvatar;
    window.setAvatarColor = setAvatarColor;
    window.removePhoto = removePhoto;
    window.saveAvatar = saveAvatar;
    window.shareProfile = shareProfile;
    window.reportProfile = reportProfile;
    window.closeModal = closeModal;

    // ЗАПУСК
    initProfile();
})();