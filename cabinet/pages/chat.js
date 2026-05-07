// ========== ДАНІ ЧАТУ ==========
let currentUser = null;
let activeChatId = null;
let allChats = [];
let currentFilter = 'all';
let currentSearch = '';

// ========== ІНІЦІАЛІЗАЦІЯ ==========
function initChat() {
    loadUser();
    loadChats();
    setupEventListeners();
    renderChatList();
}

function loadUser() {
    const saved = localStorage.getItem('fastik_user');
    if (saved) {
        currentUser = JSON.parse(saved);
    } else {
        currentUser = { id: 1, name: 'Владислав', email: 'vlad@example.com' };
    }
}

function loadChats() {
    const saved = localStorage.getItem('fastik_chats');
    if (saved) {
        allChats = JSON.parse(saved);
    } else {
        allChats = [
            {
                id: 1, name: 'Світлана', avatar: 'С', lastMessage: 'Вітаю! Купувала в Україні, не можу брати ві...',
                time: '31.01', unread: true, online: false,
                messages: [
                    { id: 1, text: 'Добрий день! Цікавить товар', sender: 'other', time: '10:30', read: true },
                    { id: 2, text: 'Вітаю! Так, товар ще актуальний', sender: 'me', time: '10:32', read: true },
                    { id: 3, text: 'Вітаю! Купувала в Україні, не можу брати ві...', sender: 'other', time: '11:00', read: false }
                ]
            },
            {
                id: 2, name: 'Олександр', avatar: 'О', lastMessage: 'Добрий день, товар ще актуальний?',
                time: '30.01', unread: true, online: true,
                messages: [{ id: 1, text: 'Добрий день, товар ще актуальний?', sender: 'other', time: '15:20', read: false }]
            },
            {
                id: 3, name: 'Марія', avatar: 'М', lastMessage: 'Дякую за покупку!',
                time: '28.01', unread: false, online: false,
                messages: [
                    { id: 1, text: 'Добрий день! Отримала посилку', sender: 'other', time: '09:15', read: true },
                    { id: 2, text: 'Чудово! Дякую за покупку', sender: 'me', time: '09:20', read: true }
                ]
            },
            {
                id: 4, name: 'Андрій', avatar: 'А', lastMessage: 'Коли зможете відправити?',
                time: '27.01', unread: false, online: false,
                messages: [
                    { id: 1, text: 'Коли зможете відправити?', sender: 'other', time: '14:00', read: true },
                    { id: 2, text: 'Завтра вранці', sender: 'me', time: '14:05', read: true }
                ]
            }
        ];
        saveChats();
    }
    updateUnreadCount();
}

function saveChats() {
    localStorage.setItem('fastik_chats', JSON.stringify(allChats));
}

function updateUnreadCount() {
    const unreadCount = allChats.filter(chat => chat.unread).length;
    const badge = document.getElementById('unreadCount');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
}

// ========== РЕНДЕР СПИСКУ ЧАТІВ ==========
function renderChatList() {
    const container = document.getElementById('chatList');
    if (!container) return;
    
    let filtered = [...allChats];
    if (currentFilter === 'unread') filtered = filtered.filter(chat => chat.unread);
    if (currentSearch) {
        filtered = filtered.filter(chat => chat.name.toLowerCase().includes(currentSearch.toLowerCase()));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="chat-placeholder" style="padding:40px"><p style="color:#999">Немає повідомлень</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map(chat => `
        <div class="chat-item ${chat.unread ? 'unread' : ''} ${activeChatId === chat.id ? 'active' : ''}" onclick="openChat(${chat.id})">
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-name"><h4>${chat.name}</h4><span class="chat-time">${chat.time}</span></div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            ${chat.unread ? '<div class="unread-indicator"></div>' : ''}
        </div>
    `).join('');
}

// ========== ВІДКРИТИ ЧАТ ==========
function openChat(chatId) {
    activeChatId = chatId;
    const chat = allChats.find(c => c.id === chatId);
    if (!chat) return;
    
    if (chat.unread) {
        chat.unread = false;
        saveChats();
        updateUnreadCount();
        renderChatList();
    }
    renderChatWindow(chat);
}

function renderChatWindow(chat) {
    const container = document.getElementById('chatMain');
    if (!container) return;
    
    const messagesHtml = chat.messages.map(msg => `
        <div class="message ${msg.sender === 'me' ? 'outgoing' : 'incoming'}">
            <div class="message-bubble">${escapeHtml(msg.text)}</div>
            <div class="message-time">${msg.time}</div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-info">
                <div class="chat-header-avatar">${chat.avatar}</div>
                <div class="chat-header-name">
                    <h3>${chat.name}</h3>
                    <span class="chat-header-status">${chat.online ? '🟢 В мережі' : '⚫ Був нещодавно'}</span>
                </div>
            </div>
            <div class="chat-header-actions">
                <button onclick="alert(\"Функція в розробці\")">📞</button>
                <button onclick="alert(\"Функція в розробці\")">ℹ️</button>
            </div>
        </div>
        <div class="chat-messages-area" id="chatMessagesArea">${messagesHtml}</div>
        <div class="chat-input-area">
            <button class="attach-btn" onclick="alert(\"Функція в розробці\")">📎</button>
            <input type="text" id="messageInput" placeholder="Напишіть повідомлення..." onkeypress="handleKeyPress(event)">
            <button class="chat-send-btn" onclick="sendMessage(${chat.id})">➤</button>
        </div>
    `;
    
    setTimeout(() => {
        const area = document.getElementById('chatMessagesArea');
        if (area) area.scrollTop = area.scrollHeight;
    }, 100);
}

// ========== ВІДПРАВКА ПОВІДОМЛЕННЯ ==========
function sendMessage(chatId) {
    const input = document.getElementById('messageInput');
    const text = input?.value.trim();
    if (!text) return;
    
    const chat = allChats.find(c => c.id === chatId);
    if (!chat) return;
    
    const newMessage = {
        id: Date.now(),
        text: text,
        sender: 'me',
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        read: true
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = text;
    chat.time = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
    chat.unread = false;
    
    saveChats();
    input.value = '';
    renderChatWindow(chat);
    renderChatList();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && activeChatId) {
        sendMessage(activeChatId);
    }
}

// ========== ФІЛЬТРИ ТА ПОШУК ==========
function setupEventListeners() {
    const tabs = document.querySelectorAll('.chat-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderChatList();
        });
    });
    
    const searchInput = document.getElementById('chatSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderChatList();
        });
    }
}

// ========== НОВЕ ПОВІДОМЛЕННЯ ==========
function openNewChatModal() {
    document.getElementById('newChatModal').style.display = 'flex';
}

function closeNewChatModal() {
    document.getElementById('newChatModal').style.display = 'none';
}

function sendNewMessage() {
    const recipient = document.getElementById('newChatRecipient')?.value;
    const text = document.getElementById('newChatMessage')?.value;
    if (!recipient || !text) {
        alert('Заповніть всі поля');
        return;
    }
    
    const newChat = {
        id: Date.now(),
        name: recipient,
        avatar: recipient.charAt(0).toUpperCase(),
        lastMessage: text,
        time: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
        unread: false,
        online: false,
        messages: [{ id: 1, text: text, sender: 'me', time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }), read: true }]
    };
    
    allChats.unshift(newChat);
    saveChats();
    closeNewChatModal();
    document.getElementById('newChatRecipient').value = '';
    document.getElementById('newChatMessage').value = '';
    renderChatList();
    openChat(newChat.id);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ЗАПУСК
initChat();