// ========== ГЛОБАЛЬНІ ДАНІ ==========
let allAds = [];
let currentUser = null;
let currentLang = 'uk';

const categories = [
    { id: 'electronics', name: '📱 Електроніка', name_en: '📱 Electronics', name_ru: '📱 Электроника' },
    { id: 'transport', name: '🚗 Транспорт', name_en: '🚗 Transport', name_ru: '🚗 Транспорт' },
    { id: 'home', name: '🏠 Дім і сад', name_en: '🏠 Home & Garden', name_ru: '🏠 Дом и сад' },
    { id: 'job', name: '💼 Робота', name_en: '💼 Jobs', name_ru: '💼 Работа' },
    { id: 'animals', name: '🐾 Тварини', name_en: '🐾 Animals', name_ru: '🐾 Животные' },
    { id: 'realty', name: '🏢 Нерухомість', name_en: '🏢 Realty', name_ru: '🏢 Недвижимость' },
    { id: 'fashion', name: '👗 Мода', name_en: '👗 Fashion', name_ru: '👗 Мода' },
    { id: 'hobby', name: '🎮 Хобі', name_en: '🎮 Hobby', name_ru: '🎮 Хобби' },
    { id: 'kids', name: '🧸 Дитячий світ', name_en: '🧸 Kids', name_ru: '🧸 Детский мир' },
    { id: 'free', name: '🎁 Віддам безкоштовно', name_en: '🎁 Free', name_ru: '🎁 Отдам бесплатно' }
];

const defaultAds = [
    { id: 1, title: "iPhone 13 Pro 128GB", price: 15000, description: "Відмінний стан", category: "electronics", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400", location: "Київ", date: new Date().toLocaleDateString(), views: 45 },
    { id: 2, title: "Велосипед Trek Marlin 5", price: 12000, description: "Гірський велосипед", category: "transport", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400", location: "Львів", date: new Date().toLocaleDateString(), views: 23 }
];

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', async () => {
    loadDataFromStorage();
    renderCategories();
    renderFeaturedAds();
    renderAllAds();
    checkLoginStatus();
});

function loadDataFromStorage() {
    const saved = localStorage.getItem('fastik_ads');
    if (saved) {
        allAds = JSON.parse(saved);
    } else {
        allAds = defaultAds;
        localStorage.setItem('fastik_ads', JSON.stringify(allAds));
    }
    
    const savedUser = localStorage.getItem('fastik_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function saveUser() {
    if (currentUser) {
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = categories.map(cat => `<div class="category-card" onclick="filterByCategory('${cat.id}')"><div class="category-icon">${cat.name.split(' ')[0]}</div><div class="category-name">${cat.name}</div></div>`).join('');
}

function renderFeaturedAds() {
    const container = document.getElementById('featuredAds');
    if (!container) return;
    container.innerHTML = allAds.slice(0, 4).map(ad => renderAdCard(ad)).join('');
}

function renderAllAds() {
    const container = document.getElementById('allAdsGrid');
    if (!container) return;
    container.innerHTML = allAds.map(ad => renderAdCard(ad)).join('');
}

function renderAdCard(ad) {
    return `<div class="ad-card" onclick="viewAdDetail(${ad.id})"><img class="ad-image" src="${ad.image}" alt="${ad.title}"><div class="ad-info"><div class="ad-price">${ad.price.toLocaleString()} грн</div><div class="ad-title">${ad.title}</div><div class="ad-location">📍 ${ad.location || 'Україна'}</div><div class="ad-date">📅 ${ad.date}</div></div></div>`;
}

function filterByCategory(categoryId) {
    window.location.href = `cabinet/pages/filters.html?cat=${categoryId}`;
}

function globalSearch() {
    const query = document.getElementById('globalSearch')?.value;
    if (query) {
        window.location.href = `cabinet/pages/filters.html?search=${encodeURIComponent(query)}`;
    }
}

function viewAdDetail(adId) {
    window.location.href = `cabinet/pages/ad-detail.html?id=${adId}`;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        currentUser = { email: email, name: email.split('@')[0], loggedIn: true };
        saveUser();
        closeModal('authModal');
        window.location.href = 'cabinet.html';
    } else {
        alert('Будь ласка, заповніть всі поля');
    }
}

function checkLoginStatus() {
    const loginBtn = document.querySelector('.login-btn');
    if (currentUser && currentUser.loggedIn && loginBtn) {
        loginBtn.textContent = `👤 ${currentUser.name}`;
        loginBtn.onclick = () => window.location.href = 'cabinet.html';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('fastik_user');
    location.reload();
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        currentLang = select.value;
        renderCategories();
    }
}

let currentPage = 1;
const adsPerPage = 6;

function loadMore() {
    currentPage++;
    const container = document.getElementById('allAdsGrid');
    if (container) {
        container.innerHTML = allAds.slice(0, currentPage * adsPerPage).map(ad => renderAdCard(ad)).join('');
    }
    if (currentPage * adsPerPage >= allAds.length) {
        const btn = document.getElementById('loadMoreBtn');
        if (btn) btn.style.display = 'none';
    }
}

if (document.getElementById('loadMoreBtn')) document.getElementById('loadMoreBtn').onclick = loadMore;
if (document.getElementById('langSelect')) document.getElementById('langSelect').onchange = changeLanguage;