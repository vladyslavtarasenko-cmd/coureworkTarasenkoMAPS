let currentLang = 'uk';

const cabinetTranslations = {
    uk: {
        ads: "Оголошення",
        chats: "Чат",
        payments: "Платежі та рахунок OLX",
        rating: "Рейтинг",
        jobs: "Шукаю роботу",
        employers: "Роботодавці на OLX",
        "profile-settings": "Профіль",
        settings: "Налаштування",
        delivery: "OLX Доставка",
        favoritesAds: "Оголошення",
        favoritesSearches: "Пошуки",
        logout: "Вийти",
        content: {
            ads: "У вас немає активних оголошень.",
            chats: "Немає нових повідомлень.",
            payments: "Ваш баланс 0.00 грн.",
            rating: "Ваш поточний рейтинг відсутній.",
            jobs: "Тут відображатимуться ваші резюме та пошук роботи.",
            employers: "Інформація про роботодавців в системі.",
            "profile-settings": "Редагування вашого профілю.",
            settings: "Налаштування безпеки та сповіщень.",
            delivery: "У вас немає замовлень через OLX Доставку."
        }
    },
    en: {
        ads: "Ads",
        chats: "Chats",
        payments: "Payments & OLX Wallet",
        rating: "Rating",
        jobs: "Looking for a job",
        employers: "Employers on OLX",
        "profile-settings": "Profile",
        settings: "Settings",
        delivery: "OLX Delivery",
        favoritesAds: "Ads",
        favoritesSearches: "Searches",
        logout: "Log out",
        content: {
            ads: "You do not have any active ads.",
            chats: "No new messages.",
            payments: "Your balance is 0.00 UAH.",
            rating: "No rating available currently.",
            jobs: "Your resumes and job search will be displayed here.",
            employers: "Information about employers in the system.",
            "profile-settings": "Edit your profile details.",
            settings: "Security and notification settings.",
            delivery: "You have no OLX Delivery orders."
        }
    }
};

function switchCabinetTab(tabName) {
    // Змінюємо клас active для навігації
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Знаходимо потрібний елемент
    event.target.classList.add('active');

    const contentTitle = document.getElementById('contentTitle');
    const contentBody = document.getElementById('contentBody');
    
    // Переклад
    const t = cabinetTranslations[currentLang];
    
    contentTitle.innerText = event.target.innerText; // Встановлюємо назву з меню
    
    let textKey = tabName;
    if (t.content[textKey]) {
        contentBody.innerHTML = `<p>${t.content[textKey]}</p>`;
    } else {
        contentBody.innerHTML = `<p>Дані завантажуються...</p>`;
    }
}

function changeLanguageCabinet() {
    currentLang = document.getElementById('langSelectCabinet').value;
    // Оновлення тексту в кабінеті
    const t = cabinetTranslations[currentLang];
    
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.innerText.includes("Оголошення") && !el.closest('.favorites-section')) el.innerText = t.ads;
        if (el.innerText.includes("Чат")) el.innerText = t.chats;
        if (el.innerText.includes("Платежі")) el.innerText = t.payments;
        if (el.innerText.includes("Рейтинг")) el.innerText = t.rating;
        if (el.innerText.includes("Шукаю роботу")) el.innerText = t.jobs;
        if (el.innerText.includes("Роботодавці")) el.innerText = t.employers;
        if (el.innerText.includes("Профіль")) el.innerText = t["profile-settings"];
        if (el.innerText.includes("Налаштування")) el.innerText = t.settings;
        if (el.innerText.includes("OLX Доставка")) el.innerHTML = `<span>📦</span> ${t.delivery}`;
        if (el.classList.contains('logout-item')) el.innerText = t.logout;
    });

    // Оновлення тексту заголовка поточної вкладки
    const activeEl = document.querySelector('.nav-item.active');
    if (activeEl) {
        // Оновлюємо заголовок
        document.getElementById('contentTitle').innerText = activeEl.innerText;
    }
}

function searchFromCabinet() {
    const q = document.getElementById('searchInput').value;
    window.location.href = `index.html?search=${encodeURIComponent(q)}`;
}

function goToCabinet() {
    window.location.href = 'cabinet.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Встановлюємо базовий контент
    document.getElementById('contentTitle').innerText = cabinetTranslations[currentLang].ads;
});