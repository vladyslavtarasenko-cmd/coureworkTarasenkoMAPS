(function() {
    // ========== ДАНІ ==========
    var currentUser = null;
    var givenRatings = [];
    var receivedRatings = [];
    var toRateList = [];
    var selectedRating = 0;
    var currentRateItem = null;

    // ========== ІНІЦІАЛІЗАЦІЯ ==========
    function initRating() {
        loadUser();
        loadData();
        setupTabs();
        setupStarRating();
        renderAll();
    }

    function loadUser() {
        const saved = localStorage.getItem('fastik_user');
        currentUser = saved ? JSON.parse(saved) : { id: 1, name: 'Владислав', email: 'vlad@example.com' };
    }

    function loadData() {
        const savedReceived = localStorage.getItem('fastik_received_ratings');
        if (savedReceived) {
            receivedRatings = JSON.parse(savedReceived);
        } else {
            receivedRatings = [
                { id: 1, reviewer: 'Світлана', reviewerAvatar: 'С', rating: 5, text: 'Дуже хороший продавець!', pros: 'Швидка доставка', cons: '', date: '15.03.2025', product: 'iPhone 13 Pro', productId: 1, likes: 3 },
                { id: 2, reviewer: 'Олександр', reviewerAvatar: 'О', rating: 5, text: 'Все супер!', pros: 'Адекватне спілкування', cons: '', date: '20.03.2025', product: 'Велосипед Trek', productId: 2, likes: 2 },
                { id: 3, reviewer: 'Марія', reviewerAvatar: 'М', rating: 4, text: 'Гарний диван', pros: 'Якісний товар', cons: 'Довга доставка', date: '28.03.2025', product: 'Диван кутовий', productId: 3, likes: 1 }
            ];
            saveReceivedRatings();
        }
        
        const savedGiven = localStorage.getItem('fastik_given_ratings');
        if (savedGiven) {
            givenRatings = JSON.parse(savedGiven);
        } else {
            givenRatings = [
                { id: 1, toUser: 'Максим', toUserAvatar: 'М', rating: 5, text: 'Відмінний продавець!', pros: 'Чесність', cons: '', date: '10.03.2025', product: 'Samsung Galaxy S21', productId: 5 }
            ];
            saveGivenRatings();
        }
        
        const savedToRate = localStorage.getItem('fastik_to_rate');
        if (savedToRate) {
            toRateList = JSON.parse(savedToRate);
        } else {
            toRateList = [
                { id: 1, seller: 'Тетяна', sellerAvatar: 'Т', product: 'Навушники Sony', productId: 101, price: 8500, date: '01.04.2025', deadline: '31.05.2025' },
                { id: 2, seller: 'Віталій', sellerAvatar: 'В', product: 'Apple Watch Series 8', productId: 102, price: 12000, date: '05.04.2025', deadline: '04.06.2025' }
            ];
            saveToRate();
        }
        updateToRateCount();
    }

    function saveReceivedRatings() { localStorage.setItem('fastik_received_ratings', JSON.stringify(receivedRatings)); }
    function saveGivenRatings() { localStorage.setItem('fastik_given_ratings', JSON.stringify(givenRatings)); }
    function saveToRate() { localStorage.setItem('fastik_to_rate', JSON.stringify(toRateList)); }
    
    function updateToRateCount() { 
        const el = document.getElementById('toRateCount'); 
        if (el) el.textContent = toRateList.length; 
    }

    function renderAll() {
        renderMyRating();
        renderMyReviews();
        renderToRateList();
        renderGivenReviews();
        renderReceivedReviews();
        renderBadges();
    }

    function renderMyRating() {
        const total = receivedRatings.reduce((s, r) => s + r.rating, 0);
        const avg = receivedRatings.length ? (total / receivedRatings.length).toFixed(1) : 0;
        const scoreEl = document.querySelector('.rating-score');
        const countEl = document.querySelector('.rating-count');
        const starsEl = document.getElementById('myRatingStars');
        if (scoreEl) scoreEl.textContent = avg;
        if (countEl) countEl.textContent = `${receivedRatings.length} відгуків`;
        
        const dist = {1:0,2:0,3:0,4:0,5:0};
        receivedRatings.forEach(r => dist[r.rating]++);
        const len = receivedRatings.length;
        for (let i=1; i<=5; i++) {
            const percent = len ? (dist[i]/len*100).toFixed(0) : 0;
            const fill = document.querySelector(`.stat-bar:nth-child(${6-i}) .fill`);
            const span = document.querySelector(`.stat-bar:nth-child(${6-i}) span:last-child`);
            if (fill) fill.style.width = `${percent}%`;
            if (span) span.textContent = `${percent}%`;
        }
        
        const full = Math.floor(avg);
        const half = avg % 1 >= 0.5;
        let stars = '';
        for (let i=1; i<=5; i++) {
            if (i <= full) stars += '★';
            else if (i === full+1 && half) stars += '½';
            else stars += '☆';
        }
        if (starsEl) starsEl.textContent = stars;
    }

    function renderMyReviews() {
        const container = document.getElementById('myReviewsList');
        if (!container) return;
        if (!receivedRatings.length) { 
            container.innerHTML = '<div class="empty-state">📝 Поки немає відгуків про вас</div>'; 
            return; 
        }
        container.innerHTML = receivedRatings.map(r => renderReviewCard(r, true)).join('');
    }

    function renderGivenReviews(filter = 'all') {
        const container = document.getElementById('givenReviewsList');
        if (!container) return;
        let filtered = [...givenRatings];
        if (filter !== 'all') filtered = filtered.filter(r => r.rating === parseInt(filter));
        if (!filtered.length) { 
            container.innerHTML = '<div class="empty-state">⭐ Ви ще не залишили жодної оцінки</div>'; 
            return; 
        }
        container.innerHTML = filtered.map(r => renderReviewCard(r, false, true)).join('');
    }

    function renderReceivedReviews(filter = 'all') {
        const container = document.getElementById('receivedReviewsList');
        if (!container) return;
        let filtered = [...receivedRatings];
        if (filter !== 'all') filtered = filtered.filter(r => r.rating === parseInt(filter));
        if (!filtered.length) { 
            container.innerHTML = '<div class="empty-state">📊 Поки немає відгуків</div>'; 
            return; 
        }
        container.innerHTML = filtered.map(r => renderReviewCard(r, true)).join('');
    }

    function renderReviewCard(review, isReceived = false, isGiven = false) {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const userName = isReceived ? review.reviewer : (isGiven ? `Ви → ${review.toUser}` : review.reviewer);
        const avatar = isReceived ? review.reviewerAvatar : (isGiven ? (currentUser?.name?.charAt(0)||'В') : review.reviewerAvatar);
        return `
            <div class="review-card">
                <div class="review-header"><div class="reviewer-info"><div class="reviewer-avatar">${avatar}</div><div class="reviewer-name"><h4>${userName}</h4><div class="review-date">${review.date}</div></div></div><div class="review-stars">${stars}</div></div>
                <div class="review-product">📦 Товар: <a href="#" class="product-link" onclick="viewProduct(${review.productId})">${review.product}</a></div>
                <div class="review-text">${review.text}</div>
                ${review.pros ? `<div class="pros">👍 ${review.pros}</div>` : ''}
                ${review.cons ? `<div class="cons">👎 ${review.cons}</div>` : ''}
                <div class="review-actions"><button onclick="likeReview(${review.id})">❤️ Корисний (${review.likes || 0})</button><button onclick="reportReview(${review.id})">🚩 Поскаржитись</button></div>
            </div>
        `;
    }

    function renderToRateList() {
        const container = document.getElementById('toRateList');
        if (!container) return;
        if (!toRateList.length) { 
            container.innerHTML = '<div class="empty-state">✅ У вас немає продавців на оцінку</div>'; 
            return; 
        }
        container.innerHTML = toRateList.map(item => `
            <div class="to-rate-item"><div class="to-rate-info"><div class="reviewer-avatar">${item.sellerAvatar}</div><div class="to-rate-product"><h4>${item.seller}</h4><p>${item.product}</p><p class="deadline">⏰ Оцінити до: ${item.deadline}</p></div></div><button class="rate-btn" onclick="openRateModal(${item.id})">Оцінити</button></div>
        `).join('');
    }

    function renderBadges() {
        const container = document.getElementById('badgesGrid');
        if (!container) return;
        const badges = [];
        if (receivedRatings.length >= 10) badges.push({ icon: '🏆', name: 'Надійний продавець', desc: '10+ відгуків' });
        if (receivedRatings.filter(r=>r.rating===5).length >= 5) badges.push({ icon: '⭐', name: 'Топ-рейтинг', desc: '5+ відгуків 5★' });
        if (givenRatings.length >= 3) badges.push({ icon: '🤝', name: 'Активний покупець', desc: 'Залишив 3+ відгуків' });
        badges.push({ icon: '🎖️', name: 'Перевірений', desc: 'Профіль підтверджено' });
        container.innerHTML = badges.map(b => `<div class="badge-item"><div class="badge-icon">${b.icon}</div><div class="badge-info"><h4>${b.name}</h4><p>${b.desc}</p></div></div>`).join('');
    }

    function openRateModal(itemId) {
        currentRateItem = toRateList.find(i => i.id === itemId);
        if (currentRateItem) {
            const titleEl = document.getElementById('rateModalTitle');
            const infoEl = document.getElementById('rateProductInfo');
            const reviewText = document.getElementById('reviewText');
            const reviewPros = document.getElementById('reviewPros');
            const reviewCons = document.getElementById('reviewCons');
            const modal = document.getElementById('rateModal');
            if (titleEl) titleEl.textContent = `Оцінити продавця: ${currentRateItem.seller}`;
            if (infoEl) infoEl.innerHTML = `<strong>${currentRateItem.product}</strong><br>Ціна: ${currentRateItem.price} грн<br>Дата: ${currentRateItem.date}`;
            selectedRating = 0;
            updateStars(0);
            if (reviewText) reviewText.value = '';
            if (reviewPros) reviewPros.value = '';
            if (reviewCons) reviewCons.value = '';
            if (modal) modal.style.display = 'flex';
        }
    }

    function setupStarRating() {
        const stars = document.querySelectorAll('#starRating .star');
        stars.forEach(star => {
            star.addEventListener('click', () => { 
                selectedRating = parseInt(star.dataset.value); 
                updateStars(selectedRating); 
            });
        });
    }

    function updateStars(rating) {
        document.querySelectorAll('#starRating .star').forEach(star => {
            const val = parseInt(star.dataset.value);
            star.textContent = val <= rating ? '★' : '☆';
            if (val <= rating) star.classList.add('active');
            else star.classList.remove('active');
        });
    }

    function submitRating() {
        if (selectedRating === 0) { alert('Поставте оцінку'); return; }
        const text = document.getElementById('reviewText')?.value;
        if (!text || text.length < 10) { alert('Відгук має бути не менше 10 символів'); return; }
        givenRatings.unshift({
            id: Date.now(), toUser: currentRateItem.seller, toUserAvatar: currentRateItem.sellerAvatar,
            rating: selectedRating, text: text, pros: document.getElementById('reviewPros')?.value || '',
            cons: document.getElementById('reviewCons')?.value || '', date: new Date().toLocaleDateString('uk-UA'),
            product: currentRateItem.product, productId: currentRateItem.productId
        });
        saveGivenRatings();
        toRateList = toRateList.filter(i => i.id !== currentRateItem.id);
        saveToRate();
        updateToRateCount();
        renderToRateList();
        renderGivenReviews();
        closeModal('rateModal');
        alert('Дякуємо за відгук!');
    }

    function filterGivenReviews() { 
        const filter = document.getElementById('givenFilter')?.value;
        if (filter) renderGivenReviews(filter); 
    }
    
    function filterReceivedReviews() { 
        const filter = document.getElementById('receivedFilter')?.value;
        if (filter) renderReceivedReviews(filter); 
    }
    
    function likeReview(id) { 
        const r = [...receivedRatings, ...givenRatings].find(r => r.id === id); 
        if(r){ r.likes = (r.likes||0)+1; saveReceivedRatings(); saveGivenRatings(); renderAll(); } 
    }
    
    function reportReview(id) { alert('Скаргу відправлено модератору'); }
    function viewProduct(id) { window.location.href = `ad-detail.html?id=${id}`; }

    function setupTabs() {
        document.querySelectorAll('.rating-main-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.rating-main-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.rating-page').forEach(p => p.classList.remove('active'));
                const activePage = document.getElementById(`${tabId}Page`);
                if (activePage) activePage.classList.add('active');
            });
        });
    }

    function closeModal(modalId) { 
        const m = document.getElementById(modalId); 
        if (m) m.style.display = 'none'; 
    }

    // Робимо функції глобальними для HTML
    window.filterGivenReviews = filterGivenReviews;
    window.filterReceivedReviews = filterReceivedReviews;
    window.likeReview = likeReview;
    window.reportReview = reportReview;
    window.viewProduct = viewProduct;
    window.openRateModal = openRateModal;
    window.submitRating = submitRating;
    window.closeModal = closeModal;

    // ЗАПУСК
    initRating();
})();