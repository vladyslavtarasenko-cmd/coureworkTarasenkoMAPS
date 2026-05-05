// База объявлений, которая запускается вместе с сайтом
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

// Отрисовка товаров на странице
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
                <div class="ad-date">Дата: ${ad.date}</div>
            </div>
        `;
        adsGrid.appendChild(card);
    });
}

// Фильтрация по категориям
function filterCategory(category) {
    currentCategory = category;
    
    // Переключение подсветки кнопок
    const buttons = document.querySelectorAll('.categories button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderAds(ads);
    } else {
        const filtered = ads.filter(ad => ad.category === category);
        renderAds(filtered);
    }
}

// Поиск по заголовку и описанию
function searchAds() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = ads.filter(ad => 
        ad.title.toLowerCase().includes(query) || 
        ad.description.toLowerCase().includes(query)
    );
    renderAds(filtered);
}

// Функции для управления модальным окном
function openModal() {
    document.getElementById('adModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('adModal').style.display = 'none';
}

// Добавление нового объявления
function addAd(event) {
    event.preventDefault(); // чтобы страница не перезагружалась

    const title = document.getElementById('titleInput').value;
    const price = parseFloat(document.getElementById('priceInput').value);
    const description = document.getElementById('descInput').value;
    const category = document.getElementById('categoryInput').value;
    let image = document.getElementById('imageInput').value;

    // Если картинку не указали, используем заглушку
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

    ads.unshift(newAd); // Добавляем в самое начало списка
    renderAds(ads);
    closeModal();

    // Очищаем форму
    document.getElementById('adForm').reset();
}

// Вызываем функцию при запуске сайта
document.addEventListener('DOMContentLoaded', () => {
    renderAds(ads);
});