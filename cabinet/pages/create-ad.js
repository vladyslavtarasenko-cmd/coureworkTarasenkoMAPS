(function() {
    // ========== ЗМІННІ ==========
    let uploadedPhotos = [];
    let currentUser = null;

    const categorySpecs = {
        electronics: [
            { name: "brand", label: "Марка", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Huawei", "Nokia", "Інше"] },
            { name: "condition", label: "Стан", type: "select", options: ["Нове", "Вживане", "Потребує ремонту"] },
            { name: "os", label: "Операційна система", type: "select", options: ["iOS", "Android", "Windows", "Інше"] },
            { name: "screen", label: "Діагональ екрану", type: "select", options: ['До 4"', '4-5"', '5-6"', '6-7"', 'Понад 7"'] },
            { name: "memory", label: "Пам'ять", type: "select", options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] }
        ],
        transport: [
            { name: "brand", label: "Марка", type: "text", placeholder: "Toyota, BMW, Tesla..." },
            { name: "year", label: "Рік випуску", type: "number", placeholder: "2020" },
            { name: "mileage", label: "Пробіг (км)", type: "number", placeholder: "50000" },
            { name: "fuel", label: "Паливо", type: "select", options: ["Бензин", "Дизель", "Електро", "Гібрид", "Газ"] },
            { name: "transmission", label: "Коробка передач", type: "select", options: ["Механіка", "Автомат", "Робот", "Варіатор"] }
        ],
        home: [
            { name: "condition", label: "Стан", type: "select", options: ["Нове", "Вживане", "Потребує ремонту"] },
            { name: "material", label: "Матеріал", type: "text", placeholder: "Дерево, метал, пластик..." },
            { name: "color", label: "Колір", type: "text", placeholder: "Білий, чорний, коричневий..." }
        ]
    };

    const subcategories = {
        electronics: ["Смартфони", "Ноутбуки", "Планшети", "Телевізори", "Аудіотехніка", "Фототехніка", "Гаджети"],
        transport: ["Легкові авто", "Мотоцикли", "Велосипеди", "Вантажівки", "Запчастини", "Шини та диски"],
        home: ["Меблі", "Побутова техніка", "Декор", "Інструменти", "Кухонне приладдя", "Освітлення"],
        fashion: ["Чоловічий одяг", "Жіночий одяг", "Взуття", "Аксесуари", "Дитячий одяг"],
        hobby: ["Спортінвентар", "Книги", "Іграшки", "Музичні інструменти", "Полювання та риболовля"]
    };

    function initCreateAd() {
        loadUser();
        setupCharacterCounters();
        setupCategoryListener();
        
        const locationInput = document.getElementById('adLocation');
        if (locationInput) locationInput.value = localStorage.getItem('user_location') || 'Київ';
        
        const contactInput = document.getElementById('adContact');
        if (contactInput && currentUser) contactInput.value = currentUser.name || '';
        
        setupPriceLogic();
    }

    function loadUser() {
        const saved = localStorage.getItem('fastik_user');
        if (saved) currentUser = JSON.parse(saved);
    }

    function setupCharacterCounters() {
        const titleInput = document.getElementById('adTitle');
        const descInput = document.getElementById('adDescription');
        if (titleInput) titleInput.addEventListener('input', () => {
            const el = document.getElementById('titleChars');
            if (el) el.textContent = titleInput.value.length;
        });
        if (descInput) descInput.addEventListener('input', () => {
            const el = document.getElementById('descChars');
            if (el) el.textContent = descInput.value.length;
        });
    }

    function setupCategoryListener() {
        const categorySelect = document.getElementById('adCategory');
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                loadSubcategories(categorySelect.value);
                loadSpecs(categorySelect.value);
            });
        }
    }

    function loadSubcategories(category) {
        const subcatSection = document.getElementById('subcategorySection');
        const subcatSelect = document.getElementById('adSubcategory');
        if (!subcatSection || !subcatSelect) return;
        if (subcategories[category]?.length) {
            subcatSection.style.display = 'block';
            subcatSelect.innerHTML = '<option value="">Оберіть підкатегорію</option>' + subcategories[category].map(sub => `<option value="${sub}">${sub}</option>`).join('');
        } else {
            subcatSection.style.display = 'none';
        }
    }

    function loadSpecs(category) {
        const specsSection = document.getElementById('specsSection');
        const specsContainer = document.getElementById('specsContainer');
        if (!specsSection || !specsContainer) return;
        const specs = categorySpecs[category];
        if (specs?.length) {
            specsSection.style.display = 'block';
            specsContainer.innerHTML = specs.map(spec => {
                if (spec.type === 'select') {
                    return `<div class="spec-row"><label>${spec.label}</label><select name="${spec.name}" class="spec-input"><option value="">Виберіть</option>${spec.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select></div>`;
                } else {
                    return `<div class="spec-row"><label>${spec.label}</label><input type="${spec.type}" name="${spec.name}" placeholder="${spec.placeholder || ''}" class="spec-input"></div>`;
                }
            }).join('');
        } else {
            specsSection.style.display = 'none';
        }
    }

    function handlePhotos(input) {
        const files = Array.from(input.files);
        files.forEach(file => {
            if (uploadedPhotos.length >= 8) { alert('Можна додати максимум 8 фото'); return; }
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedPhotos.push({ id: Date.now() + Math.random(), url: e.target.result, file: file });
                updatePhotoPreview();
            };
            reader.readAsDataURL(file);
        });
        input.value = '';
    }

    function updatePhotoPreview() {
        const preview = document.getElementById('photoPreview');
        if (!preview) return;
        if (uploadedPhotos.length) {
            preview.innerHTML = uploadedPhotos.map(photo => `<div class="preview-image"><img src="${photo.url}" alt="Фото"><button class="remove-photo" onclick="removePhoto(${photo.id})">×</button></div>`).join('');
        } else {
            preview.innerHTML = '';
        }
    }

    function removePhoto(id) {
        uploadedPhotos = uploadedPhotos.filter(p => p.id !== id);
        updatePhotoPreview();
    }

    function setupPriceLogic() {
        const freeCheckbox = document.getElementById('priceFree');
        const priceInput = document.getElementById('adPrice');
        const negotiableCheckbox = document.getElementById('priceNegotiable');
        if (freeCheckbox) {
            freeCheckbox.addEventListener('change', () => {
                if (freeCheckbox.checked) {
                    priceInput.value = 0;
                    priceInput.disabled = true;
                    if (negotiableCheckbox) negotiableCheckbox.disabled = true;
                } else {
                    priceInput.disabled = false;
                    if (negotiableCheckbox) negotiableCheckbox.disabled = false;
                }
            });
        }
    }

    function submitAd(event) {
        event.preventDefault();
        const title = document.getElementById('adTitle')?.value;
        const category = document.getElementById('adCategory')?.value;
        const subcategory = document.getElementById('adSubcategory')?.value;
        const price = document.getElementById('priceFree')?.checked ? 0 : parseFloat(document.getElementById('adPrice')?.value || 0);
        const description = document.getElementById('adDescription')?.value;
        const location = document.getElementById('adLocation')?.value;
        const contact = document.getElementById('adContact')?.value || currentUser?.name || 'Користувач';
        const phone = document.getElementById('adPhone')?.value;
        const isNegotiable = document.getElementById('priceNegotiable')?.checked;
        const isExchange = document.getElementById('priceExchange')?.checked;
        const isFree = document.getElementById('priceFree')?.checked;
        const autoRenew = document.getElementById('autoRenew')?.checked;

        if (!title || title.length < 16) { alert('Назва повинна містити щонайменше 16 символів'); return; }
        if (!category) { alert('Виберіть категорію'); return; }
        if (!price && price !== 0 && !isFree) { alert('Вкажіть ціну'); return; }
        if (!description || description.length < 40) { alert('Опис повинен містити щонайменше 40 символів'); return; }
        if (!location) { alert('Вкажіть місцезнаходження'); return; }

        const specs = {};
        document.querySelectorAll('.spec-input').forEach(input => { if (input.value) specs[input.name] = input.value; });

        const newAd = {
            id: Date.now(), title, category, subcategory: subcategory || '', price, description, location, contact, phone: phone || '',
            isNegotiable, isExchange, isFree, autoRenew, specs, images: uploadedPhotos.map(p => p.url),
            date: new Date().toLocaleDateString('uk-UA'), userId: currentUser?.email || 'guest', views: 0, active: true
        };

        let existingAds = JSON.parse(localStorage.getItem('fastik_ads') || '[]');
        existingAds.unshift(newAd);
        localStorage.setItem('fastik_ads', JSON.stringify(existingAds));

        let myAds = JSON.parse(localStorage.getItem('myAds') || '[]');
        myAds.unshift(newAd);
        localStorage.setItem('myAds', JSON.stringify(myAds));

        alert('Оголошення успішно опубліковано!');
        window.location.href = '../index.html';
    }

    function changeLanguage() {
        const select = document.getElementById('langSelect');
        if (select) alert(`Мову змінено на ${select.options[select.selectedIndex].text}`);
    }

    // Глобальні функції для HTML
    window.handlePhotos = handlePhotos;
    window.removePhoto = removePhoto;
    window.submitAd = submitAd;
    window.changeLanguage = changeLanguage;

    initCreateAd();
})();