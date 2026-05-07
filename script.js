// ========== ЗАВАНТАЖЕННЯ ДАНИХ З JSON (ВАША СТРУКТУРА) ==========
async function loadDataFromJSON() {
    try {
        // ВАЖЛИВО: шлях до ваших JSON файлів (assets/images/data/)
        const [adsRes, usersRes, messagesRes, paymentsRes] = await Promise.all([
            fetch('assets/images/data/ads.json'),
            fetch('assets/images/data/users.json'),
            fetch('assets/images/data/messages.json'),
            fetch('assets/images/data/payments.json')
        ]);
        
        const adsData = await adsRes.json();
        const usersData = await usersRes.json();
        const messagesData = await messagesRes.json();
        const paymentsData = await paymentsRes.json();
        
        // Збереження в localStorage
        localStorage.setItem('fastik_ads', JSON.stringify(adsData.ads));
        localStorage.setItem('fastik_users', JSON.stringify(usersData.users));
        localStorage.setItem('fastik_messages', JSON.stringify(messagesData.messages));
        localStorage.setItem('fastik_payments', JSON.stringify(paymentsData.transactions));
        
        console.log('✅ Дані з JSON успішно завантажено!');
        console.log(`📦 Оголошень: ${adsData.ads?.length || 0}`);
        console.log(`👤 Користувачів: ${usersData.users?.length || 0}`);
        
        return { adsData, usersData, messagesData, paymentsData };
    } catch (error) {
        console.error('❌ Помилка завантаження даних з JSON:', error);
        console.log('⚠️ Використовуються дефолтні дані');
        return null;
    }
}

// ========== ГЛОБАЛЬНІ ДАНІ ==========
let allAds = [];
let currentUser = null;
let currentLang = 'uk';

// Категорії
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

// Початкові оголошення (дефолтні, якщо JSON не завантажився)
const defaultAds = [
    {
        id: 1,
        title: "iPhone 13 Pro 128GB",
        price: 15000,
        description: "Відмінний стан, повний комплект",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400",
        location: "Київ",
        date: new Date().toLocaleDateString(),
        views: 45
    },
    {
        id: 2,
        title: "Велосипед Trek Marlin 5",
        price: 12000,
        description: "Гірський велосипед, рама L",
        category: "transport",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
        location: "Львів",
        date: new Date().toLocaleDateString(),
        views: 23
    },
    {
        id: 3,
        title: "Диван кутовий",
        price: 8500,
        description: "Розкладний диван, сірий колір",
        category: "home",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
        location: "Одеса",
        date: new Date().toLocaleDateString(),
        views: 67
    },
    {
        id: 4,
        title: "MacBook Air M1",
        price: 28000,
        description: "8GB RAM, 256GB SSD",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
        location: "Київ",
        date: new Date().toLocaleDateString(),
        views: 89
    },
    {
        id: 5,
        title: "Samsung Galaxy S21",
        price: 12000,
        description: "Відмінний стан, є гарантія",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        location: "Харків",
        date: new Date().toLocaleDateString(),
        views: 34
    },
    {
        id: 6,
        title: "Ноутбук Dell XPS 15",
        price: 35000,
        description: "Для роботи та ігор",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
        location: "Дніпро",
        date: new Date().toLocaleDateString(),
        views: 56
    }
];

// ========== ІНІЦІАЛІЗАЦІЯ (ГОЛОВНА) ==========
document.addEventListener('DOMContentLoaded', async () => {
    // 1. СПОЧАТКУ завантажуємо дані з JSON
    const jsonData = await loadDataFromJSON();
    
    // 2. ПОТІМ завантажуємо дані з localStorage (або дефолтні)
    loadDataFromStorage();
    
    // 3. Якщо JSON завантажився і в localStorage пусто - копіюємо з JSON
    if (jsonData && jsonData.adsData && jsonData.adsData.ads) {
        const saved = localStorage.getItem('fastik_ads');
        if (!saved || JSON.parse(saved).length === 0) {
            allAds = jsonData.adsData.ads;
            localStorage.setItem('fastik_ads', JSON.stringify(allAds));
        }
    }
    
    // 4. Рендеримо сторінку
    renderCategories();
    renderFeaturedAds();
    renderAllAds();
    checkLoginStatus();
    
    console.log('✅ Сторінка повністю завантажена!');
});

// Завантаження даних з localStorage
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

// Збереження даних
function saveAds() {
    localStorage.setItem('fastik_ads', JSON.stringify(allAds));
}

function saveUser() {
    if (currentUser) {
        localStorage.setItem('fastik_user', JSON.stringify(currentUser));
    }
}

// ========== РЕНДЕР КАТЕГОРІЙ ==========
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.id}')">
            <div class="category-icon">${cat.name.split(' ')[0]}</div>
            <div class="category-name">${getCategoryName(cat)}</div>
        </div>
    `).join('');
}

function getCategoryName(cat) {
    if (currentLang === 'en') return cat.name_en || cat.name.split(' ')[1];
    if (currentLang === 'ru') return cat.name_ru || cat.name.split(' ')[1];
    return cat.name;
}

// ========== РЕНДЕР ОГОЛОШЕНЬ ==========
function renderFeaturedAds() {
    const container = document.getElementById('featuredAds');
    if (!container) return;
    
    const featured = allAds.slice(0, 4);
    container.innerHTML = featured.map(ad => renderAdCard(ad)).join('');
}

function renderAllAds() {
    const container = document.getElementById('allAdsGrid');
    if (!container) return;
    
    container.innerHTML = allAds.map(ad => renderAdCard(ad)).join('');
}

function renderAdCard(ad) {
    return `
        <div class="ad-card" onclick="viewAdDetail(${ad.id})">
            <img class="ad-image" src="${ad.image}" alt="${ad.title}" onerror="this.src='https://via.placeholder.com/400?text=FasTik'">
            <div class="ad-info">
                <div class="ad-price">${ad.price.toLocaleString()} грн</div>
                <div class="ad-title">${ad.title}</div>
                <div class="ad-location">📍 ${ad.location || 'Україна'}</div>
                <div class="ad-date">📅 ${ad.date}</div>
            </div>
        </div>
    `;
}

// ========== ФІЛЬТРАЦІЯ ==========
function filterByCategory(categoryId) {
    window.location.href = `filters.html?cat=${categoryId}`;
}

function globalSearch() {
    const query = document.getElementById('globalSearch').value;
    if (query) {
        window.location.href = `filters.html?search=${encodeURIComponent(query)}`;
    }
}

// ========== ПЕРЕГЛЯД ОГОЛОШЕННЯ ==========
function viewAdDetail(adId) {
    window.location.href = `ad-detail.html?id=${adId}`;
}

// ========== МОДАЛЬНІ ВІКНА ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// ========== ЛОГІН ==========
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0],
            loggedIn: true
        };
        saveUser();
        closeModal('authModal');
        checkLoginStatus();
        alert(`Вітаємо, ${currentUser.name}!`);
        location.reload();
    } else {
        alert('Будь ласка, заповніть всі поля');
    }
}

function checkLoginStatus() {
    const loginBtn = document.querySelector('.login-btn');
    const cabinetBtn = document.getElementById('cabinetBtn');
    
    if (currentUser && currentUser.loggedIn) {
        if (loginBtn) {
            loginBtn.textContent = `👤 ${currentUser.name}`;
            loginBtn.onclick = () => window.location.href = 'cabinet.html';
        }
        if (cabinetBtn) {
            cabinetBtn.style.display = 'inline-block';
        }
    } else {
        if (cabinetBtn) {
            cabinetBtn.style.display = 'none';
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('fastik_user');
    location.reload();
}

// ========== ЗМІНА МОВИ ==========
function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        currentLang = select.value;
        renderCategories();
        console.log(`Мову змінено на: ${currentLang}`);
    }
}

// ========== ЗАВАНТАЖЕННЯ ЩЕ ==========
let currentPage = 1;
const adsPerPage = 6;

function loadMore() {
    currentPage++;
    const end = currentPage * adsPerPage;
    const container = document.getElementById('allAdsGrid');
    const moreAds = allAds.slice(0, end);
    container.innerHTML = moreAds.map(ad => renderAdCard(ad)).join('');
    
    if (end >= allAds.length) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

// Підключення кнопки після завантаження DOM
if (document.getElementById('loadMoreBtn')) {
    document.getElementById('loadMoreBtn').onclick = loadMore;
}
if (document.getElementById('langSelect')) {
    document.getElementById('langSelect').onchange = changeLanguage;
}

// ========== ДОДАВАННЯ ОГОЛОШЕННЯ ==========
function addNewAd(adData) {
    const newAd = {
        id: Date.now(),
        ...adData,
        date: new Date().toLocaleDateString(),
        views: 0
    };
    allAds.unshift(newAd);
    saveAds();
    return newAd;
}

// ========== ДОДАТКОВА ФУНКЦІЯ ДЛЯ ПЕРЕВІРКИ ==========
function showDataInfo() {
    console.log('===== ІНФОРМАЦІЯ ПРО ДАНІ =====');
    console.log(`📦 Оголошень в allAds: ${allAds.length}`);
    console.log(`👤 Поточний користувач:`, currentUser);
    console.log(`🌐 Поточна мова: ${currentLang}`);
    console.log(`💾 localStorage fastik_ads: ${localStorage.getItem('fastik_ads')?.length || 0} байт`);
}