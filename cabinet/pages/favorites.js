var favoriteAds = [];
var savedSearches = [];
var recentViews = [];
const MAX_FAVORITES = 150;
const MAX_SAVED_SEARCHES = 50;
const MAX_RECENT = 30;

function initFavorites() {
    loadData();
    setupTabs();
    renderAll();
}

function loadData() {
    let savedFav = localStorage.getItem('fastik_favorites');
    if(savedFav) favoriteAds = JSON.parse(savedFav);
    else { favoriteAds = []; saveFavorites(); }
    
    let savedSearchesData = localStorage.getItem('fastik_saved_searches');
    if(savedSearchesData) savedSearches = JSON.parse(savedSearchesData);
    else { savedSearches = []; saveSearches(); }
    
    let savedRecent = localStorage.getItem('fastik_recent_views');
    if(savedRecent) recentViews = JSON.parse(savedRecent);
    else { recentViews = []; saveRecent(); }
    
    updateCounters();
}

function saveFavorites() { localStorage.setItem('fastik_favorites', JSON.stringify(favoriteAds)); }
function saveSearches() { localStorage.setItem('fastik_saved_searches', JSON.stringify(savedSearches)); }
function saveRecent() { localStorage.setItem('fastik_recent_views', JSON.stringify(recentViews)); }

function updateCounters() {
    let fc = document.getElementById('favAdsCount'); if(fc) fc.textContent = favoriteAds.length;
    let sc = document.getElementById('favSearchesCount'); if(sc) sc.textContent = savedSearches.length;
    let rc = document.getElementById('favRecentCount'); if(rc) rc.textContent = recentViews.length;
}

function renderAll() { renderFavorites(); renderSavedSearches(); renderRecentViews(); }

function renderFavorites() {
    let c = document.getElementById('favoritesList');
    if(!c) return;
    if(favoriteAds.length===0) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">❤️</div><h3>Немає обраних</h3><p>Натисніть ♡ на оголошенні</p></div>'; return; }
    c.innerHTML = favoriteAds.map(ad => `
        <div class="fav-card" onclick="viewAd(${ad.id})">
            <img class="fav-card-image" src="${ad.image || 'https://via.placeholder.com/300x180'}" alt="${ad.title}">
            <button class="fav-card-remove" onclick="event.stopPropagation(); removeFromFavorites(${ad.id})">×</button>
            <div class="fav-card-info"><div class="fav-card-price">${ad.price} грн</div><div class="fav-card-title">${ad.title}</div><div class="fav-card-location">📍 ${ad.location || 'Україна'}</div><div class="fav-card-date">⭐ ${new Date(ad.savedAt).toLocaleDateString()}</div></div>
        </div>
    `).join('');
}

function addToFavorites(ad) {
    if(favoriteAds.length>=MAX_FAVORITES) { alert(`Ліміт ${MAX_FAVORITES}`); return; }
    if(!favoriteAds.find(f=>f.id===ad.id)) { favoriteAds.unshift({...ad, savedAt:new Date().toISOString()}); saveFavorites(); renderFavorites(); updateCounters(); showToast('Додано в обрані'); }
}

function removeFromFavorites(id) { favoriteAds = favoriteAds.filter(a=>a.id!==id); saveFavorites(); renderFavorites(); updateCounters(); showToast('Видалено'); }
function clearAllFavorites() { if(confirm('Видалити всі?')){ favoriteAds=[]; saveFavorites(); renderFavorites(); updateCounters(); } }

function renderSavedSearches() {
    let c = document.getElementById('savedSearchesList');
    if(!c) return;
    if(savedSearches.length===0) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>Немає збережених пошуків</h3></div>'; return; }
    c.innerHTML = savedSearches.map(s => `
        <div class="search-item"><div class="search-info"><h4>${escapeHtml(s.name)}</h4><p>${getSearchDesc(s)}</p><div class="search-date">📅 ${s.date}</div></div><div class="search-actions"><button class="search-run" onclick="runSearch(${s.id})">🔍</button><button class="search-delete" onclick="deleteSearch(${s.id})">🗑️</button></div></div>
    `).join('');
}

function getSearchDesc(s) {
    let p = [];
    if(s.query) p.push(`"${s.query}"`);
    if(s.minPrice && s.maxPrice) p.push(`💰 ${s.minPrice}-${s.maxPrice} грн`);
    else if(s.minPrice) p.push(`💰 від ${s.minPrice} грн`);
    else if(s.maxPrice) p.push(`💰 до ${s.maxPrice} грн`);
    if(s.category) p.push(`📁 ${s.category}`);
    if(s.location) p.push(`📍 ${s.location}`);
    return p.join(' · ') || 'Всі параметри';
}

function saveSearch(data) {
    if(savedSearches.length>=MAX_SAVED_SEARCHES) { alert(`Ліміт ${MAX_SAVED_SEARCHES}`); return; }
    savedSearches.unshift({id:Date.now(), date:new Date().toLocaleDateString('uk-UA'), ...data});
    saveSearches(); renderSavedSearches(); updateCounters(); showToast('Пошук збережено');
}

function runSearch(id) {
    let s = savedSearches.find(s=>s.id===id);
    if(s) alert(`Пошук: ${s.name}\nПараметри: ${getSearchDesc(s)}`);
}
function deleteSearch(id) { if(confirm('Видалити?')){ savedSearches=savedSearches.filter(s=>s.id!==id); saveSearches(); renderSavedSearches(); updateCounters(); } }
function saveCurrentSearch() { let n=document.getElementById('searchName')?.value; if(n){ saveSearch({name:n, query:'', date:new Date().toLocaleDateString('uk-UA')}); closeModal('saveSearchModal'); document.getElementById('searchName').value=''; } else alert('Введіть назву'); }

function renderRecentViews() {
    let c = document.getElementById('recentList');
    if(!c) return;
    if(recentViews.length===0) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">🕐</div><h3>Немає переглядів</h3></div>'; return; }
    c.innerHTML = recentViews.map(ad => `
        <div class="fav-card" onclick="viewAd(${ad.id})">
            <img class="fav-card-image" src="${ad.image || 'https://via.placeholder.com/300x180'}">
            <div class="fav-card-info"><div class="fav-card-price">${ad.price} грн</div><div class="fav-card-title">${ad.title}</div><div class="fav-card-location">📍 ${ad.location || 'Україна'}</div><div class="fav-card-date">🕐 ${formatTime(ad.viewedAt)}</div></div>
        </div>
    `).join('');
}

function addToRecent(ad) {
    recentViews = recentViews.filter(i=>i.id!==ad.id);
    recentViews.unshift({...ad, viewedAt:new Date().toISOString()});
    if(recentViews.length>MAX_RECENT) recentViews=recentViews.slice(0,MAX_RECENT);
    saveRecent(); renderRecentViews(); updateCounters();
}
function clearAllRecent() { if(confirm('Очистити історію?')){ recentViews=[]; saveRecent(); renderRecentViews(); updateCounters(); } }
function formatTime(d) { let date=new Date(d), now=new Date(), h=Math.floor((now-date)/(1000*60*60)); if(h<1) return 'щойно'; if(h<24) return `${h} год тому`; if(h<48) return 'вчора'; return date.toLocaleDateString(); }

function setupTabs() {
    document.querySelectorAll('.fav-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
            let id=tab.dataset.tab;
            document.querySelectorAll('.fav-tab').forEach(t=>t.classList.remove('active'));
            document.querySelectorAll('.fav-content').forEach(c=>c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`favorites${id.charAt(0).toUpperCase()+id.slice(1)}`).classList.add('active');
        });
    });
}
function viewAd(id) { alert(`Перегляд оголошення #${id}`); }
function showToast(m) { let t=document.createElement('div'); t.style.cssText='position:fixed;bottom:20px;right:20px;background:#002f34;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999'; t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(),2000); }
function closeModal(id) { let m=document.getElementById(id); if(m) m.style.display='none'; }
function escapeHtml(t) { let d=document.createElement('div'); d.textContent=t; return d.innerHTML; }

initFavorites();