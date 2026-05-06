let ads = [
    {
        id: 1,
        title: "iPhone 13 Pro 128GB",
        price: 15000,
        description: "В отличном состоянии, полный комплект. Батарея 85%.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
        date: "05.05.2026, 10:30"
    },
    {
        id: 2,
        title: "Велосипед Trek Marlin 5",
        price: 12000,
        description: "Горный велосипед, рама L, колеса 29. Состояние хорошее.",
        category: "transport",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
        date: "04.05.2026, 14:00"
    },
    {
        id: 3,
        title: "Диван угловой",
        price: 8500,
        description: "Раскладной диван, серый цвет, ткань легко чистится.",
        category: "home",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
        date: "03.05.2026, 18:45"
    }
];

let currentCategory = 'all';
let currentLang = 'uk';

const translations = {
    uk: {
        title: "FasTik — Дошка оголошень",
        searchPlaceholder: "Пошук по оголошенням...",
        searchBtn: "Знайти",
        loginBtn: "Увійти",
        addBtn: "+ Подати оголошення",
        categories: {
            all: "Всі",
            electronics: "Електроніка",
            transport: "Транспорт",
            home: "Для дому"
        },
        auth: {
            facebook: "Продовжити через Facebook",
            apple: "Продовжити через Apple",
            google: "Продовжити через Google",
            or: "ЧИ",
            loginTab: "Увійти",
            registerTab: "Зареєструватися",
            emailLabel: "Електронна пошта чи телефон",
            emailPlaceholder: "example@email.com або номер телефону",
            passwordLabel: "Пароль",
            passwordPlaceholder: "Введіть пароль",
            forgot: "Забули пароль?",
            submit: "Увійти",
            terms: 'Під час входу ви погоджуєтеся з нашими <a href="#">Умовами користування</a>.'
        },
        adModal: {
            title: "Нове оголошення",
            titleInput: "Назва товару",
            priceInput: "Ціна (грн)",
            descInput: "Опис товару",
            submitBtn: "Опублікувати"
        }
    },
    en: {
        title: "FasTik — Ads Board",
        searchPlaceholder: "Search for ads...",
        searchBtn: "Search",
        loginBtn: "Log in",
        addBtn: "+ Post Ad",
        categories: {
            all: "All",
            electronics: "Electronics",
            transport: "Transport",
            home: "For home"
        },
        auth: {
            facebook: "Continue with Facebook",
            apple: "Continue with Apple",
            google: "Continue with Google",
            or: "OR",
            loginTab: "Log in",
            registerTab: "Sign up",
            emailLabel: "Email or phone",
            emailPlaceholder: "example@email.com or phone number",
            passwordLabel: "Password",
            passwordPlaceholder: "Enter password",
            forgot: "Forgot password?",
            submit: "Log in",
            terms: 'By logging in, you agree to our <a href="#">Terms of use</a>.'
        },
        adModal: {
            title: "New Ad",
            titleInput: "Product name",
            priceInput: "Price (UAH)",
            descInput: "Description",
            submitBtn: "Publish"
        }
    }
};

function renderAds(adsToRender) {
    const adsGrid = document.getElementById('adsGrid');
    adsGrid.innerHTML = '';

    if (adsToRender.length === 0) {
        adsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 30px;">Объявлений не найдено.</p>`;
        return;
    }

    adsToRender.forEach(ad => {
        const card = document.createElement('div');
        card.classList.add('ad-card');
        const imgUrl = ad.image || 'https://via.placeholder.com/250?text=FasTik';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${ad.title}">
            <div class="ad-card-body">
                <div class="ad-title">${ad.title}</div>
                <div class="ad-price">${ad.price} грн</div>
                <div class="ad-desc">${ad.description}</div>
                <div class="ad-date">${ad.date}</div>
            </div>
        `;
        adsGrid.appendChild(card);
    });
}

function filterCategory(category) {
    currentCategory = category;
    
    const buttons = document.querySelectorAll('.categories button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (category === 'all') document.getElementById('catAll').classList.add('active');
    else if (category === 'electronics') document.getElementById('catElectronics').classList.add('active');
    else if (category === 'transport') document.getElementById('catTransport').classList.add('active');
    else if (category === 'home') document.getElementById('catHome').classList.add('active');

    if (category === 'all') {
        renderAds(ads);
    } else {
        const filtered = ads.filter(ad => ad.category === category);
        renderAds(filtered);
    }
}

function searchAds() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = ads.filter(ad => 
        ad.title.toLowerCase().includes(query) || 
        ad.description.toLowerCase().includes(query)
    );
    renderAds(filtered);
}

// Управління модальними вікнами
function openModal() {
    document.getElementById('adModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('adModal').style.display = 'none';
}

function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Додати новий товар
function addAd(event) {
    event.preventDefault();

    const title = document.getElementById('titleInput').value;
    const price = parseFloat(document.getElementById('priceInput').value);
    const description = document.getElementById('descInput').value;
    const category = document.getElementById('categoryInput').value;
    let image = document.getElementById('imageInput').value;

    if (!image) {
        image = 'https://images.unsplash.com/photo-1593085260756-2297bbc1640a?w=500';
    }

    const newAd = {
        id: Date.now(),
        title,
        price,
        description,
        category,
        image,
        date: new Date().toLocaleString()
    };

    ads.unshift(newAd);
    renderAds(ads);
    closeModal();

    document.getElementById('adForm').reset();
}

// Перемикач вкладок входу
function switchTab(tabName) {
    const loginTab = document.getElementById('authTabLogin');
    const registerTab = document.getElementById('authTabRegister');
    const submitBtn = document.getElementById('authSubmitBtn');
    
    if (tabName === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        submitBtn.innerText = translations[currentLang].auth.submit;
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        submitBtn.innerText = translations[currentLang].auth.registerTab;
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('authPassword');
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function socialAuth(provider) {
    alert(`Авторизація через ${provider} зараз не підключена.`);
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    alert(`Успішно! Дані для входу: ${email}`);
    closeAuthModal();
    document.getElementById('authForm').reset();
    
    // Показати кнопку кабінету, сховати кнопку входу
    document.getElementById('headerLoginBtn').style.display = 'none';
    document.getElementById('cabinetBtn').style.display = 'inline-block';
}

// Зміна мови
function changeLanguage() {
    currentLang = document.getElementById('langSelect').value;
    updateLanguageTexts();
}

function updateLanguageTexts() {
    const t = translations[currentLang];
    document.title = t.title;
    
    document.getElementById('headerSearchBtn').innerText = t.searchBtn;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('headerLoginBtn').innerText = t.loginBtn;
    document.getElementById('headerAddBtn').innerText = t.addBtn;
    
    document.getElementById('catAll').innerText = t.categories.all;
    document.getElementById('catElectronics').innerText = t.categories.electronics;
    document.getElementById('catTransport').innerText = t.categories.transport;
    document.getElementById('catHome').innerText = t.categories.home;

    document.getElementById('authFacebook').innerText = t.auth.facebook;
    document.getElementById('authApple').innerText = t.auth.apple;
    document.getElementById('authGoogle').innerText = t.auth.google;
    document.getElementById('authOr').innerText = t.auth.or;
    document.getElementById('authTabLogin').innerText = t.auth.loginTab;
    document.getElementById('authTabRegister').innerText = t.auth.registerTab;
    
    document.getElementById('authEmailLabel').innerText = t.auth.emailLabel;
    document.getElementById('authEmail').placeholder = t.auth.emailPlaceholder;
    document.getElementById('authPasswordLabel').innerText = t.auth.passwordLabel;
    document.getElementById('authPassword').placeholder = t.auth.passwordPlaceholder;
    document.getElementById('authForgot').innerText = t.auth.forgot;
    
    const activeTab = document.querySelector('.tab.active').id;
    if (activeTab === 'authTabLogin') {
        document.getElementById('authSubmitBtn').innerText = t.auth.submit;
    } else {
        document.getElementById('authSubmitBtn').innerText = t.auth.registerTab;
    }
    
    document.getElementById('authTerms').innerHTML = t.auth.terms;

    document.getElementById('adModalTitle').innerText = t.adModal.title;
    document.getElementById('titleInput').placeholder = t.adModal.titleInput;
    document.getElementById('priceInput').placeholder = t.adModal.priceInput;
    document.getElementById('descInput').placeholder = t.adModal.descInput;
    document.getElementById('adSubmitBtn').innerText = t.adModal.submitBtn;
}

document.addEventListener('DOMContentLoaded', () => {
    renderAds(ads);
    updateLanguageTexts();
});