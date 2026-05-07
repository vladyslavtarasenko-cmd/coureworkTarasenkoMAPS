function initDelivery() {
    // весь код...

let currentUser = null;
let salesOrders = [];
let purchaseOrders = [];
let currentSalesFilter = 'all';
let currentPage = 1;
const itemsPerPage = 5;
let currentOrderId = null;

const defaultSales = [
    { id: 1, orderNumber: 'FT-2025-0001', product: 'iPhone 13 Pro', productImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100', price: 15000, buyer: 'Олександр К.', buyerPhone: '+38 097 123 45 67', date: '10.04.2025', status: 'pending', statusText: 'Очікує підтвердження' },
    { id: 2, orderNumber: 'FT-2025-0002', product: 'Велосипед Trek', productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=100', price: 12000, buyer: 'Марія І.', buyerPhone: '+38 098 765 43 21', date: '05.04.2025', status: 'waiting', statusText: 'Очікує відправки' },
    { id: 3, orderNumber: 'FT-2025-0003', product: 'Диван кутовий', productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100', price: 8500, buyer: 'Світлана П.', buyerPhone: '+38 063 123 45 67', date: '28.03.2025', status: 'shipping', statusText: 'В дорозі', ttn: '20450987654321' },
    { id: 4, orderNumber: 'FT-2025-0004', product: 'MacBook Air M1', productImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100', price: 28000, buyer: 'Андрій В.', buyerPhone: '+38 093 456 78 90', date: '15.03.2025', status: 'completed', statusText: 'Виконано' }
];

const defaultPurchases = [
    { id: 1, orderNumber: 'FT-2025-0010', product: 'Навушники Sony', productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100', price: 8500, seller: 'TechShop', date: '12.04.2025', status: 'shipping', statusText: 'В дорозі', ttn: '20450987659876' },
    { id: 2, orderNumber: 'FT-2025-0011', product: 'Power Bank', productImage: 'https://images.unsplash.com/photo-1609592424133-2f5d9f1c6fbc?w=100', price: 1200, seller: 'GadgetStore', date: '01.04.2025', status: 'completed', statusText: 'Отримано' }
];

function initDelivery() {
    loadData();
    setupTabs();
    setupFilters();
    renderSales();
    renderPurchases();
    updateStats();
}

function loadData() {
    const savedSales = localStorage.getItem('fastik_sales');
    salesOrders = savedSales ? JSON.parse(savedSales) : [...defaultSales];
    const savedPurchases = localStorage.getItem('fastik_purchases');
    purchaseOrders = savedPurchases ? JSON.parse(savedPurchases) : [...defaultPurchases];
}

function saveSales() { localStorage.setItem('fastik_sales', JSON.stringify(salesOrders)); }
function savePurchases() { localStorage.setItem('fastik_purchases', JSON.stringify(purchaseOrders)); }

function updateStats() {
    let completed = salesOrders.filter(o => o.status === 'completed').length;
    document.getElementById('totalSales').textContent = completed;
    document.getElementById('salesCount').textContent = salesOrders.filter(o => !['completed','cancelled'].includes(o.status)).length;
    document.getElementById('purchasesCount').textContent = purchaseOrders.filter(o => o.status !== 'completed').length;
}

function setupTabs() {
    document.querySelectorAll('.delivery-main-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            let id = tab.dataset.tab;
            document.querySelectorAll('.delivery-main-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.delivery-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${id}Tab`).classList.add('active');
        });
    });
}

function setupFilters() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSalesFilter = btn.dataset.filter;
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPage = 1;
            renderSales();
        });
    });
}

function renderSales() {
    let filtered = currentSalesFilter === 'all' ? [...salesOrders] : salesOrders.filter(o => o.status === currentSalesFilter);
    let start = (currentPage-1)*itemsPerPage;
    let paginated = filtered.slice(start, start+itemsPerPage);
    let container = document.getElementById('salesList');
    if(!container) return;
    if(paginated.length === 0) { container.innerHTML = '<div class="empty-state">📦 Немає замовлень</div>'; document.getElementById('salesPagination').innerHTML = ''; return; }
    container.innerHTML = paginated.map(order => `
        <div class="order-card"><div class="order-header"><div class="order-number">${order.orderNumber}</div><div class="order-status status-${order.status}">${order.statusText}</div></div>
        <div class="order-product"><img class="order-product-img" src="${order.productImage}"><div class="order-product-info"><h4>${order.product}</h4><div class="order-product-price">${order.price} грн</div></div></div>
        <div class="order-details"><div>👤 ${order.buyer}<br>📞 ${order.buyerPhone}</div><div>📅 ${order.date}</div><div class="order-actions">${getSalesActions(order)}</div></div></div>
    `).join('');
    let total = Math.ceil(filtered.length/itemsPerPage);
    let p = ''; for(let i=1;i<=total;i++) p += `<button class="${i===currentPage?'active':''}" onclick="goToPage(${i})">${i}</button>`;
    document.getElementById('salesPagination').innerHTML = p;
}

function getSalesActions(order) {
    if(order.status === 'pending') return `<button class="order-btn order-btn-primary" onclick="openConfirmOrderModal(${order.id})">✅ Підтвердити</button><button class="order-btn order-btn-danger" onclick="cancelOrder(${order.id})">❌ Скасувати</button>`;
    if(order.status === 'waiting') return `<button class="order-btn order-btn-primary" onclick="openTTNModal(${order.id})">📦 Відправити</button>`;
    if(order.status === 'shipping') return `<span>📮 ${order.ttn}</span><button class="order-btn order-btn-secondary" onclick="trackOrderByNumber('${order.ttn}')">🔍 Відстежити</button>`;
    if(order.status === 'completed') return `<span>✅ Завершено</span>`;
    return '';
}

function goToPage(p) { currentPage = p; renderSales(); }
function openConfirmOrderModal(id) { currentOrderId = id; document.getElementById('confirmOrderModal').style.display = 'flex'; }
function confirmOrder() { let o = salesOrders.find(o=>o.id===currentOrderId); if(o){ o.status='waiting'; o.statusText='Очікує відправки'; saveSales(); renderSales(); updateStats(); } closeModal('confirmOrderModal'); }
function openTTNModal(id) { currentOrderId = id; document.getElementById('ttnModal').style.display = 'flex'; }
function saveTTN() { let ttn = document.getElementById('ttnNumber').value; let o = salesOrders.find(o=>o.id===currentOrderId); if(o && ttn){ o.status='shipping'; o.statusText='В дорозі'; o.ttn=ttn; saveSales(); renderSales(); updateStats(); } closeModal('ttnModal'); document.getElementById('ttnNumber').value=''; }
function cancelOrder(id) { if(confirm('Скасувати замовлення?')){ let o = salesOrders.find(o=>o.id===id); if(o){ o.status='cancelled'; o.statusText='Відхилено'; saveSales(); renderSales(); updateStats(); } } }

function searchSales() {
    let q = document.getElementById('salesSearch')?.value.toLowerCase();
    if(!q) { renderSales(); return; }
    let filtered = salesOrders.filter(o => o.orderNumber.toLowerCase().includes(q) || o.product.toLowerCase().includes(q));
    let container = document.getElementById('salesList');
    if(filtered.length===0) { container.innerHTML = '<div class="empty-state">📦 Нічого не знайдено</div>'; return; }
    container.innerHTML = filtered.map(order => `<div class="order-card">${order.orderNumber} - ${order.product}</div>`).join('');
}

function renderPurchases() {
    let container = document.getElementById('purchasesList');
    if(!container) return;
    if(purchaseOrders.length===0) { container.innerHTML = '<div class="empty-state">🛍️ Немає покупок</div>'; return; }
    container.innerHTML = purchaseOrders.map(order => `
        <div class="order-card"><div class="order-header"><div class="order-number">${order.orderNumber}</div><div class="order-status status-${order.status}">${order.statusText}</div></div>
        <div class="order-product"><img class="order-product-img" src="${order.productImage}"><div class="order-product-info"><h4>${order.product}</h4><div class="order-product-price">${order.price} грн</div></div></div>
        <div class="order-details"><div>🏪 ${order.seller}</div><div>📅 ${order.date}</div><div class="order-actions">${order.status==='shipping'?`<button class="order-btn order-btn-primary" onclick="trackOrderByNumber('${order.ttn}')">🔍 Відстежити</button>`:''}</div></div></div>
    `).join('');
}

function trackOrder() { let ttn = document.getElementById('trackingNumber')?.value; if(ttn) trackOrderByNumber(ttn); else alert('Введіть номер ТТН'); }
function trackOrderByNumber(ttn) {
    let res = document.getElementById('trackingResult');
    res.style.display = 'block';
    res.innerHTML = `<h3>📮 Відстеження #${ttn}</h3><div class="tracking-timeline"><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-status">Замовлення оформлено</div><div class="timeline-date">${new Date().toLocaleDateString()}</div></div></div><div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-status">В дорозі</div><div class="timeline-date">Очікується</div></div></div></div><button class="btn-secondary" onclick="document.getElementById('trackingResult').style.display='none'">Закрити</button>`;
}

function selectMethod(m) { alert(`Вибрано спосіб доставки`); }
function saveDeliverySettings() { let s = { defaultBranch: document.getElementById('defaultBranch')?.value, defaultIndex: document.getElementById('defaultIndex')?.value, deliveryPhone: document.getElementById('deliveryPhone')?.value }; localStorage.setItem('fastik_delivery_settings', JSON.stringify(s)); showToast('Налаштування збережено!'); }
function showToast(m) { let t = document.createElement('div'); t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#00a49f;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999'; t.textContent = m; document.body.appendChild(t); setTimeout(()=>t.remove(),2000); }
function closeModal(id) { let m = document.getElementById(id); if(m) m.style.display = 'none'; }
}
initDelivery();