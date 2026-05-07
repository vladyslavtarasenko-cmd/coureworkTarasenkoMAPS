// ========== ДАНІ ЧАТУ ==========
let currentUser = null;
let activeChatId = null;
let allChats = [];
let chatMessages = {};

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    loadChats();
    setupChatSearch();
    setupChatTabs();
});

// Завантаження користувача
function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = { name: 'Владислав', email: 'vlad@example.com' };
    }
}

// Завантаження чатів
function loadChats() {
    const saved = localStorage.getItem('fastik_chats');
    if (saved) {
        allChats = JSON.parse(saved);
    } else {
        // Демо-чати
        allChats = [
            {
                id: 1,
                name: 'Світлана',
                avatar: 'С',
                lastMessage: 'Вітаю! Купувала в Україні, не можу брати ві...',
                time: '31.01',
                unread: true,
                online: false,
                messages: [
                    { id: 1, text: 'Добрий день! Цікавить товар', sender: 'other', time: '10:30', read: true },
                    { id: 2, text: 'Вітаю! Так, товар ще актуальний', sender: 'me', time: '10:32', read: true },
                    { id: 3, text: 'Вітаю! Купувала в Україні, не можу брати ві...', sender: 'other', time: '11:00', read: false }
                ]
            },
            {
                id: 2,
                name: 'Олександр',
                avatar: 'О',
                lastMessage: 'Добрий день, товар ще актуальний?',
                time: '30.01',
                unread: true,
                online: true,
                messages: [
                    { id: 1, text: 'Добрий день, товар ще актуальний?', sender: 'other', time: '15:20', read: false }
                ]
            },
            {
                id: 3,
                name: 'Марія',
                avatar: 'М',
                lastMessage: 'Дякую за покупку!',
                time: '28.01',
                unread: false,
                online: false,
                messages: [
                    { id: 1, text: 'Добрий день! Отримала посилку', sender: 'other', time: '09:15', read: true },
                    { id: 2, text: 'Чудово! Дякую за покупку', sender: 'me', time: '09:20', read: true },
                    { id: 3, text: 'Дякую за покупку!', sender: 'other', time: '09:22', read: true }
                ]
            },
            {
                id: 4,
                name: 'Андрій',
                avatar: 'А',
                lastMessage: 'Коли зможете відправити?',
                time: '27.01',
                unread: false,
                online: false,
                messages: [
                    { id: 1, text: 'Коли зможете відправити?', sender: 'other', time: '14:00', read: true },
                    { id: 2, text: 'Завтра вранці', sender: 'me', time: '14:05', read: true }
                ]
            }
        ];
        saveChats();
    }
    
    updateUnreadCount();
    renderChatList();
}

// Збереження чатів
function saveChats() {
    localStorage.setItem('fastik_chats', JSON.stringify(allChats));
}

// Оновлення лічильника непрочитаних
function updateUnreadCount() {
    const unreadCount = allChats.filter(chat => chat.unread).length;
    const badge = document.getElementById('unreadCount');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
}

// Рендер списку чатів
function renderChatList(filter = 'all', search = '') {
    const container = document.getElementById('chatList');
    if (!container) return;
    
    let filteredChats = [...allChats];
    
    if (filter === 'unread') {
        filteredChats = filteredChats.filter(chat => chat.unread);
    }
    
    if (search) {
        const query = search.toLowerCase();
        filteredChats = filteredChats.filter(chat => 
            chat.name.toLowerCase().includes(query)
        );
    }
    
    if (filteredChats.length === 0) {
        container.innerHTML = `
            <div class="chat-placeholder" style="padding: 40px 20px;">
                <p style="color: #999;">Немає повідомлень</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredChats.map(chat => `
        <div class="chat-item ${chat.unread ? 'unread' : ''} ${activeChatId === chat.id ? 'active' : ''}" 
             onclick="openChat(${chat.id})">
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-name">
                    <h4>${chat.name}</h4>
                    <span class="chat-time">${chat.time}</span>
                </div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            ${chat.unread ? '<div class="unread-indicator"></div>' : ''}
        </div>
    `).join('');
}

// Налаштування пошуку
function setupChatSearch() {
    const searchInput = document.getElementById('chatSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.chat-tab.active')?.dataset.filter || 'all';
            renderChatList(activeFilter, e.target.value);
        });
    }
}

// Налаштування вкладок
function setupChatTabs() {
    const tabs = document.querySelectorAll('.chat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            const search = document.getElementById('chatSearch')?.value || '';
            renderChatList(filter, search);
        });
    });
}

// Відкриття чату
function openChat(chatId) {
    activeChatId = chatId;
    const chat = allChats.find(c => c.id === chatId);
    
    if (!chat) return;
    
    // Позначаємо як прочитаний
    if (chat.unread) {
        chat.unread = false;
        saveChats();
        updateUnreadCount();
        renderChatList();
    }
    
    renderChatWindow(chat);
    renderChatList();
}

// Рендер вікна чату
function renderChatWindow(chat) {
    const mainContainer = document.getElementById('chatMain');
    if (!mainContainer) return;
    
    const messagesHtml = chat.messages.map(msg => `
        <div class="message ${msg.sender === 'me' ? 'outgoing' : 'incoming'}">
            <div class="message-bubble">${escapeHtml(msg.text)}</div>
            <div class="message-time">
                ${msg.time}
                ${msg.sender === 'me' ? `<span class="message-status">${msg.read ? '✓✓' : '✓'}</span>` : ''}
            </div>
        </div>
    `).join('');
    
    mainContainer.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-info">
                <div class="chat-header-avatar">${chat.avatar}</div>
                <div class="chat-header-name">
                    <h3>${chat.name}</h3>
                    <span class="chat-header-status">${chat.online ? '🟢 В мережі' : '⚫ Був(ла) нещодавно'}</span>
                </div>
            </div>
            <div class="chat-header-actions">
                <button onclick="alert('Функція в розробці')">📞</button>
                <button onclick="alert('Функція в розробці')">ℹ️</button>
            </div>
        </div>
        <div class="chat-messages-area" id="chatMessagesArea">
            ${messagesHtml}
        </div>
        <div class="chat-input-area">
            <button class="attach-btn" onclick="attachFile()">📎</button>
            <input type="text" id="messageInput" placeholder="Напишіть повідомлення..." onkeypress="handleKeyPress(event)">
            <button class="chat-send-btn" onclick="sendMessage(${chat.id})">➤</button>
        </div>
    `;
    
    // Скрол до низу
    setTimeout(() => {
        const area = document.getElementById('chatMessagesArea');
        if (area) area.scrollTop = area.scrollHeight;
    }, 100);
}

// Відправка повідомлення
function sendMessage(chatId) {
    const input = document.getElementById('messageInput');
    const messageText = input?.value.trim();
    
    if (!messageText) return;
    
    const chat = allChats.find(c => c.id === chatId);
    if (!chat) return;
    
    const newMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        read: false
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = messageText;
    chat.time = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
    chat.unread = false;
    
    saveChats();
    
    // Очистити input
    input.value = '';
    
    // Оновити вікно чату
    renderChatWindow(chat);
    renderChatList();
}

// Обробка натискання Enter
function handleKeyPress(event) {
    if (event.key === 'Enter' && activeChatId) {
        sendMessage(activeChatId);
    }
}

// Новий чат
function openNewChatModal() {
    document.getElementById('newMessageModal').style.display = 'flex';
}

function sendNewMessage() {
    const recipient = document.getElementById('newMessageRecipient').value;
    const text = document.getElementById('newMessageText').value;
    
    if (!recipient || !text) {
        alert('Заповніть всі поля');
        return;
    }
    
    // Створення нового чату
    const newChat = {
        id: Date.now(),
        name: recipient.split('@')[0],
        avatar: recipient.charAt(0).toUpperCase(),
        lastMessage: text,
        time: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
        unread: false,
        online: false,
        messages: [
            { id: 1, text: text, sender: 'me', time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }), read: true }
        ]
    };
    
    allChats.unshift(newChat);
    saveChats();
    
    closeModal('newMessageModal');
    document.getElementById('newMessageRecipient').value = '';
    document.getElementById('newMessageText').value = '';
    
    renderChatList();
    openChat(newChat.id);
}

// Прикріплення файлу
function attachFile() {
    alert('Функція прикріплення файлів буде доступна найближчим часом');
}

// Закриття модального вікна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Функція зміни мови
function changeLanguage() {
    const select = document.getElementById('langSelect');
    if (select) {
        alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}