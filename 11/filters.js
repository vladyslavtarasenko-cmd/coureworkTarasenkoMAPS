// ========== ДАНІ ==========
let allAds = [];
let filteredAds = [];
let currentView = 'grid';
let currentLimit = 12;
let currentLoadMore = 12;

// Підкатегорії
const subcategories = {
    electronics: ["Смартфони", "Ноутбуки", "Планшети", "Телевізори", "Аудіотехніка"],
    transport: ["Легкові авто", "Мотоцикли", "Велосипеди", "Вантажівки", "Запчастини"],
    home: ["Меблі", "Побутова техніка", "Декор", "Інструменти", "Кухонне приладдя"],
    fashion: ["Чоловічий одяг", "Жіночий одяг", "Взуття", "Аксесуари"],
    hobby: ["Спортінвентар", "Книги", "Іграшки", "Музичні інструменти"]
};

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAds();
    setupCategoryListener();
    loadFiltersFromURL();
    applyFilters();
});

function loadAds() {
    const saved = localStorage.getItem('fastik_ads');
    if (saved) {
        allAds = JSON.parse(saved);
    } else {
        // Демо-дані
        allAds = [
            { id: 1, title: "iPhone 13 Pro", price: 15000, category: "electronics", location: "Київ", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400", date: "10.04.2025", condition: "used" },
            { id: 2, title: "Велосипед Trek", price: 12000, category: "transport", location: "Львів", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400", date: "08.04.2025", condition: "used" },
            { id: 3, title: "Диван кутовий", price: 8500, category: "home", location: "Одеса", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", date: "05.04.2025", condition: "new" }
        ];
        localStorage.setItem('fastik_ads', JSON.stringify(allAds));
    }
}

// ========== ФІЛЬТРИ ==========
function applyFilters() {
    let results = [...allAds];
    
    // Категорія
    const category = document.getElementById('filterCategory').value;
    if (category !== 'all') {
        results = results.filter(ad => ad.category === category);
    }
    
    // Підкатегорія
    const subcategory = document.getElementById('filterSubcategory').value;
    if (subcategory && subcategory !== 'all') {
        results = results.filter(ad => ad.subcategory === subcategory);
    }
    
    // Ціна
    const minPrice = parseFloat(document.getElementById('minPrice').value);
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const freeChecked = document.querySelector('#filtersForm input[value="0"]')?.checked;
    const negotiableChecked = document.querySelector('#filtersForm input[value="negotiable"]')?.checked;
    
    results = results.filter(ad => {
        if (freeChecked && ad.price === 0) return true;
        if (negotiableChecked && ad.isNegotiable) return true;
        if (minPrice && ad.price < minPrice) return false;
        if (maxPrice && ad.price > maxPrice) return false;
        return true;
    });
    
    // Локація
    const location = document.getElementById('filterLocation').value.toLowerCase();
    if (location) {
        results = results.filter(ad => ad.location?.toLowerCase().includes(location));
    }
    
    // Стан
    const newChecked = document.querySelector('#conditionGroup input[value="new"]')?.checked;
    const usedChecked = document.querySelector('#conditionGroup input[value="used"]')?.checked;
    if (newChecked || usedChecked) {
        results = results.filter(ad => {
            if (newChecked && ad.condition === 'new') return true;
            if (usedChecked && ad.condition === 'used') return true;
            return false;
        });
    }
    
    // Тільки з фото
    const withPhoto = document.getElementById('withPhoto').checked;
    if (withPhoto) {
        results = results.filter(ad => ad.image && ad.image !== '');
    }
    
    // Сортування
    const sortBy = document.getElementById('sortBy').value;
    results = sortResults(results, sortBy);
    
    filteredAds = results;
    updateURL();
    renderActiveFilters();
    renderResults();
}

function sortResults(results, sortBy) {
    switch(sortBy) {
        case 'date_desc':
            return results.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'date_asc':
            return results.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'price_asc':
            return results.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return results.sort((a, b) => b.price - a.price);
        case 'popular':
            return results.sort((a, b) => (b.views || 0) - (a.views || 0));
        default:
            return results;
    }
}

function renderResults() {
    const container = document.getElementById('resultsGrid');
    const count = document.getElementById('resultsCount');
    const limited = filteredAds.slice(0, currentLimit);
    
    count.textContent = `Знайдено ${filteredAds.length} оголошень`;
    
    if (limited.length === 0) {
        container.innerHTML = `
            <div class="empty-results">
                <div class="empty-icon">🔍</div>
                <h3>Нічого не знайдено</h3>
                <p>Спробуйте змінити параметри пошуку</p>
            </div>
        `;
        document.getElementById('loadMoreContainer').style.display = 'none';
        return;
    }
    
    container.className = `results-grid ${currentView === 'list' ? 'list-view' : ''}`;
    container.innerHTML = limited.map(ad => renderAdCard(ad)).join('');
    
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (filteredAds.length > currentLimit) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

function renderAdCard(ad) {
    return `
        <div class="ad-card" onclick="viewAd(${ad.id})">
            <img src="${ad.image || 'https://via.placeholder.com/400x200?text=FasTik'}" alt="${ad.title}">
            <div class="ad-info">
                <div class="ad-price">${ad.price === 0 ? 'Безкоштовно' : ad.price.toLocaleString() + ' грн'}</div>
                <div class="ad-title">${ad.title}</div>
                <div class="ad-location">📍 ${ad.location || 'Україна'}</div>
                <div class="ad-date">📅 ${ad.date}</div>
            </div>
        </div>
    `;
}

function renderActiveFilters() {
    const container = document.getElementById('activeFilters');
    const filters = [];
    
    const category = document.getElementById('filterCategory').value;
    if (category !== 'all') {
        filters.push({ name: getCategoryName(category), type: 'category', value: category });
    }
    
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    if (minPrice || maxPrice) {
        filters.push({ name: `Ціна: ${minPrice || '0'} - ${maxPrice || '∞'} грн`, type: 'price' });
    }
    
    const location = document.getElementById('filterLocation').value;
    if (location) {
        filters.push({ name: `📍 ${location}`, type: 'location' });
    }
    
    container.innerHTML = filters.map(f => `
        <div class="filter-tag">
            ${f.name}
            <button onclick="removeFilter('${f.type}')">×</button>
        </div>
    `).join('');
}

function removeFilter(type) {
    if (type === 'category') {
        document.getElementById('filterCategory').value = 'all';
    } else if (type === 'price') {
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
    } else if (type === 'location') {
        document.getElementById('filterLocation').value = '';
    }
    applyFilters();
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
        hobby: 'Хобі'
    };
    return categories[catId] || catId;
}

function resetFilters() {
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterSubcategory').value = 'all';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('withPhoto').checked = false;
    document.getElementById('sortBy').value = 'date_desc';
    document.querySelectorAll('#conditionGroup input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.price-checkboxes input').forEach(cb => cb.checked = false);
    
    applyFilters();
}

function loadMore() {
    currentLimit += 12;
    renderResults();
}

function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.view-btn[data-view="${view}"]`).classList.add('active');
    renderResults();
}

function viewAd(adId) {
    window.location.href = `ad-detail.html?id=${adId}`;
}

function setupCategoryListener() {
    const categorySelect = document.getElementById('filterCategory');
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        const subcatGroup = document.getElementById('subcategoryGroup');
        const subcatSelect = document.getElementById('filterSubcategory');
        
        if (subcategories[category]) {
            subcatGroup.style.display = 'block';
            subcatSelect.innerHTML = '<option value="all">Всі</option>' + 
                subcategories[category].map(sub => `<option value="${sub}">${sub}</option>`).join('');
        } else {
            subcatGroup.style.display = 'none';
        }
        applyFilters();
    });
}

function updateURL() {
    const params = new URLSearchParams();
    const category = document.getElementById('filterCategory').value;
    if (category !== 'all') params.set('category', category);
    const search = document.getElementById('filterLocation').value;
    if (search) params.set('search', search);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) {
        document.getElementById('filterCategory').value = params.get('category');
        setupCategoryListener();
        applyFilters();
    }
    if (params.has('search')) {
        document.getElementById('filterLocation').value = params.get('search');
        applyFilters();
    }
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}