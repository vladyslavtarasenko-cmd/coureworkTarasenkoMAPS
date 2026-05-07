var notifications = [];
var currentFilter = 'all';

const defaultNotifications = [
    { id: 1, type: 'message', title: 'Нове повідомлення', text: 'Світлана написала вам у чаті', time: '5 хв тому', read: false, icon: '💬' },
    { id: 2, type: 'order', title: 'Нове замовлення', text: 'Олександр замовив iPhone 13 Pro', time: '2 год тому', read: false, icon: '📦' },
    { id: 3, type: 'system', title: 'Модерація', text: 'Ваше оголошення пройшло перевірку', time: 'вчора', read: true, icon: '✅' },
    { id: 4, type: 'message', title: 'Повідомлення', text: 'Марія запитала про товар', time: '2 дні тому', read: true, icon: '💬' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    setupTabs();
    renderNotifications();
});

function loadNotifications() {
    const saved = localStorage.getItem('fastik_notifications');
    notifications = saved ? JSON.parse(saved) : defaultNotifications;
    saveNotifications();
    updateUnreadCount();
}

function saveNotifications() {
    localStorage.setItem('fastik_notifications', JSON.stringify(notifications));
}

function updateUnreadCount() {
    const unread = notifications.filter(n => !n.read).length;
    document.getElementById('unreadCount').textContent = unread;
}

function setupTabs() {
    document.querySelectorAll('.notif-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter = tab.dataset.tab;
            document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderNotifications();
        });
    });
}

function renderNotifications() {
    let filtered = [...notifications];
    if (currentFilter === 'unread') filtered = filtered.filter(n => !n.read);
    else if (currentFilter !== 'all') filtered = filtered.filter(n => n.type === currentFilter);
    
    const container = document.getElementById('notificationsList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-notifications">🔔 У вас поки немає сповіщень</div>';
        return;
    }
    
    container.innerHTML = filtered.map(n => `
        <div class="notification-item ${!n.read ? 'unread' : ''}" onclick="markAsRead(${n.id})">
            <div class="notif-icon">${n.icon}</div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-text">${n.text}</div>
                <div class="notif-time">${n.time}</div>
            </div>
            <div class="notif-actions">
                <button onclick="event.stopPropagation(); deleteNotification(${n.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function markAsRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
        notif.read = true;
        saveNotifications();
        updateUnreadCount();
        renderNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    saveNotifications();
    updateUnreadCount();
    renderNotifications();
}

function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifications();
    updateUnreadCount();
    renderNotifications();
}