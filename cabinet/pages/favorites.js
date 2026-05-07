// ========== ДАНІ ==========
let favoriteAds = [];
let savedSearches = [];
let recentViews = [];
let currentUser = null;

// Ліміти
const MAX_FAVORITES = 150;
const MAX_SAVED_SEARCHES = 50;
const MAX_RECENT = 30;

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadData();
    setupTabs();
    renderAll();
});

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = { name: 'Гість', email: 'guest@example.com' };
    }
}

function loadData() {
    // Завантаження обраних оголошень
    const savedFav = localStorage.getItem('fastik_favorites');
    if (savedFav) {
        favoriteAds = JSON.parse(savedFav);
    } else {
        // Демо-дані
        const allAds = JSON.parse(localStorage.getItem('fastik_ads') || '[]');
        favoriteAds = allAds.slice(0, 2).map(ad => ({
            ...ad,
            savedAt: new Date().toISOString()
        }));
        saveFavorites();
    }
    
    // Завантаження збережених пошуків
    const savedSearchesData = localStorage.getItem('fastik_saved_searches');
    if (savedSearchesData) {
        savedSearches = JSON.parse(savedSearchesData);
    } else {
        savedSearches = [
            {
                id: 1,
                name: 'iPhone до 15000 грн',
                query: 'iPhone',
                minPrice: 0,
                maxPrice: 15000,
                category: 'electronics',
                date: new Date().toLocaleDateString('uk-UA')
            },
            {
                id: 2,
                name: 'Велосипеди Київ',
                query: 'велосипед',
                location: 'Київ',
                category: 'transport',
                date: new Date().toLocaleDateString('uk-UA')
            }
        ];
        saveSearches();
    }
    
    // Завантаження недавніх переглядів
    const savedRecent = localStorage.getItem('fastik_recent_views');
    if (savedRecent) {
        recentViews = JSON.parse(savedRecent);
    } else {
        const allAds = JSON.parse(localStorage.getItem('fastik_ads') || '[]');
        recentViews = allAds.slice(0, 3).map(ad => ({
            ...ad,
            viewedAt: new Date().toISOString()
        }));
        saveRecent();
    }
    
    updateCounters();
}

// ========== ЗБЕРЕЖЕННЯ ==========
function saveFavorites() {
    localStorage.setItem('fastik_favorites', JSON.stringify(favoriteAds));
}

function saveSearches() {
    localStorage.setItem('fastik_saved_searches', JSON.stringify(savedSearches));
}

function saveRecent() {
    localStorage.setItem('fastik_recent_views', JSON.stringify(recentViews));
}

// ========== ОНОВЛЕННЯ ЛІЧИЛЬНИКІВ ==========
function updateCounters() {
    const favCount = document.getElementById('favAdsCount');
    const searchCount = document.getElementById('favSearchesCount');
    const recentCount = document.getElementById('favRecentCount');
    
    if (favCount) favCount.textContent = favoriteAds.length;
    if (searchCount) searchCount.textContent = savedSearches.length;
    if (recentCount) recentCount.textContent = recentViews.length;
}

// ========== РЕНДЕР ВСІХ ВКЛАДОК ==========
function renderAll() {
    renderFavorites();
    renderSavedSearches();
    renderRecentViews();
}

// ========== ОБРАНІ ОГОЛОШЕННЯ ==========
function renderFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    if (favoriteAds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Немає обраних оголошень</h3>
                <p>Натисніть ♡ на оголошенні, щоб зберегти його тут</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = favoriteAds.map(ad => `
        <div class="fav-card" onclick="viewAd(${ad.id})">
            <img class="fav-card-image" src="${ad.image || 'https://via.placeholder.com/300x180?text=FasTik'}" alt="${ad.title}">
            <button class="fav-card-remove" onclick="event.stopPropagation(); removeFromFavorites(${ad.id})">×</button>
            <div class="fav-card-info">
                <div class="fav-card-price">${ad.price.toLocaleString()} грн</div>
                <div class="fav-card-title">${ad.title}</div>
                <div class="fav-card-location">📍 ${ad.location || 'Україна'}</div>
                <div class="fav-card-date">⭐ Збережено: ${new Date(ad.savedAt).toLocaleDateString('uk-UA')}</div>
            </div>
        </div>
    `).join('');
}

function addToFavorites(ad) {
    if (favoriteAds.length >= MAX_FAVORITES) {
        alert(`Досягнуто ліміту (${MAX_FAVORITES}) обраних оголошень`);
        return;
    }
    
    if (!favoriteAds.find(fav => fav.id === ad.id)) {
        favoriteAds.unshift({
            ...ad,
            savedAt: new Date().toISOString()
        });
        saveFavorites();
        renderFavorites();
        updateCounters();
        showNotification('Додано в обрані');
    }
}

function removeFromFavorites(adId) {
    favoriteAds = favoriteAds.filter(ad => ad.id !== adId);
    saveFavorites();
    renderFavorites();
    updateCounters();
    showNotification('Видалено з обраних');
}

function clearAllFavorites() {
    if (confirm('Видалити всі обрані оголошення?')) {
        favoriteAds = [];
        saveFavorites();
        renderFavorites();
        updateCounters();
    }
}

// ========== ЗБЕРЕЖЕНІ ПОШУКИ ==========
function renderSavedSearches() {
    const container = document.getElementById('savedSearchesList');
    if (!container) return;
    
    if (savedSearches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>Немає збережених пошуків</h3>
                <p>Збережіть параметри пошуку, щоб швидко знаходити потрібні оголошення</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedSearches.map(search => `
        <div class="search-item">
            <div class="search-info">
                <h4>${escapeHtml(search.name)}</h4>
                <p>${getSearchDescription(search)}</p>
                <div class="search-date">📅 Збережено: ${search.date}</div>
            </div>
            <div class="search-actions">
                <button class="search-run" onclick="runSearch(${search.id})" title="Виконати пошук">🔍</button>
                <button class="search-delete" onclick="deleteSearch(${search.id})" title="Видалити">🗑️</button>
            </div>
        </div>
    `).join('');
}

function getSearchDescription(search) {
    const parts = [];
    if (search.query) parts.push(`"${search.query}"`);
    if (search.minPrice && search.maxPrice) parts.push(`💰 ${search.minPrice}-${search.maxPrice} грн`);
    else if (search.minPrice) parts.push(`💰 від ${search.minPrice} грн`);
    else if (search.maxPrice) parts.push(`💰 до ${search.maxPrice} грн`);
    if (search.category) parts.push(`📁 ${getCategoryName(search.category)}`);
    if (search.location) parts.push(`📍 ${search.location}`);
    return parts.join(' · ') || 'Всі параметри';
}

function getCategoryName(catId) {
    const categories = {
        electronics: 'Електроніка',
        transport: 'Транспорт',
        home: 'Дім і сад',
        job: 'Робота',
        animals: 'Тварини',
        realty: 'Нерухомість',
        fashion: 'Мода',
        hobby: 'Хобі',
        kids: 'Дитячий світ',
        free: 'Безкоштовно'
    };
    return categories[catId] || catId;
}

function saveSearch(searchData) {
    if (savedSearches.length >= MAX_SAVED_SEARCHES) {
        alert(`Досягнуто ліміту (${MAX_SAVED_SEARCHES}) збережених пошуків`);
        return;
    }
    
    const newSearch = {
        id: Date.now(),
        ...searchData,
        date: new Date().toLocaleDateString('uk-UA')
    };
    
    savedSearches.unshift(newSearch);
    saveSearches();
    renderSavedSearches();
    updateCounters();
    showNotification('Пошук збережено');
}

function runSearch(searchId) {
    const search = savedSearches.find(s => s.id === searchId);
    if (search) {
        let url = 'filters.html?';
        if (search.query) url += `search=${encodeURIComponent(search.query)}&`;
        if (search.minPrice) url += `minPrice=${search.minPrice}&`;
        if (search.maxPrice) url += `maxPrice=${search.maxPrice}&`;
        if (search.category) url += `category=${search.category}&`;
        if (search.location) url += `location=${encodeURIComponent(search.location)}`;
        window.location.href = url;
    }
}

function deleteSearch(searchId) {
    if (confirm('Видалити збережений пошук?')) {
        savedSearches = savedSearches.filter(s => s.id !== searchId);
        saveSearches();
        renderSavedSearches();
        updateCounters();
    }
}

function saveCurrentSearch() {
    const name = document.getElementById('searchName').value;
    if (!name) {
        alert('Введіть назву пошуку');
        return;
    }
    
    // Отримання поточних параметрів з URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchData = {
        name: name,
        query: urlParams.get('search') || '',
        minPrice: urlParams.get('minPrice') || null,
        maxPrice: urlParams.get('maxPrice') || null,
        category: urlParams.get('category') || null,
        location: urlParams.get('location') || null
    };
    
    saveSearch(searchData);
    closeModal('saveSearchModal');
    document.getElementById('searchName').value = '';
}

// ========== НЕДАВНО ПЕРЕГЛЯНУТІ ==========
function renderRecentViews() {
    const container = document.getElementById('recentList');
    if (!container) return;
    
    if (recentViews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🕐</div>
                <h3>Немає недавніх переглядів</h3>
                <p>Переглянуті оголошення з'являться тут</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentViews.map(ad => `
        <div class="fav-card" onclick="viewAd(${ad.id})">
            <img class="fav-card-image" src="${ad.image || 'https://via.placeholder.com/300x180?text=FasTik'}" alt="${ad.title}">
            <div class="fav-card-info">
                <div class="fav-card-price">${ad.price.toLocaleString()} грн</div>
                <div class="fav-card-title">${ad.title}</div>
                <div class="fav-card-location">📍 ${ad.location || 'Україна'}</div>
                <div class="fav-card-date">🕐 Переглянуто: ${formatRelativeTime(ad.viewedAt)}</div>
            </div>
        </div>
    `).join('');
}

function addToRecent(ad) {
    // Видаляємо дублікат якщо є
    recentViews = recentViews.filter(item => item.id !== ad.id);
    
    // Додаємо в початок
    recentViews.unshift({
        ...ad,
        viewedAt: new Date().toISOString()
    });
    
    // Обрізаємо до ліміту
    if (recentViews.length > MAX_RECENT) {
        recentViews = recentViews.slice(0, MAX_RECENT);
    }
    
    saveRecent();
    renderRecentViews();
    updateCounters();
}

function clearAllRecent() {
    if (confirm('Очистити історію переглядів?')) {
        recentViews = [];
        saveRecent();
        renderRecentViews();
        updateCounters();
    }
}

function formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'щойно';
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffHours < 48) return 'вчора';
    return date.toLocaleDateString('uk-UA');
}

// ========== ЗАГАЛЬНІ ФУНКЦІЇ ==========
function setupTabs() {
    const tabs = document.querySelectorAll('.fav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.fav-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`favorites${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');
        });
    });
}

function viewAd(adId) {
    window.location.href = `ad-detail.html?id=${adId}`;
}

function showNotification(message) {
    // Просте сповіщення
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #002f34;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Додаємо CSS анімацію
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