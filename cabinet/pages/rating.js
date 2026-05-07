// ========== ДАНІ ==========
let currentUser = null;
let userRatings = [];
let givenRatings = [];
let receivedRatings = [];
let toRateList = [];
let selectedRating = 0;
let currentRateItem = null;

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadData();
    setupTabs();
    renderAll();
    setupStarRating();
});

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = { name: 'Владислав', email: 'vlad@example.com' };
    }
}

function loadData() {
    // Отримані оцінки (про мене)
    const savedReceived = localStorage.getItem('fastik_received_ratings');
    if (savedReceived) {
        receivedRatings = JSON.parse(savedReceived);
    } else {
        receivedRatings = [
            {
                id: 1,
                reviewer: 'Світлана',
                reviewerAvatar: 'С',
                rating: 5,
                text: 'Дуже хороший продавець! Товар відповідає опису, швидко відправив. Рекомендую!',
                pros: 'Швидка доставка, якісний товар',
                cons: '',
                date: '15.03.2025',
                product: 'iPhone 13 Pro 128GB',
                productId: 1,
                photos: []
            },
            {
                id: 2,
                reviewer: 'Олександр',
                reviewerAvatar: 'О',
                rating: 5,
                text: 'Все супер! Домовились швидко, отримав що хотів.',
                pros: 'Адекватне спілкування',
                cons: '',
                date: '20.03.2025',
                product: 'Велосипед Trek',
                productId: 2,
                photos: []
            },
            {
                id: 3,
                reviewer: 'Марія',
                reviewerAvatar: 'М',
                rating: 4,
                text: 'Гарний диван, трохи довше їхала доставка, але в цілому добре.',
                pros: 'Якісний товар',
                cons: 'Довга доставка',
                date: '28.03.2025',
                product: 'Диван кутовий',
                productId: 3,
                photos: []
            },
            {
                id: 4,
                reviewer: 'Андрій',
                reviewerAvatar: 'А',
                rating: 5,
                text: 'Чудовий продавець! Відповідає швидко, все розповів. Дякую!',
                pros: 'Клієнтоорієнтованість',
                cons: '',
                date: '05.04.2025',
                product: 'MacBook Air M1',
                productId: 4,
                photos: []
            }
        ];
        saveReceivedRatings();
    }
    
    // Поставлені оцінки (мною)
    const savedGiven = localStorage.getItem('fastik_given_ratings');
    if (savedGiven) {
        givenRatings = JSON.parse(savedGiven);
    } else {
        givenRatings = [
            {
                id: 1,
                toUser: 'Максим',
                toUserAvatar: 'М',
                rating: 5,
                text: 'Відмінний продавець! Товар як новий, все чесно.',
                pros: 'Чесність, якість',
                cons: '',
                date: '10.03.2025',
                product: 'Samsung Galaxy S21',
                productId: 5,
                photos: []
            }
        ];
        saveGivenRatings();
    }
    
    // Список на оцінку (після покупок)
    const savedToRate = localStorage.getItem('fastik_to_rate');
    if (savedToRate) {
        toRateList = JSON.parse(savedToRate);
    } else {
        toRateList = [
            {
                id: 1,
                seller: 'Тетяна',
                sellerAvatar: 'Т',
                product: 'Навушники Sony WH-1000XM4',
                productId: 101,
                price: 8500,
                date: '01.04.2025',
                deadline: '31.05.2025'
            },
            {
                id: 2,
                seller: 'Віталій',
                sellerAvatar: 'В',
                product: 'Годинник Apple Watch Series 8',
                productId: 102,
                price: 12000,
                date: '05.04.2025',
                deadline: '04.06.2025'
            }
        ];
        saveToRate();
    }
    
    updateToRateCount();
}

function saveReceivedRatings() {
    localStorage.setItem('fastik_received_ratings', JSON.stringify(receivedRatings));
}

function saveGivenRatings() {
    localStorage.setItem('fastik_given_ratings', JSON.stringify(givenRatings));
}

function saveToRate() {
    localStorage.setItem('fastik_to_rate', JSON.stringify(toRateList));
}

function updateToRateCount() {
    const countElement = document.getElementById('toRateCount');
    if (countElement) {
        countElement.textContent = toRateList.length;
    }
}

// ========== РЕНДЕР ==========
function renderAll() {
    renderMyRating();
    renderMyReviews();
    renderToRateList();
    renderGivenReviews();
    renderReceivedReviews();
    renderBadges();
}

// Мій рейтинг
function renderMyRating() {
    const totalRating = receivedRatings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = receivedRatings.length > 0 ? (totalRating / receivedRatings.length).toFixed(1) : 0;
    const ratingCount = receivedRatings.length;
    
    const ratingScoreEl = document.querySelector('.rating-score');
    const ratingStarsEl = document.getElementById('myRatingStars');
    const ratingCountEl = document.querySelector('.rating-count');
    
    if (ratingScoreEl) ratingScoreEl.textContent = avgRating;
    if (ratingCountEl) ratingCountEl.textContent = `${ratingCount} відгуків`;
    
    // Розрахунок відсотків для статистики
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    receivedRatings.forEach(r => {
        ratingDistribution[r.rating]++;
    });
    
    for (let i = 1; i <= 5; i++) {
        const percent = ratingCount > 0 ? (ratingDistribution[i] / ratingCount * 100).toFixed(0) : 0;
        const fillBar = document.querySelector(`.stat-bar:nth-child(${6 - i}) .fill`);
        const percentSpan = document.querySelector(`.stat-bar:nth-child(${6 - i}) span:last-child`);
        if (fillBar) fillBar.style.width = `${percent}%`;
        if (percentSpan) percentSpan.textContent = `${percent}%`;
    }
    
    // Зірки
    const fullStars = Math.floor(avgRating);
    const hasHalf = avgRating % 1 >= 0.5;
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) starsHtml += '★';
        else if (i === fullStars + 1 && hasHalf) starsHtml += '½';
        else starsHtml += '☆';
    }
    if (ratingStarsEl) ratingStarsEl.textContent = starsHtml;
}

// Мої відгуки (отримані)
function renderMyReviews() {
    const container = document.getElementById('myReviewsList');
    if (!container) return;
    
    if (receivedRatings.length === 0) {
        container.innerHTML = '<div class="empty-state">📝 Поки немає відгуків про вас</div>';
        return;
    }
    
    container.innerHTML = receivedRatings.map(r => renderReviewCard(r, true)).join('');
}

// Поставлені оцінки
function renderGivenReviews(filter = 'all') {
    const container = document.getElementById('givenReviewsList');
    if (!container) return;
    
    let filtered = [...givenRatings];
    if (filter !== 'all') {
        filtered = filtered.filter(r => r.rating === parseInt(filter));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">⭐ Ви ще не залишили жодної оцінки</div>';
        return;
    }
    
    container.innerHTML = filtered.map(r => renderReviewCard(r, false, true)).join('');
}

// Отримані оцінки
function renderReceivedReviews(filter = 'all') {
    const container = document.getElementById('receivedReviewsList');
    if (!container) return;
    
    let filtered = [...receivedRatings];
    if (filter !== 'all') {
        filtered = filtered.filter(r => r.rating === parseInt(filter));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">📊 Поки немає відгуків</div>';
        return;
    }
    
    container.innerHTML = filtered.map(r => renderReviewCard(r, true)).join('');
}

// Шаблон картки відгуку
function renderReviewCard(review, isReceived = false, isGiven = false) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const userName = isReceived ? review.reviewer : (isGiven ? `Ви → ${review.toUser}` : review.reviewer);
    const avatar = isReceived ? review.reviewerAvatar : (isGiven ? currentUser?.name?.charAt(0) || 'В' : review.reviewerAvatar);
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${avatar}</div>
                    <div class="reviewer-name">
                        <h4>${userName}</h4>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-stars">${stars}</div>
            </div>
            <div class="review-product">
                📦 Товар: <a href="#" class="product-link" onclick="viewProduct(${review.productId})">${review.product}</a>
            </div>
            <div class="review-text">${review.text}</div>
            ${review.pros ? `<div class="pros">👍 ${review.pros}</div>` : ''}
            ${review.cons ? `<div class="cons">👎 ${review.cons}</div>` : ''}
            ${review.photos && review.photos.length > 0 ? `
                <div class="review-photos">
                    ${review.photos.map(photo => `<img src="${photo}" class="review-photo" onclick="viewPhoto('${photo}')">`).join('')}
                </div>
            ` : ''}
            <div class="review-actions">
                <button onclick="likeReview(${review.id})">❤️ Корисний (${review.likes || 0})</button>
                <button onclick="reportReview(${review.id})">🚩 Поскаржитись</button>
            </div>
        </div>
    `;
}

// Список на оцінку
function renderToRateList() {
    const container = document.getElementById('toRateList');
    if (!container) return;
    
    if (toRateList.length === 0) {
        container.innerHTML = '<div class="empty-state">✅ У вас немає продавців на оцінку</div>';
        return;
    }
    
    container.innerHTML = toRateList.map(item => `
        <div class="to-rate-item">
            <div class="to-rate-info">
                <div class="reviewer-avatar">${item.sellerAvatar}</div>
                <div class="to-rate-product">
                    <h4>${item.seller}</h4>
                    <p>${item.product}</p>
                    <p class="deadline">⏰ Оцінити до: ${item.deadline}</p>
                </div>
            </div>
            <button class="rate-btn" onclick="openRateModal(${item.id})">Оцінити</button>
        </div>
    `).join('');
}

// Нагороди
function renderBadges() {
    const container = document.getElementById('badgesGrid');
    if (!container) return;
    
    const badges = [];
    if (receivedRatings.length >= 10) badges.push({ icon: '🏆', name: 'Надійний продавець', desc: '10+ позитивних відгуків' });
    if (receivedRatings.filter(r => r.rating === 5).length >= 5) badges.push({ icon: '⭐', name: 'Топ-рейтинг', desc: '5+ відгуків 5 зірок' });
    if (givenRatings.length >= 3) badges.push({ icon: '🤝', name: 'Активний покупець', desc: 'Залишив 3+ відгуків' });
    badges.push({ icon: '🎖️', name: 'Перевірений', desc: "Профіль підтверджено" });
    badges.push({ icon: '📦', name: 'FasTik Доставка', desc: 'Використовує доставку' });
    
    container.innerHTML = badges.map(badge => `
        <div class="badge-item">
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-info">
                <h4>${badge.name}</h4>
                <p>${badge.desc}</p>
            </div>
        </div>
    `).join('');
}

// ========== ОЦІНЮВАННЯ ==========
function openRateModal(itemId) {
    currentRateItem = toRateList.find(i => i.id === itemId);
    if (currentRateItem) {
        document.getElementById('rateModalTitle').textContent = `Оцінити продавця: ${currentRateItem.seller}`;
        document.getElementById('rateProductInfo').innerHTML = `
            <strong>${currentRateItem.product}</strong><br>
            Ціна: ${currentRateItem.price} грн<br>
            Дата покупки: ${currentRateItem.date}
        `;
        selectedRating = 0;
        updateStars(0);
        document.getElementById('reviewText').value = '';
        document.getElementById('reviewPros').value = '';
        document.getElementById('reviewCons').value = '';
        document.getElementById('rateModal').style.display = 'flex';
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            selectedRating = value;
            updateStars(value);
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        const value = parseInt(star.dataset.value);
        if (value <= rating) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

function submitRating() {
    if (selectedRating === 0) {
        alert('Будь ласка, поставте оцінку');
        return;
    }
    
    const reviewText = document.getElementById('reviewText').value;
    if (!reviewText || reviewText.length < 10) {
        alert('Відгук повинен містити щонайменше 10 символів');
        return;
    }
    
    const newRating = {
        id: Date.now(),
        toUser: currentRateItem.seller,
        toUserAvatar: currentRateItem.sellerAvatar,
        rating: selectedRating,
        text: reviewText,
        pros: document.getElementById('reviewPros').value,
        cons: document.getElementById('reviewCons').value,
        date: new Date().toLocaleDateString('uk-UA'),
        product: currentRateItem.product,
        productId: currentRateItem.productId,
        photos: []
    };
    
    givenRatings.unshift(newRating);
    saveGivenRatings();
    
    // Видаляємо зі списку на оцінку
    toRateList = toRateList.filter(i => i.id !== currentRateItem.id);
    saveToRate();
    updateToRateCount();
    
    renderToRateList();
    renderGivenReviews();
    
    closeModal('rateModal');
    alert('Дякуємо за ваш відгук!');
}

// ========== ФІЛЬТРИ ==========
function filterGivenReviews() {
    const filter = document.getElementById('givenFilter').value;
    renderGivenReviews(filter);
}

function filterReceivedReviews() {
    const filter = document.getElementById('receivedFilter').value;
    renderReceivedReviews(filter);
}

// ========== ДІЇ З ВІДГУКАМИ ==========
function likeReview(reviewId) {
    const review = [...receivedRatings, ...givenRatings].find(r => r.id === reviewId);
    if (review) {
        review.likes = (review.likes || 0) + 1;
        saveReceivedRatings();
        saveGivenRatings();
        renderAll();
    }
}

function reportReview(reviewId) {
    alert('Скаргу відправлено модератору. Дякуємо за пильність!');
}

function viewProduct(productId) {
    window.location.href = `ad-detail.html?id=${productId}`;
}

function attachPhoto() {
    alert('Функція додавання фото до відгуку буде доступна найближчим часом');
}

// ========== ЗАГАЛЬНІ ФУНКЦІЇ ==========
function setupTabs() {
    const tabs = document.querySelectorAll('.rating-main-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.rating-page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`${tabId}Page`).classList.add('active');
        });
    });
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