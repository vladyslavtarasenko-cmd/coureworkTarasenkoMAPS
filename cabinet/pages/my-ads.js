(function() {
    // ВЕСЬ КОД ФАЙЛУ ТУТ


var myAds = [];

function loadMyAds() {
    const saved = localStorage.getItem('fastik_ads');
    if (saved) {
        myAds = JSON.parse(saved);
    }
    
    const container = document.getElementById('myAdsList');
    if (!container) return;
    
    if (myAds.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 У вас ще немає оголошень</div>';
        return;
    }
    
    container.innerHTML = myAds.map(ad => `
        <div class="ad-item">
            <img src="${ad.image || 'https://via.placeholder.com/70'}" alt="${ad.title}">
            <div class="ad-info">
                <h4>${ad.title}</h4>
                <p>${ad.price} грн</p>
                <small>ID: ${ad.id}</small>
            </div>
            <div class="ad-actions">
                <button class="btn-small" onclick="editAd(${ad.id})">Редагувати</button>
                <button class="btn-small danger" onclick="deleteAd(${ad.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function editAd(id) {
    const ad = myAds.find(a => a.id === id);
    if (ad) {
        const newTitle = prompt('Нова назва:', ad.title);
        const newPrice = prompt('Нова ціна:', ad.price);
        if (newTitle) ad.title = newTitle;
        if (newPrice) ad.price = parseFloat(newPrice);
        localStorage.setItem('fastik_ads', JSON.stringify(myAds));
        loadMyAds();
    }
}

function deleteAd(id) {
    if (confirm('Видалити оголошення?')) {
        myAds = myAds.filter(ad => ad.id !== id);
        localStorage.setItem('fastik_ads', JSON.stringify(myAds));
        loadMyAds();
    }
}

document.addEventListener('DOMContentLoaded', loadMyAds);


})();