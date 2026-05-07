// ========== ДАНІ ==========
let currentUser = null;
let salesOrders = [];
let purchaseOrders = [];
let currentSalesFilter = 'all';
let currentPage = 1;
const itemsPerPage = 5;

// Демо-дані для продажів
const defaultSales = [
    {
        id: 1,
        orderNumber: 'FT-2025-0001',
        product: 'iPhone 13 Pro 128GB',
        productImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100',
        price: 15000,
        buyer: 'Олександр К.',
        buyerPhone: '+38 097 123 45 67',
        date: '10.04.2025',
        status: 'pending',
        statusText: 'Очікує підтвердження',
        address: 'Нова Пошта №1, Київ'
    },
    {
        id: 2,
        orderNumber: 'FT-2025-0002',
        product: 'Велосипед Trek Marlin 5',
        productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=100',
        price: 12000,
        buyer: 'Марія І.',
        buyerPhone: '+38 098 765 43 21',
        date: '05.04.2025',
        status: 'waiting',
        statusText: 'Очікує відправки',
        address: 'Укрпошта, відділення №123, Львів'
    },
    {
        id: 3,
        orderNumber: 'FT-2025-0003',
        product: 'Диван кутовий',
        productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100',
        price: 8500,
        buyer: 'Світлана П.',
        buyerPhone: '+38 063 123 45 67',
        date: '28.03.2025',
        status: 'shipping',
        statusText: 'В дорозі',
        ttn: '20450987654321',
        address: 'Кур\'єр, вул. Хрещатик 15, Київ'
    },
    {
        id: 4,
        orderNumber: 'FT-2025-0004',
        product: 'MacBook Air M1',
        productImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100',
        price: 28000,
        buyer: 'Андрій В.',
        buyerPhone: '+38 093 456 78 90',
        date: '15.03.2025',
        status: 'completed',
        statusText: 'Виконано',
        ttn: '20450987651234',
        address: 'Нова Пошта №42, Одеса'
    }
];

const defaultPurchases = [
    {
        id: 1,
        orderNumber: 'FT-2025-0010',
        product: 'Навушники Sony WH-1000XM4',
        productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100',
        price: 8500,
        seller: 'TechShop',
        date: '12.04.2025',
        status: 'shipping',
        statusText: 'В дорозі',
        ttn: '20450987659876'
    },
    {
        id: 2,
        orderNumber: 'FT-2025-0011',
        product: 'Power Bank 20000mAh',
        productImage: 'https://images.unsplash.com/photo-1609592424133-2f5d9f1c6fbc?w=100',
        price: 1200,
        seller: 'GadgetStore',
        date: '01.04.2025',
        status: 'completed',
        statusText: 'Отримано'
    }
];

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadData();
    setupTabs();
    setupFilters();
    renderSales();
    renderPurchases();
    updateStats();
});

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

function loadData() {
    const savedSales = localStorage.getItem('fastik_sales');
    if (savedSales) {
        salesOrders = JSON.parse(savedSales);
    } else {
        salesOrders = defaultSales;
        localStorage.setItem('fastik_sales', JSON.stringify(salesOrders));
    }
    
    const savedPurchases = localStorage.getItem('fastik_purchases');
    if (savedPurchases) {
        purchaseOrders = JSON.parse(savedPurchases);
    } else {
        purchaseOrders = defaultPurchases;
        localStorage.setItem('fastik_purchases', JSON.stringify(purchaseOrders));
    }
}

function saveSales() {
    localStorage.setItem('fastik_sales', JSON.stringify(salesOrders));
}

function savePurchases() {
    localStorage.setItem('fastik_purchases', JSON.stringify(purchaseOrders));
}

function updateStats() {
    const completed = salesOrders.filter(o => o.status === 'completed').length;
    document.getElementById('totalSales').textContent = completed;
    document.getElementById('salesCount').textContent = salesOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    document.getElementById('purchasesCount').textContent = purchaseOrders.filter(o => o.status !== 'completed').length;
}

// ========== ВКЛАДКИ ==========
function setupTabs() {
    const tabs = document.querySelectorAll('.delivery-main-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.delivery-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// ========== ПРОДАЖІ ==========
function setupFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSalesFilter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentPage = 1;
            renderSales();
        });
    });
}

function renderSales() {
    let filtered = [...salesOrders];
    
    if (currentSalesFilter !== 'all') {
        filtered = filtered.filter(order => order.status === currentSalesFilter);
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    
    const container = document.getElementById('salesList');
    if (paginated.length === 0) {
        container.innerHTML = '<div class="empty-state">📦 Немає замовлень</div>';
        return;
    }
    
    container.innerHTML = paginated.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-number">Замовлення #${order.orderNumber}</div>
                <div class="order-status status-${order.status}">${order.statusText}</div>
            </div>
            <div class="order-product">
                <img class="order-product-img" src="${order.productImage}" alt="${order.product}">
                <div class="order-product-info">
                    <h4>${order.product}</h4>
                    <div class="order-product-price">${order.price.toLocaleString()} грн</div>
                </div>
            </div>
            <div class="order-details">
                <div class="order-customer">👤 Покупець: ${order.buyer}<br>📞 ${order.buyerPhone}</div>
                <div class="order-date">📅 Замовлено: ${order.date}</div>
                <div class="order-actions">
                    ${getSalesActions(order)}
                </div>
            </div>
        </div>
    `).join('');
    
    renderSalesPagination(filtered.length);
}

function getSalesActions(order) {
    if (order.status === 'pending') {
        return `
            <button class="order-btn order-btn-primary" onclick="openConfirmOrderModal(${order.id})">✅ Підтвердити</button>
            <button class="order-btn order-btn-danger" onclick="cancelOrder(${order.id})">❌ Скасувати</button>
        `;
    }
    if (order.status === 'waiting') {
        return `<button class="order-btn order-btn-primary" onclick="openTTNModal(${order.id})">📦 Відправити</button>`;
    }
    if (order.status === 'shipping') {
        return `
            <span>📮 ТТН: ${order.ttn}</span>
            <button class="order-btn order-btn-secondary" onclick="trackOrderByNumber('${order.ttn}')">🔍 Відстежити</button>
        `;
    }
    if (order.status === 'completed') {
        return `<span class="order-status status-completed">✅ Завершено</span>`;
    }
    return '';
}

function renderSalesPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.getElementById('salesPagination');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderSales();
}

function openConfirmOrderModal(orderId) {
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
        document.getElementById('confirmOrderInfo').innerHTML = `
            <p><strong>Товар:</strong> ${order.product}</p>
            <p><strong>Сума:</strong> ${order.price} грн</p>
            <p><strong>Покупець:</strong> ${order.buyer}</p>
        `;
        window.currentOrderId = orderId;
        document.getElementById('confirmOrderModal').style.display = 'flex';
    }
}

function confirmOrder() {
    const orderId = window.currentOrderId;
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'waiting';
        order.statusText = 'Очікує відправки';
        saveSales();
        renderSales();
        updateStats();
    }
    closeModal('confirmOrderModal');
}

function openTTNModal(orderId) {
    window.currentTTNOrderId = orderId;
    document.getElementById('ttnModal').style.display = 'flex';
}

function saveTTN() {
    const ttn = document.getElementById('ttnNumber').value;
    const orderId = window.currentTTNOrderId;
    const order = salesOrders.find(o => o.id === orderId);
    
    if (order && ttn) {
        order.status = 'shipping';
        order.statusText = 'В дорозі';
        order.ttn = ttn;
        saveSales();
        renderSales();
        updateStats();
    }
    closeModal('ttnModal');
    document.getElementById('ttnNumber').value = '';
}

function cancelOrder(orderId) {
    if (confirm('Ви впевнені, що хочете скасувати це замовлення?')) {
        const order = salesOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            order.statusText = 'Відхилено';
            saveSales();
            renderSales();
            updateStats();
        }
    }
}

function searchSales() {
    const query = document.getElementById('salesSearch').value.toLowerCase();
    let filtered = salesOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(query) || 
        order.product.toLowerCase().includes(query)
    );
    
    const container = document.getElementById('salesList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">📦 Нічого не знайдено</div>';
        return;
    }
    
    container.innerHTML = filtered.map(order => renderOrderCard(order)).join('');
}

// ========== ПОКУПКИ ==========
function renderPurchases() {
    const container = document.getElementById('purchasesList');
    
    if (purchaseOrders.length === 0) {
        container.innerHTML = '<div class="empty-state">🛍️ У вас поки немає покупок</div>';
        return;
    }
    
    container.innerHTML = purchaseOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-number">Замовлення #${order.orderNumber}</div>
                <div class="order-status status-${order.status}">${order.statusText}</div>
            </div>
            <div class="order-product">
                <img class="order-product-img" src="${order.productImage}" alt="${order.product}">
                <div class="order-product-info">
                    <h4>${order.product}</h4>
                    <div class="order-product-price">${order.price.toLocaleString()} грн</div>
                </div>
            </div>
            <div class="order-details">
                <div class="order-customer">🏪 Продавець: ${order.seller}</div>
                <div class="order-date">📅 Замовлено: ${order.date}</div>
                <div class="order-actions">
                    ${order.status === 'shipping' ? `<button class="order-btn order-btn-primary" onclick="trackOrderByNumber('${order.ttn}')">🔍 Відстежити</button>` : ''}
                    ${order.status === 'completed' ? `<span class="order-status status-completed">✅ Отримано</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ========== ТРЕКІНГ ==========
function trackOrder() {
    const ttn = document.getElementById('trackingNumber').value;
    if (ttn) {
        trackOrderByNumber(ttn);
    } else {
        alert('Введіть номер ТТН');
    }
}

function trackOrderByNumber(ttn) {
    const resultDiv = document.getElementById('trackingResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>📮 Відстеження посилки #${ttn}</h3>
        <div class="tracking-timeline">
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-status">Замовлення оформлено</div>
                    <div class="timeline-date">${new Date().toLocaleDateString()}</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-status">Відправлено на склад</div>
                    <div class="timeline-date">Очікується</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-status">В дорозі</div>
                    <div class="timeline-date">Очікується</div>
                </div>
            </div>
        </div>
        <button class="btn-secondary" onclick="document.getElementById('trackingResult').style.display='none'" style="margin-top: 20px;">Закрити</button>
    `;
}

// ========== НАЛАШТУВАННЯ ==========
function selectMethod(method) {
    const methods = {
        nova: 'Нова Пошта',
        ukrposhta: 'Укрпошта',
        courier: 'Кур\'єрська доставка',
        meest: 'Meest Express'
    };
    alert(`Ви обрали спосіб доставки: ${methods[method]}\nДеталі будуть додані до вашого оголошення.`);
}

function saveDeliverySettings() {
    const settings = {
        defaultBranch: document.getElementById('defaultBranch').value,
        defaultIndex: document.getElementById('defaultIndex').value,
        deliveryPhone: document.getElementById('deliveryPhone').value,
        autoConfirm: document.getElementById('autoConfirm').checked,
        orderNotifications: document.getElementById('orderNotifications').checked
    };
    localStorage.setItem('fastik_delivery_settings', JSON.stringify(settings));
    showNotification('Налаштування доставки збережено!');
}

// ========== ЗАГАЛЬНІ ФУНКЦІЇ ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00a49f;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        showNotification(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}