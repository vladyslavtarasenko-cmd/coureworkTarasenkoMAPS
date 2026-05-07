// ========== ДАНІ ==========
let currentUser = null;
let transactions = [];
let invoices = [];
let bonuses = [];
let packages = [];
let savedCards = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentSelectedPackage = null;

// Пакети для покупки
const availablePackages = [
    { id: 1, name: 'Базовий', price: 99, features: ['Підняття оголошення', 'Термін: 7 днів'], popular: false, icon: '📦' },
    { id: 2, name: 'Преміум', price: 299, features: ['ТОП позиція', 'Виділення кольором', 'Термін: 30 днів'], popular: true, icon: '⭐' },
    { id: 3, name: 'VIP', price: 599, features: ['Перша позиція', 'Золотий бейдж', 'Підтримка 24/7', 'Термін: 60 днів'], popular: false, icon: '👑' }
];

// ========== ІНІЦІАЛІЗАЦІЯ ==========
function initPayments() {
    loadUser();
    loadData();
    setupSidebarMenu();
    renderAll();
}

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = { id: 1, name: 'Владислав', email: 'vlad@example.com', balance: 1250, bonus: 350 };
    }
}

function loadData() {
    // Транзакції
    const savedTransactions = localStorage.getItem('fastik_transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    } else {
        transactions = [
            { id: 1, date: '15.03.2025', description: 'Поповнення рахунку', amount: 500, type: 'credit', status: 'success' },
            { id: 2, date: '20.03.2025', description: 'Платне оголошення - ТОП', amount: -150, type: 'debit', status: 'success' },
            { id: 3, date: '25.03.2025', description: 'Бонус за реєстрацію', amount: 50, type: 'bonus', status: 'success' },
            { id: 4, date: '28.03.2025', description: 'Поповнення рахунку', amount: 300, type: 'credit', status: 'success' },
            { id: 5, date: '01.04.2025', description: 'Пакет "Преміум"', amount: -299, type: 'debit', status: 'success' },
            { id: 6, date: '05.04.2025', description: 'Бонус за відгук', amount: 10, type: 'bonus', status: 'success' },
            { id: 7, date: '10.04.2025', description: 'Підняття оголошення', amount: -50, type: 'debit', status: 'success' },
            { id: 8, date: '15.04.2025', description: 'Поповнення рахунку', amount: 1000, type: 'credit', status: 'success' }
        ];
        saveTransactions();
    }
    
    // Рахунки
    const savedInvoices = localStorage.getItem('fastik_invoices');
    if (savedInvoices) {
        invoices = JSON.parse(savedInvoices);
    } else {
        invoices = [
            { id: 1, number: 'INV-2025-0001', date: '20.03.2025', amount: 150, description: 'ТОП оголошення', paid: true },
            { id: 2, number: 'INV-2025-0002', date: '01.04.2025', amount: 299, description: 'Пакет "Преміум"', paid: true },
            { id: 3, number: 'INV-2025-0003', date: '10.04.2025', amount: 50, description: 'Підняття оголошення', paid: false }
        ];
        saveInvoices();
    }
    
    // Бонуси
    const savedBonuses = localStorage.getItem('fastik_bonuses');
    if (savedBonuses) {
        bonuses = JSON.parse(savedBonuses);
    } else {
        bonuses = [
            { id: 1, date: '25.03.2025', description: 'Бонус за реєстрацію', amount: 50, type: 'earned' },
            { id: 2, date: '05.04.2025', description: 'Бонус за відгук', amount: 10, type: 'earned' },
            { id: 3, date: '10.04.2025', description: 'Використання бонусів', amount: -30, type: 'used' }
        ];
        saveBonuses();
    }
    
    // Збережені карти
    const savedCardsData = localStorage.getItem('fastik_cards');
    if (savedCardsData) {
        savedCards = JSON.parse(savedCardsData);
    } else {
        savedCards = [
            { id: 1, number: '**** **** **** 4242', type: 'visa', expiry: '12/26', name: 'VLADYSLAV T' }
        ];
        saveCards();
    }
    
    updateBalanceDisplay();
}

function saveTransactions() { localStorage.setItem('fastik_transactions', JSON.stringify(transactions)); }
function saveInvoices() { localStorage.setItem('fastik_invoices', JSON.stringify(invoices)); }
function saveBonuses() { localStorage.setItem('fastik_bonuses', JSON.stringify(bonuses)); }
function saveCards() { localStorage.setItem('fastik_cards', JSON.stringify(savedCards)); }

function updateBalanceDisplay() {
    const balance = transactions.reduce((sum, t) => {
        if (t.type === 'credit') return sum + t.amount;
        if (t.type === 'debit') return sum + t.amount;
        return sum;
    }, 0);
    
    currentUser.balance = balance;
    const bonusAmount = bonuses.reduce((sum, b) => {
        if (b.type === 'earned') return sum + b.amount;
        if (b.type === 'used') return sum + b.amount;
        return sum;
    }, 0);
    currentUser.bonus = bonusAmount;
    
    const balEl = document.getElementById('mainBalance');
    const bonusBalEl = document.getElementById('bonusBalance');
    const bonusAmtEl = document.getElementById('bonusAmount');
    const earnedEl = document.getElementById('totalBonusEarned');
    const usedEl = document.getElementById('totalBonusUsed');
    
    if (balEl) balEl.textContent = balance;
    if (bonusBalEl) bonusBalEl.textContent = bonusAmount;
    if (bonusAmtEl) bonusAmtEl.textContent = bonusAmount;
    
    const earned = bonuses.filter(b => b.type === 'earned').reduce((s, b) => s + b.amount, 0);
    const used = bonuses.filter(b => b.type === 'used').reduce((s, b) => s + Math.abs(b.amount), 0);
    if (earnedEl) earnedEl.textContent = earned;
    if (usedEl) usedEl.textContent = used;
}

function renderAll() {
    renderTransactions();
    renderInvoices();
    renderBonusHistory();
    renderPackages();
    renderCards();
}

function renderTransactions() {
    const container = document.getElementById('paymentsList');
    if (!container) return;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = transactions.slice(start, start + itemsPerPage);
    
    if (paginated.length === 0) {
        container.innerHTML = '<div class="empty-state">💰 Немає платежів</div>';
        return;
    }
    
    container.innerHTML = paginated.map(t => `
        <div class="payment-item">
            <div class="payment-info">
                <div class="payment-date">${t.date}</div>
                <div class="payment-description">${t.description}</div>
                <span class="payment-status ${t.status}">${t.status === 'success' ? 'Виконано' : 'В обробці'}</span>
            </div>
            <div class="payment-amount ${t.type}">${t.amount > 0 ? '+' : ''}${t.amount} грн</div>
        </div>
    `).join('');
    renderPagination();
}

function renderPagination() {
    const container = document.getElementById('paymentsPagination');
    if (!container) return;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
}

function goToPage(page) { currentPage = page; renderTransactions(); }

function searchPayments() {
    const query = document.getElementById('paymentSearch')?.value.toLowerCase() || '';
    const filter = document.getElementById('paymentFilter')?.value || 'all';
    let filtered = [...transactions];
    if (query) filtered = filtered.filter(t => t.description.toLowerCase().includes(query));
    if (filter !== 'all') filtered = filtered.filter(t => t.type === filter);
    const container = document.getElementById('paymentsList');
    if (!container) return;
    if (filtered.length === 0) { container.innerHTML = '<div class="empty-state">💰 Нічого не знайдено</div>'; return; }
    container.innerHTML = filtered.map(t => `
        <div class="payment-item">
            <div class="payment-info">
                <div class="payment-date">${t.date}</div>
                <div class="payment-description">${t.description}</div>
            </div>
            <div class="payment-amount ${t.type}">${t.amount > 0 ? '+' : ''}${t.amount} грн</div>
        </div>
    `).join('');
}

function filterPayments() { searchPayments(); }

function renderInvoices() {
    const container = document.getElementById('invoicesList');
    if (!container) return;
    if (invoices.length === 0) { container.innerHTML = '<div class="empty-state">📄 Немає рахунків</div>'; return; }
    container.innerHTML = invoices.map(inv => `
        <div class="invoice-item">
            <div class="invoice-info"><h4>${inv.description}</h4><p>${inv.number} · ${inv.date}</p></div>
            <div class="invoice-actions">
                <span class="payment-amount ${inv.paid ? 'credit' : 'debit'}">${inv.amount} грн</span>
                <button class="download-btn" onclick="downloadInvoice(${inv.id})">📄</button>
            </div>
        </div>
    `).join('');
}

function downloadInvoice(id) { const inv = invoices.find(i => i.id === id); alert(`Завантаження рахунку ${inv.number}\nСума: ${inv.amount} грн`); }
function downloadAllInvoices() { alert('Всі рахунки будуть завантажені у форматі ZIP'); }

function renderBonusHistory() {
    const container = document.getElementById('bonusHistoryList');
    if (!container) return;
    if (bonuses.length === 0) { container.innerHTML = '<div class="empty-state">🎁 Немає бонусів</div>'; return; }
    container.innerHTML = bonuses.map(b => `
        <div class="bonus-item">
            <div><div style="font-weight:500">${b.description}</div><div style="font-size:12px;color:#999">${b.date}</div></div>
            <div style="color:${b.amount>0?'#00a49f':'#dc3545'};font-weight:700">${b.amount>0?'+':''}${b.amount}</div>
        </div>
    `).join('');
}

function renderPackages() {
    const container = document.getElementById('packagesGrid');
    if (!container) return;
    container.innerHTML = availablePackages.map(pkg => `
        <div class="package-card ${pkg.popular ? 'featured' : ''}" onclick="openPackageModal(${pkg.id})">
            ${pkg.popular ? '<div class="package-badge">Популярний</div>' : ''}
            <div class="package-name">${pkg.name}</div>
            <div class="package-price">${pkg.price} <small>грн</small></div>
            <ul class="package-features">${pkg.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul>
            <button class="package-buy-btn" onclick="event.stopPropagation(); openPackageModal(${pkg.id})">Купити</button>
        </div>
    `).join('');
}

function openPackageModal(packageId) {
    const pkg = availablePackages.find(p => p.id === packageId);
    if (pkg) {
        document.getElementById('packageName').textContent = `Купівля пакету "${pkg.name}"`;
        document.getElementById('packageDescription').textContent = `Вартість: ${pkg.price} грн`;
        document.getElementById('packagePrice').innerHTML = `<strong>${pkg.price} грн</strong> буде списано з вашого рахунку`;
        currentSelectedPackage = pkg;
        document.getElementById('packageModal').style.display = 'flex';
    }
}

function buyPackage() {
    if (currentSelectedPackage) {
        const balance = parseInt(document.getElementById('mainBalance')?.textContent || '0');
        if (balance >= currentSelectedPackage.price) {
            transactions.unshift({
                id: Date.now(), date: new Date().toLocaleDateString('uk-UA'),
                description: `Пакет "${currentSelectedPackage.name}"`, amount: -currentSelectedPackage.price,
                type: 'debit', status: 'success'
            });
            saveTransactions();
            invoices.unshift({
                id: Date.now(), number: `INV-${Date.now()}`,
                date: new Date().toLocaleDateString('uk-UA'), amount: currentSelectedPackage.price,
                description: `Пакет "${currentSelectedPackage.name}"`, paid: true
            });
            saveInvoices();
            updateBalanceDisplay();
            renderTransactions();
            renderInvoices();
            alert(`Пакет "${currentSelectedPackage.name}" успішно придбано!`);
            closeModal('packageModal');
        } else {
            alert('Недостатньо коштів на рахунку. Поповніть баланс.');
        }
    }
}

function renderCards() {
    const container = document.getElementById('cardsList');
    if (!container) return;
    if (savedCards.length === 0) { container.innerHTML = '<div class="empty-state">💳 Немає збережених карт</div>'; return; }
    container.innerHTML = savedCards.map(card => `
        <div class="card-item">
            <div class="card-info">
                <div class="card-type">💳</div>
                <div class="card-details">
                    <div class="card-number">${card.number}</div>
                    <div class="card-expiry">Термін дії: ${card.expiry}</div>
                    <div class="card-name">${card.name}</div>
                </div>
            </div>
            <div class="card-actions"><button onclick="deleteCard(${card.id})">Видалити</button></div>
        </div>
    `).join('');
}

function addNewCard() { document.getElementById('addCardModal').style.display = 'flex'; }

function saveCard() {
    const number = document.getElementById('cardNumber')?.value;
    const expiry = document.getElementById('cardExpiry')?.value;
    const cvv = document.getElementById('cardCvv')?.value;
    const name = document.getElementById('cardName')?.value;
    if (!number || !expiry || !cvv || !name) { alert('Заповніть всі поля'); return; }
    savedCards.push({ id: Date.now(), number: '**** **** **** ' + number.slice(-4), type: 'visa', expiry: expiry, name: name.toUpperCase() });
    saveCards();
    renderCards();
    closeModal('addCardModal');
    ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    alert('Картку додано успішно!');
}

function deleteCard(cardId) { if (confirm('Видалити картку?')) { savedCards = savedCards.filter(c => c.id !== cardId); saveCards(); renderCards(); } }

function openTopupModal() { updateCardSelect(); document.getElementById('topupModal').style.display = 'flex'; }

function updateCardSelect() {
    const select = document.getElementById('savedCards');
    if (select && savedCards.length > 0) {
        select.innerHTML = '<option value="">Виберіть карту</option>' + savedCards.map(card => `<option value="${card.id}">${card.number}</option>`).join('');
        document.getElementById('cardSelect').style.display = 'block';
    } else { document.getElementById('cardSelect').style.display = 'none'; }
}

function setAmount(amount) { const el = document.getElementById('topupAmount'); if (el) el.value = amount; }

function processTopup() {
    const amount = parseInt(document.getElementById('topupAmount')?.value || '0');
    if (!amount || amount <= 0) { alert('Введіть коректну суму'); return; }
    transactions.unshift({
        id: Date.now(), date: new Date().toLocaleDateString('uk-UA'),
        description: `Поповнення рахунку через картку`, amount: amount,
        type: 'credit', status: 'success'
    });
    saveTransactions();
    updateBalanceDisplay();
    renderTransactions();
    alert(`Рахунок поповнено на ${amount} грн!`);
    closeModal('topupModal');
    const topupAmount = document.getElementById('topupAmount'); if (topupAmount) topupAmount.value = '';
}

function setupSidebarMenu() {
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.payments-page').forEach(p => p.classList.remove('active'));
            const activePage = document.getElementById(`${page}Page`);
            if (activePage) activePage.classList.add('active');
        });
    });
}

function closeModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }

// ЗАПУСК
initPayments();